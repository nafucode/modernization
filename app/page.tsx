"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { generateSurveyHtml } from "./generateHtml";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloorStop {
  floor: string;
  active: boolean;
  height: string;
  frontName: string;
  backName: string;
}

interface PhotoEntry {
  dataUrl: string;
  name: string;
}

interface PhotoItem {
  images: PhotoEntry[];
  notes: string;
}

interface FormState {
  projectName: string;
  size: string;
  cop: string;
  hopLop: string;
  firemanLockBox: string;
  copLength: string; copWidth: string;
  hopLength: string; hopWidth: string;
  fireboxLength: string; fireboxWidth: string;
  entrances: "1" | "2";
  pit: string;
  oh: string;
  shaftHeight: string;
  rising: string;
  floors: FloorStop[];
  photos: Record<number, PhotoItem>;
  otherNote: string;
  otherImages: PhotoEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_FLOORS = [
  "-3F", "-2F", "-1F",
  "1F", "2F", "3F", "4F", "5F", "6F", "7F", "8F", "9F", "10F",
  "11F", "12F", "13F", "14F", "15F", "16F", "17F", "18F", "19F", "20F",
  "21F", "22F", "23F", "24F", "25F", "26F", "27F", "28F", "29F", "30F",
  "31F", "32F", "33F", "34F", "35F",
];

const PHOTO_ITEMS = [
  {
    id: 1,
    title: "Machine Room Panorama",
    required: 1,
    instruction: "Stand at a corner of the machine room and photograph the main machine.",
    exampleImgs: ["/examples/ex1.png"],
    ExSvg: null,
  },
  {
    id: 2,
    title: "Control Cabinet",
    required: 1,
    instruction: "Open the cabinet door. Stand ~1 m away. Clearly show the original installation.",
    exampleImgs: ["/examples/ex2.jpg"],
    ExSvg: null,
  },
  {
    id: 3,
    title: "Control Cabinet Nameplate",
    required: 1,
    instruction: "Wipe off dust. Shoot from ~20 cm. Speed and load parameters must be legible.",
    exampleImgs: ["/examples/ex3.jpg"],
    ExSvg: null,
  },
  {
    id: 4,
    title: "Main Machine Nameplate",
    required: 1,
    instruction: "Wipe off dust. Shoot from ~20 cm. All machine parameters must be legible.",
    exampleImgs: ["/examples/ex4.jpg"],
    ExSvg: null,
  },
  {
    id: 5,
    title: "Brake Nameplate",
    required: 1,
    instruction: "Shoot from ~20 cm — show brake voltage and power. If no nameplate, photograph the multimeter reading when the brake opens.",
    exampleImgs: ["/examples/ex5.jpg"],
    ExSvg: null,
  },
  {
    id: 6,
    title: "Encoder — 2 photos",
    required: 2,
    instruction: "① Encoder nameplate close-up. ② Encoder mounted on the main machine.",
    exampleImgs: ["/examples/ex6a.jpg", "/examples/ex6b.jpg"],
    ExSvg: null,
  },
  {
    id: 7,
    title: "Door Operator — Front View",
    required: 1,
    instruction: "Door closed. Shoot from the hall side, showing the full front of the door operator.",
    exampleImgs: ["/examples/ex7.jpg"],
    ExSvg: null,
  },
  {
    id: 8,
    title: "Timing Belt Dimensions — 2 photos",
    required: 2,
    instruction: "Door closed. Place a tape measure as shown. Photograph the highlighted measurement area.",
    exampleImgs: ["/examples/ex8a.jpg", "/examples/ex8b.png"],
    ExSvg: null,
  },
  {
    id: 9,
    title: "Door Motor — 2 photos",
    required: 2,
    instruction: "① Motor nameplate. ② Motor installation position on the door operator.",
    exampleImgs: ["/examples/ex9a.png", "/examples/ex9b.png"],
    ExSvg: null,
  },
  {
    id: 10,
    title: "Door Controller Wiring — 2 photos",
    required: 2,
    instruction: "① Door operator wiring photo. ② The door-operator section of the electrical schematic inside the control cabinet.",
    exampleImgs: ["/examples/ex10a.png", "/examples/ex10b.jpg"],
    ExSvg: null,
  },
  {
    id: 11,
    title: "Operation Box — 2 photos",
    required: 2,
    instruction: "① Front face of the COP. ② Its installation position inside the car.",
    exampleImgs: ["/examples/ex11a.jpg", "/examples/ex11b.jpg"],
    ExSvg: null,
  },
  {
    id: 12,
    title: "Hall Door — 2 photos",
    required: 2,
    instruction: "① Front of the hall door. ② Hall call button position.",
    exampleImgs: ["/examples/ex12.jpg"],
    ExSvg: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initFloors(): FloorStop[] {
  return ALL_FLOORS.map((f) => ({ floor: f, active: false, height: "", frontName: "", backName: "" }));
}

function initPhotos(): Record<number, PhotoItem> {
  const out: Record<number, PhotoItem> = {};
  PHOTO_ITEMS.forEach((p) => { out[p.id] = { images: [], notes: "" }; });
  return out;
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function Field({
  label, hint, value, onChange, placeholder, type = "text", unit,
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {hint && <span className="ml-1.5 text-xs font-normal text-slate-400">{hint}</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {unit && <span className="text-sm text-slate-400 shrink-0 w-6">{unit}</span>}
      </div>
    </div>
  );
}

function SectionCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shrink-0">
          {number}
        </span>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Photo Upload Card ────────────────────────────────────────────────────────

function PhotoCard({
  item, data, onChange,
}: {
  item: (typeof PHOTO_ITEMS)[0];
  data: PhotoItem;
  onChange: (d: PhotoItem) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Promise.all(
        Array.from(files)
          .filter((f) => f.type.startsWith("image/"))
          .map(
            (f) =>
              new Promise<PhotoEntry>((res) => {
                const r = new FileReader();
                r.onload = (e) => res({ dataUrl: e.target?.result as string, name: f.name });
                r.readAsDataURL(f);
              })
          )
      ).then((entries) => onChange({ ...data, images: [...data.images, ...entries] }));
    },
    [data, onChange]
  );

  const remove = (i: number) =>
    onChange({ ...data, images: data.images.filter((_, idx) => idx !== i) });

  const done = data.images.length >= item.required;
  const partial = data.images.length > 0 && !done;

  const statusColor = done ? "text-green-700 bg-green-50" : partial ? "text-amber-700 bg-amber-50" : "text-slate-500 bg-slate-100";
  const dotColor = done ? "bg-green-500" : partial ? "bg-amber-400" : "bg-slate-400";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-bold shrink-0">
          {item.id}
        </span>
        <p className="font-semibold text-slate-800 text-sm flex-1">{item.title}</p>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {data.images.length}/{item.required}
        </span>
      </div>

      {/* Instruction + example toggle */}
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-start justify-between gap-3">
        <p className="text-sm text-blue-900 leading-relaxed flex-1">{item.instruction}</p>
        <button
          type="button"
          onClick={() => setShowExample((v) => !v)}
          className="shrink-0 text-xs font-semibold text-blue-600 border border-blue-300 rounded-lg px-2.5 py-1 bg-white hover:bg-blue-50 active:bg-blue-100 transition-colors whitespace-nowrap"
        >
          {showExample ? "Hide" : "Example"}
        </button>
      </div>

      {/* Example panel */}
      {showExample && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          {item.exampleImgs.length > 0 ? (
            <div className={`grid gap-2 ${item.exampleImgs.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {item.exampleImgs.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white" style={{ aspectRatio: "4/3" }}>
                  <Image src={src} alt={`Example ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" />
                  {item.exampleImgs.length > 1 && (
                    <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      Photo {i + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
              ) : null}
        </div>
      )}

      {/* Upload area */}
      <div className="p-4 space-y-3">
        {data.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {data.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => remove(idx)}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
                >×</button>
                <div className="absolute bottom-1 left-1 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          className={`photo-drop-zone w-full py-5 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : done
              ? "border-green-300 bg-green-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 active:border-blue-400"
          }`}
        >
          {done ? (
            <>
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-600">All photos uploaded — tap to add more</span>
            </>
          ) : (
            <>
              <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-500">
                Tap to take photo or upload &mdash; need {item.required} photo{item.required > 1 ? "s" : ""}
              </span>
            </>
          )}
        </button>

        <textarea
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Notes (optional)..."
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function OtherNotes({
  note, images, onNoteChange, onImagesChange,
}: {
  note: string;
  images: PhotoEntry[];
  onNoteChange: (v: string) => void;
  onImagesChange: (imgs: PhotoEntry[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Promise.all(
      Array.from(files)
        .filter(f => f.type.startsWith("image/"))
        .map(f => new Promise<PhotoEntry>(res => {
          const r = new FileReader();
          r.onload = e => res({ dataUrl: e.target?.result as string, name: f.name });
          r.readAsDataURL(f);
        }))
    ).then(entries => onImagesChange([...images, ...entries]));
  }, [images, onImagesChange]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </span>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Other Notes</p>
          <p className="text-xs text-slate-400">Additional remarks, photos, or observations</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <textarea
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder="Any additional observations, special conditions, or remarks for this site…"
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => onImagesChange(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
                >×</button>
              </div>
            ))}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => addFiles(e.target.files)} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          className={`photo-drop-zone w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-colors ${
            dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 active:border-blue-400"
          }`}
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-slate-500 font-medium">Tap to attach photos</span>
        </button>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  const [form, setForm] = useState<FormState>({
    projectName: "", size: "", cop: "", hopLop: "", firemanLockBox: "",
    copLength: "", copWidth: "", hopLength: "", hopWidth: "", fireboxLength: "", fireboxWidth: "",
    entrances: "1", pit: "", oh: "", shaftHeight: "", rising: "",
    floors: initFloors(), photos: initPhotos(),
    otherNote: "", otherImages: [],
  });
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof Omit<FormState, "floors" | "photos">, v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const toggleFloor = (i: number) =>
    setForm((p) => {
      const floors = [...p.floors];
      floors[i] = { ...floors[i], active: !floors[i].active };
      return { ...p, floors };
    });

  const updateFloor = (i: number, key: keyof FloorStop, v: string) =>
    setForm((p) => {
      const floors = [...p.floors];
      floors[i] = { ...floors[i], [key]: v };
      return { ...p, floors };
    });

  const updatePhoto = (id: number, d: PhotoItem) =>
    setForm((p) => ({ ...p, photos: { ...p.photos, [id]: d } }));

  const activeFloors = form.floors.filter((f) => f.active);
  const photosComplete = PHOTO_ITEMS.filter(
    (item) => (form.photos[item.id]?.images.length ?? 0) >= item.required
  ).length;

  const handleExport = async () => {
    setExporting(true);
    try {
      const zip = new JSZip();
      const lines = [
        "Electrical Survey Form",
        "=".repeat(40),
        "",
        "[Project Information]",
        `Project Name: ${form.projectName}`,
        `Size: ${form.size}`,
        `COP: ${form.cop}`,
        `HOP/LOP: ${form.hopLop}`,
        `Fireman Lock Box: ${form.firemanLockBox}`,
        `COP box: ${form.copLength || "—"} × ${form.copWidth || "—"} mm`,
        `HOP/LOP box: ${form.hopLength || "—"} × ${form.hopWidth || "—"} mm`,
        `Fireman Lock Box size: ${form.fireboxLength || "—"} × ${form.fireboxWidth || "—"} mm`,
        "",
        "[Shaft & Floor Configuration]",
        `Entrances: ${form.entrances === "1" ? "Single" : "Double"}`,
        `Pit Depth: ${form.pit} m`,
        `Overhead (OH): ${form.oh} m`,
        `Shaft Total Height: ${form.shaftHeight} m`,
        `Rising: ${form.rising} m`,
        "",
        "[Floor Stops]",
        ...activeFloors.map(
          (f) =>
            `${f.floor}: height=${f.height || "-"} m | front=${f.frontName || "-"}${
              form.entrances === "2" ? ` | back=${f.backName || "-"}` : ""
            }`
        ),
        "",
        "[Photos]",
        ...PHOTO_ITEMS.map((item) => {
          const p = form.photos[item.id];
          return [
            `${item.id}. ${item.title}: ${p?.images.length ?? 0} photo(s)`,
            p?.notes ? `   Notes: ${p.notes}` : "",
          ].filter(Boolean).join("\n");
        }),
        "",
        "[Other Notes]",
        form.otherNote || "(none)",
        `Attachments: ${form.otherImages.length} image(s)`,
      ];

      zip.file("survey.txt", lines.join("\n"));

      const photoFolder = zip.folder("photos");
      for (const item of PHOTO_ITEMS) {
        const p = form.photos[item.id];
        if (!p?.images.length) continue;
        const folder = photoFolder?.folder(`${item.id}_${item.title.replace(/[^\w\s-]/g, "").trim()}`);
        p.images.forEach((img, idx) => {
          const ext = img.dataUrl.match(/data:image\/(\w+);/)?.[1] ?? "jpg";
          folder?.file(`${idx + 1}.${ext}`, img.dataUrl.split(",")[1], { base64: true });
        });
      }
      if (form.otherImages.length) {
        const otherFolder = photoFolder?.folder("other_notes");
        form.otherImages.forEach((img, idx) => {
          const ext = img.dataUrl.match(/data:image\/(\w+);/)?.[1] ?? "jpg";
          otherFolder?.file(`${idx + 1}.${ext}`, img.dataUrl.split(",")[1], { base64: true });
        });
      }

      const html = generateSurveyHtml(form);
      zip.file("survey_report.html", html);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey_${form.projectName || "untitled"}_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } finally {
      setExporting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Export complete</h1>
          <p className="text-slate-500 max-w-xs">Your survey data has been packaged. Please send the file to your project manager.</p>
        </div>
        <button
          onClick={() => setDone(false)}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-base active:bg-blue-700"
        >
          Back to form
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">Electrical Survey Form</h1>
            <p className="text-xs text-slate-400">电气勘测信息表</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 whitespace-nowrap">
              <span className="font-bold text-blue-600">{photosComplete}</span>
              <span className="text-slate-400">/{PHOTO_ITEMS.length}</span>
            </span>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* ── 1. Project Info ──────────────────────────────────────────────── */}
        <SectionCard number="1" title="Project Information">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Project Name" value={form.projectName} onChange={(v) => set("projectName", v)} placeholder="Enter project name" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Size" value={form.size} onChange={(v) => set("size", v)} placeholder="e.g. 1000 kg" />
              <Field label="COP" value={form.cop} onChange={(v) => set("cop", v)} placeholder="Model" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="HOP / LOP" value={form.hopLop} onChange={(v) => set("hopLop", v)} placeholder="Model" />
              <Field label="Fireman Lock Box" value={form.firemanLockBox} onChange={(v) => set("firemanLockBox", v)} placeholder="Yes / No" />
            </div>

            {/* Mounting box dimensions — 3-component grid */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Mounting Box Dimensions <span className="text-xs font-normal text-slate-400">mm</span>
              </p>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400" />
                  {["COP", "HOP / LOP", "Fireman Box"].map((h) => (
                    <div key={h} className="px-3 py-2 text-xs font-semibold text-slate-600 text-center">{h}</div>
                  ))}
                </div>
                {/* Length row */}
                <div className="grid grid-cols-4 border-b border-slate-100 bg-white">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 flex items-center">Length</div>
                  {[
                    ["copLength", form.copLength] as const,
                    ["hopLength", form.hopLength] as const,
                    ["fireboxLength", form.fireboxLength] as const,
                  ].map(([key, val]) => (
                    <div key={key} className="px-2 py-1.5">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder="—"
                        className="w-full h-9 px-2 rounded-lg border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                {/* Width row */}
                <div className="grid grid-cols-4 bg-white">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 flex items-center">Width</div>
                  {[
                    ["copWidth", form.copWidth] as const,
                    ["hopWidth", form.hopWidth] as const,
                    ["fireboxWidth", form.fireboxWidth] as const,
                  ].map(([key, val]) => (
                    <div key={key} className="px-2 py-1.5">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder="—"
                        className="w-full h-9 px-2 rounded-lg border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 2. Shaft & Floor ────────────────────────────────────────────── */}
        <SectionCard number="2" title="Shaft & Floor Configuration">
          {/* Entrances */}
          <div className="mb-5">
            <label className="text-sm font-semibold text-slate-700 block mb-2">Door Entrances</label>
            <div className="flex gap-3">
              {(["1", "2"] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("entrances", n)}
                  className={`flex-1 h-11 rounded-xl border-2 text-sm font-semibold transition-colors ${
                    form.entrances === n
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {n === "1" ? "Single entrance" : "Double entrance"}
                </button>
              ))}
            </div>
          </div>

          {/* Shaft dims */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Field label="Pit Depth" value={form.pit} onChange={(v) => set("pit", v)} placeholder="0" type="number" unit="m" />
            <Field label="Overhead (OH)" value={form.oh} onChange={(v) => set("oh", v)} placeholder="0" type="number" unit="m" />
            <Field label="Shaft Total Height" value={form.shaftHeight} onChange={(v) => set("shaftHeight", v)} placeholder="0" type="number" unit="m" />
            <Field label="Rising" value={form.rising} onChange={(v) => set("rising", v)} placeholder="0" type="number" unit="m" />
          </div>

          {/* Floor grid */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Floor Stops
              <span className="ml-1.5 text-xs font-normal text-slate-400">(physical floors in the building)</span>
              {activeFloors.length > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-400">&middot; {activeFloors.length} selected</span>
              )}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {form.floors.map((f, idx) => (
                <button
                  key={f.floor}
                  type="button"
                  onClick={() => toggleFloor(idx)}
                  className={`h-10 rounded-xl text-sm font-medium border transition-colors ${
                    f.active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 active:bg-slate-50"
                  }`}
                >
                  {f.floor}
                </button>
              ))}
              {/* Add custom floor button */}
              <button
                type="button"
                onClick={() => {
                  const name = prompt("Enter floor name (e.g. 36F, M1, RF):");
                  if (!name?.trim()) return;
                  const label = name.trim();
                  if (form.floors.some(f => f.floor === label)) return;
                  setForm(prev => ({
                    ...prev,
                    floors: [...prev.floors, { floor: label, active: true, height: "", frontName: "", backName: "" }],
                  }));
                }}
                className="h-10 rounded-xl text-lg font-bold border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                title="Add custom floor"
              >
                +
              </button>
            </div>

            {activeFloors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Floor details</p>
                {form.floors.map((f, idx) => {
                  if (!f.active) return null;
                  return (
                    <div key={f.floor} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-slate-600 mb-2">{f.floor}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Height (m)</label>
                          <input
                            type="number"
                            value={f.height}
                            onChange={(e) => updateFloor(idx, "height", e.target.value)}
                            placeholder="0.0"
                            className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">
                            Front door label
                            <span className="ml-1 text-slate-400 font-normal">· Display as on COP</span>
                          </label>
                          <input
                            type="text"
                            value={f.frontName}
                            onChange={(e) => updateFloor(idx, "frontName", e.target.value)}
                            placeholder={f.floor}
                            className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {form.entrances === "2" && (
                          <div className="col-span-2">
                            <label className="text-xs text-slate-500 block mb-1">Rear door label</label>
                            <input
                              type="text"
                              value={f.backName}
                              onChange={(e) => updateFloor(idx, "backName", e.target.value)}
                              placeholder={f.floor}
                              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── 3. Photos ───────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shrink-0">3</span>
            <h2 className="text-lg font-bold text-slate-800">On-Site Photos</h2>
            <span className="ml-auto text-sm text-slate-400">{photosComplete}/{PHOTO_ITEMS.length} complete</span>
          </div>
          <div className="space-y-4">
            {PHOTO_ITEMS.map((item) => (
              <PhotoCard
                key={item.id}
                item={item}
                data={form.photos[item.id]}
                onChange={(d) => updatePhoto(item.id, d)}
              />
            ))}
          </div>
        </div>
        {/* ── Other Notes ─────────────────────────────────────────────── */}
        <OtherNotes
          note={form.otherNote}
          images={form.otherImages}
          onNoteChange={(v) => setForm(p => ({ ...p, otherNote: v }))}
          onImagesChange={(imgs) => setForm(p => ({ ...p, otherImages: imgs }))}
        />

      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full h-14 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 active:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-200"
          >
            {exporting ? (
              <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Packaging…</>
            ) : (
              <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Export & Download Survey Data</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

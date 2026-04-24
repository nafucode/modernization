import { jsPDF } from "jspdf";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BLUE   = [37, 99, 235] as const;   // blue-600
const DARK   = [15, 23, 42]  as const;   // slate-900
const MID    = [71, 85, 105] as const;   // slate-500
const LIGHT  = [241, 245, 249] as const; // slate-100
const WHITE  = [255, 255, 255] as const;
const GREEN  = [22, 163, 74]  as const;  // green-600

// ─── Types (mirror page.tsx) ──────────────────────────────────────────────────
interface FloorStop {
  floor: string; active: boolean; height: string; frontName: string; backName: string;
}
interface PhotoEntry { dataUrl: string; name: string; }
interface PhotoItem  { images: PhotoEntry[]; notes: string; }

interface SurveyData {
  projectName: string; size: string; cop: string; hopLop: string;
  firemanLockBox: string; mountingBoxLength: string; mountingBoxWidth: string;
  entrances: "1" | "2"; pit: string; oh: string; shaftHeight: string; rising: string;
  floors: FloorStop[];
  photos: Record<number, PhotoItem>;
}

const PHOTO_TITLES: Record<number, string> = {
  1:  "Machine Room Panorama",
  2:  "Control Cabinet",
  3:  "Control Cabinet Nameplate",
  4:  "Main Machine Nameplate",
  5:  "Brake Nameplate",
  6:  "Encoder — 2 photos",
  7:  "Door Operator — Front View",
  8:  "Timing Belt Dimensions — 2 photos",
  9:  "Door Motor — 2 photos",
  10: "Door Controller Wiring — 2 photos",
  11: "Operation Box — 2 photos",
  12: "Hall Door — 2 photos",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setFill(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setDraw(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}
function setTextColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function pageW(doc: jsPDF) { return doc.internal.pageSize.getWidth(); }
function pageH(doc: jsPDF) { return doc.internal.pageSize.getHeight(); }
const MARGIN = 18;
function contentW(doc: jsPDF) { return pageW(doc) - MARGIN * 2; }

/** Ensure cursor doesn't overflow; add page if needed, return new y */
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > pageH(doc) - 20) {
    doc.addPage();
    return 24;
  }
  return y;
}

/** Render key-value row in a 2-col table */
function kvRow(doc: jsPDF, y: number, label: string, value: string, shade: boolean): number {
  const cw = contentW(doc);
  const rh = 8;
  if (shade) {
    setFill(doc, LIGHT);
    doc.rect(MARGIN, y, cw, rh, "F");
  }
  setTextColor(doc, MID);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(label, MARGIN + 3, y + 5.5);
  setTextColor(doc, DARK);
  doc.setFont("helvetica", "normal");
  doc.text(value || "—", MARGIN + cw * 0.42, y + 5.5);
  return y + rh;
}

/** Section heading bar */
function sectionBar(doc: jsPDF, y: number, title: string, num: string): number {
  const cw = contentW(doc);
  setFill(doc, BLUE);
  doc.roundedRect(MARGIN, y, cw, 10, 2, 2, "F");
  // number circle
  setFill(doc, WHITE);
  doc.circle(MARGIN + 7, y + 5, 4, "F");
  setTextColor(doc, BLUE);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(num, MARGIN + 7, y + 5.8, { align: "center" });
  // title
  setTextColor(doc, WHITE);
  doc.setFontSize(10);
  doc.text(title, MARGIN + 14, y + 6.8);
  return y + 14;
}

/** Thin separator line */
function separator(doc: jsPDF, y: number): number {
  setDraw(doc, LIGHT);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + contentW(doc), y);
  return y + 4;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateSurveyPdf(data: SurveyData): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const cw = contentW(doc);
  let y = 0;

  // ── Cover bar ────────────────────────────────────────────────────────────
  setFill(doc, BLUE);
  doc.rect(0, 0, pageW(doc), 38, "F");

  setTextColor(doc, WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Electrical Survey Form", MARGIN, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("电气勘测信息表", MARGIN, 23);

  // Project name in cover
  if (data.projectName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(data.projectName, MARGIN, 32);
  }

  // Date top-right
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr, pageW(doc) - MARGIN, 32, { align: "right" });

  y = 46;

  // ── Section 1: Project Info ───────────────────────────────────────────────
  y = sectionBar(doc, y, "Project Information", "1");
  const infoRows: [string, string][] = [
    ["Project Name",    data.projectName],
    ["Size",            data.size],
    ["COP",             data.cop],
    ["HOP / LOP",       data.hopLop],
    ["Fireman Lock Box",data.firemanLockBox],
    ["Mounting Box",    `${data.mountingBoxLength || "—"} × ${data.mountingBoxWidth || "—"} mm`],
  ];
  infoRows.forEach(([k, v], i) => { y = kvRow(doc, y, k, v, i % 2 === 0); });
  y += 6;

  // ── Section 2: Shaft & Floor ─────────────────────────────────────────────
  y = ensureSpace(doc, y, 60);
  y = sectionBar(doc, y, "Shaft & Floor Configuration", "2");

  const shaftRows: [string, string][] = [
    ["Door Entrances",    data.entrances === "1" ? "Single" : "Double"],
    ["Pit Depth",         data.pit ? `${data.pit} m` : "—"],
    ["Overhead (OH)",     data.oh ? `${data.oh} m` : "—"],
    ["Shaft Total Height",data.shaftHeight ? `${data.shaftHeight} m` : "—"],
    ["Rising",            data.rising ? `${data.rising} m` : "—"],
  ];
  shaftRows.forEach(([k, v], i) => { y = kvRow(doc, y, k, v, i % 2 === 0); });
  y += 4;

  // Floor stops table
  const activeFloors = data.floors.filter((f) => f.active);
  if (activeFloors.length > 0) {
    // Header row
    const cols = data.entrances === "2"
      ? [["Floor", 0.15], ["Height (m)", 0.2], ["Front Door", 0.3], ["Rear Door", 0.35]] as const
      : [["Floor", 0.15], ["Height (m)", 0.25], ["Front Door", 0.6]] as const;

    setFill(doc, LIGHT);
    doc.rect(MARGIN, y, cw, 7, "F");
    setTextColor(doc, MID);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    let cx = MARGIN + 2;
    for (const [label, frac] of cols) {
      doc.text(label, cx, y + 4.8);
      cx += cw * frac;
    }
    y += 7;

    // Data rows (wrap to new page if needed)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    activeFloors.forEach((f, i) => {
      y = ensureSpace(doc, y, 7);
      if (i % 2 === 0) {
        setFill(doc, [248, 250, 252]);
        doc.rect(MARGIN, y, cw, 6.5, "F");
      }
      setTextColor(doc, DARK);
      let cx2 = MARGIN + 2;
      const rowData =
        data.entrances === "2"
          ? [f.floor, f.height || "—", f.frontName || "—", f.backName || "—"]
          : [f.floor, f.height || "—", f.frontName || "—"];
      rowData.forEach((val, ci) => {
        doc.text(String(val), cx2, y + 4.5);
        cx2 += cw * (cols[ci][1] as number);
      });
      y += 6.5;
    });
  } else {
    setTextColor(doc, MID);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("No floor stops configured.", MARGIN + 2, y + 5);
    y += 10;
  }
  y += 6;

  // ── Section 3: Photos ────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 20);
  y = sectionBar(doc, y, "On-Site Photos", "3");

  for (let id = 1; id <= 12; id++) {
    const photoData = data.photos[id];
    const title = PHOTO_TITLES[id];
    const imgs = photoData?.images ?? [];
    const notes = photoData?.notes ?? "";
    const thumbSize = 38;
    const thumbsPerRow = 4;
    const thumbRows = Math.ceil(imgs.length / thumbsPerRow);
    const blockH = 12 + thumbRows * (thumbSize + 3) + (notes ? 10 : 0) + 6;

    y = ensureSpace(doc, y, blockH);

    // Item header
    setFill(doc, LIGHT);
    doc.roundedRect(MARGIN, y, cw, 9, 1.5, 1.5, "F");

    // Number badge
    setFill(doc, imgs.length > 0 ? GREEN : [148, 163, 184]);
    doc.circle(MARGIN + 6, y + 4.5, 3.5, "F");
    setTextColor(doc, WHITE);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(String(id), MARGIN + 6, y + 5.5, { align: "center" });

    // Title
    setTextColor(doc, DARK);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(title, MARGIN + 12, y + 5.8);

    // Photo count badge (right side)
    const countLabel = `${imgs.length} photo${imgs.length !== 1 ? "s" : ""}`;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    setTextColor(doc, imgs.length > 0 ? GREEN : MID);
    doc.text(countLabel, MARGIN + cw - 2, y + 5.8, { align: "right" });

    y += 11;

    // Thumbnails
    if (imgs.length > 0) {
      let tx = MARGIN;
      let ty = y;
      for (let i = 0; i < imgs.length; i++) {
        if (i > 0 && i % thumbsPerRow === 0) {
          tx = MARGIN;
          ty += thumbSize + 3;
        }
        try {
          const fmt = imgs[i].dataUrl.match(/data:image\/(\w+);/)?.[1]?.toUpperCase() ?? "JPEG";
          doc.addImage(imgs[i].dataUrl, fmt === "JPG" ? "JPEG" : fmt, tx, ty, thumbSize, thumbSize);
          // thin border
          setDraw(doc, [203, 213, 225]);
          doc.setLineWidth(0.3);
          doc.rect(tx, ty, thumbSize, thumbSize);
          // photo number label
          setFill(doc, [0, 0, 0]);
          doc.rect(tx, ty + thumbSize - 5, 8, 5, "F");
          setTextColor(doc, WHITE);
          doc.setFontSize(6);
          doc.text(String(i + 1), tx + 4, ty + thumbSize - 1.2, { align: "center" });
        } catch {
          // skip corrupt image
        }
        tx += thumbSize + 3;
      }
      y = ty + thumbSize + 4;
    }

    // Notes
    if (notes) {
      setTextColor(doc, MID);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "italic");
      const wrapped = doc.splitTextToSize(`Notes: ${notes}`, cw - 4);
      doc.text(wrapped, MARGIN + 2, y + 4);
      y += wrapped.length * 4 + 4;
    }

    y = separator(doc, y);
  }

  // ── Footer on every page ─────────────────────────────────────────────────
  const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setTextColor(doc, [148, 163, 184]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${p} of ${totalPages}  ·  ${data.projectName || "Untitled"}  ·  Generated ${dateStr}`,
      pageW(doc) / 2,
      pageH(doc) - 8,
      { align: "center" }
    );
  }

  return doc.output("blob");
}

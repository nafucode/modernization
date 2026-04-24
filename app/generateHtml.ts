interface FloorStop {
  floor: string; active: boolean; height: string; frontName: string; backName: string;
}
interface PhotoEntry { dataUrl: string; name: string; }
interface PhotoItem  { images: PhotoEntry[]; notes: string; }

export interface SurveyData {
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

function esc(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function kv(label: string, value: string) {
  return `<tr><th>${esc(label)}</th><td>${esc(value || "—")}</td></tr>`;
}

export function generateSurveyHtml(data: SurveyData): string {
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const activeFloors = data.floors.filter(f => f.active);

  // ── Photo sections ──────────────────────────────────────────────────────────
  let photoSections = "";
  for (let id = 1; id <= 12; id++) {
    const p = data.photos[id];
    const imgs = p?.images ?? [];
    const notes = p?.notes ?? "";
    const count = imgs.length;

    const thumbs = imgs.map((img, i) => `
      <figure class="thumb">
        <img src="${img.dataUrl}" alt="Photo ${i+1}" loading="lazy" onclick="openLightbox(this.src)">
        <figcaption>Photo ${i + 1}</figcaption>
      </figure>`).join("");

    const badge = count > 0
      ? `<span class="badge done">${count} photo${count > 1 ? "s" : ""}</span>`
      : `<span class="badge missing">No photos</span>`;

    photoSections += `
    <section class="photo-item">
      <div class="photo-header">
        <div class="num">${id}</div>
        <h3>${esc(PHOTO_TITLES[id])}</h3>
        ${badge}
      </div>
      ${count > 0 ? `<div class="thumbs">${thumbs}</div>` : '<p class="empty">No photos uploaded.</p>'}
      ${notes ? `<p class="notes"><strong>Notes:</strong> ${esc(notes)}</p>` : ""}
    </section>`;
  }

  // ── Floor table ─────────────────────────────────────────────────────────────
  const floorRows = activeFloors.length > 0
    ? activeFloors.map((f, i) => `
      <tr class="${i % 2 === 0 ? "even" : ""}">
        <td><strong>${esc(f.floor)}</strong></td>
        <td>${esc(f.height || "—")} m</td>
        <td>${esc(f.frontName || "—")}</td>
        ${data.entrances === "2" ? `<td>${esc(f.backName || "—")}</td>` : ""}
      </tr>`).join("")
    : `<tr><td colspan="${data.entrances === "2" ? 4 : 3}" class="empty-row">No floor stops configured.</td></tr>`;

  const floorHeader = data.entrances === "2"
    ? "<tr><th>Floor</th><th>Height</th><th>Front Door</th><th>Rear Door</th></tr>"
    : "<tr><th>Floor</th><th>Height</th><th>Front Door</th></tr>";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Survey Report — ${esc(data.projectName || "Untitled")}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: #f1f5f9;
    color: #1e293b;
    line-height: 1.5;
  }

  /* ── Cover ── */
  .cover {
    background: #2563eb;
    color: #fff;
    padding: 40px 48px 32px;
  }
  .cover h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
  .cover .sub { font-size: 13px; opacity: 0.75; margin-top: 4px; }
  .cover .meta { display: flex; gap: 24px; margin-top: 20px; flex-wrap: wrap; }
  .cover .meta-item { }
  .cover .meta-item .label { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em; }
  .cover .meta-item .value { font-size: 16px; font-weight: 700; margin-top: 2px; }

  /* ── Content ── */
  .content { max-width: 960px; margin: 0 auto; padding: 32px 24px 64px; }

  /* ── Section header ── */
  .section-head {
    display: flex; align-items: center; gap: 12px;
    margin: 36px 0 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #2563eb;
  }
  .section-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: #2563eb; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; flex-shrink: 0;
  }
  .section-head h2 { font-size: 18px; font-weight: 700; color: #1e293b; }

  /* ── KV table ── */
  table.kv { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; }
  table.kv tr:nth-child(odd) { background: #f8fafc; }
  table.kv tr:nth-child(even) { background: #fff; }
  table.kv th, table.kv td { padding: 10px 14px; font-size: 14px; text-align: left; }
  table.kv th { color: #64748b; font-weight: 600; width: 38%; }
  table.kv td { color: #1e293b; font-weight: 500; }

  /* ── Floor table ── */
  table.floors { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.floors th { background: #e2e8f0; color: #475569; font-weight: 700; padding: 8px 12px; text-align: left; }
  table.floors td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
  table.floors tr.even td { background: #f8fafc; }
  .empty-row { color: #94a3b8; font-style: italic; text-align: center; padding: 16px !important; }

  /* ── Photo items ── */
  .photo-item {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .photo-header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    background: #f8fafc;
  }
  .photo-header .num {
    width: 30px; height: 30px; border-radius: 50%;
    background: #e2e8f0; color: #475569;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; flex-shrink: 0;
  }
  .photo-header h3 { font-size: 15px; font-weight: 700; color: #1e293b; flex: 1; }
  .badge {
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; flex-shrink: 0;
  }
  .badge.done    { background: #dcfce7; color: #15803d; }
  .badge.missing { background: #fee2e2; color: #dc2626; }

  /* ── Thumbnails ── */
  .thumbs {
    padding: 16px;
    display: flex; flex-wrap: wrap; gap: 12px;
  }
  .thumb {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .thumb img {
    width: 220px; height: 165px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    cursor: zoom-in;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .thumb img:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  .thumb figcaption { font-size: 12px; color: #94a3b8; font-weight: 500; }

  .notes {
    padding: 10px 16px 14px;
    font-size: 13px; color: #64748b;
    border-top: 1px solid #f1f5f9;
  }
  .empty { padding: 20px 16px; color: #94a3b8; font-size: 13px; font-style: italic; }

  /* ── Lightbox ── */
  #lightbox {
    display: none; position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.92);
    align-items: center; justify-content: center;
    cursor: zoom-out;
  }
  #lightbox.open { display: flex; }
  #lightbox img {
    max-width: 95vw; max-height: 95vh;
    object-fit: contain; border-radius: 8px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }
  #lightbox-close {
    position: fixed; top: 16px; right: 20px;
    color: #fff; font-size: 36px; cursor: pointer; line-height: 1;
    opacity: 0.8; user-select: none;
  }
  #lightbox-close:hover { opacity: 1; }

  /* ── Print ── */
  @media print {
    body { background: #fff; }
    .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .thumb img { cursor: default; }
    #lightbox { display: none !important; }
    .section-head { break-after: avoid; }
    .photo-item { break-inside: avoid; }
  }

  @media (max-width: 600px) {
    .cover { padding: 24px 20px; }
    .cover h1 { font-size: 22px; }
    .content { padding: 20px 14px 48px; }
    .thumb img { width: 160px; height: 120px; }
  }
</style>
</head>
<body>

<div class="cover">
  <h1>Electrical Survey Report</h1>
  <p class="sub">电气勘测信息表</p>
  <div class="meta">
    <div class="meta-item">
      <div class="label">Project</div>
      <div class="value">${esc(data.projectName || "Untitled")}</div>
    </div>
    <div class="meta-item">
      <div class="label">Generated</div>
      <div class="value">${esc(date)}</div>
    </div>
    <div class="meta-item">
      <div class="label">Photos uploaded</div>
      <div class="value">${Object.values(data.photos).filter(p => p.images.length > 0).length} / 12 items</div>
    </div>
  </div>
</div>

<div class="content">

  <!-- Section 1: Project Info -->
  <div class="section-head">
    <div class="section-num">1</div>
    <h2>Project Information</h2>
  </div>
  <table class="kv">
    ${kv("Project Name", data.projectName)}
    ${kv("Size", data.size)}
    ${kv("COP", data.cop)}
    ${kv("HOP / LOP", data.hopLop)}
    ${kv("Fireman Lock Box", data.firemanLockBox)}
    ${kv("Mounting Box", `${data.mountingBoxLength || "—"} × ${data.mountingBoxWidth || "—"} mm`)}
  </table>

  <!-- Section 2: Shaft & Floor -->
  <div class="section-head">
    <div class="section-num">2</div>
    <h2>Shaft &amp; Floor Configuration</h2>
  </div>
  <table class="kv" style="margin-bottom:16px">
    ${kv("Door Entrances", data.entrances === "1" ? "Single" : "Double")}
    ${kv("Pit Depth", data.pit ? data.pit + " m" : "")}
    ${kv("Overhead (OH)", data.oh ? data.oh + " m" : "")}
    ${kv("Shaft Total Height", data.shaftHeight ? data.shaftHeight + " m" : "")}
    ${kv("Rising", data.rising ? data.rising + " m" : "")}
  </table>
  <table class="floors">
    <thead>${floorHeader}</thead>
    <tbody>${floorRows}</tbody>
  </table>

  <!-- Section 3: Photos -->
  <div class="section-head">
    <div class="section-num">3</div>
    <h2>On-Site Photos</h2>
  </div>
  ${photoSections}

</div>

<!-- Lightbox -->
<div id="lightbox" onclick="closeLightbox()">
  <span id="lightbox-close" onclick="closeLightbox()">&times;</span>
  <img id="lightbox-img" src="" alt="">
</div>

<script>
  function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
</script>
</body>
</html>`;
}

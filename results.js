const STORAGE_KEY = "vacayMatchResults";
const META_KEY = "vacayMatchMeta";
const PICKS_KEY = "vacaySavedPicks";

const resultsEl = document.getElementById("results");
const statusText = document.getElementById("statusText");
const prefSummary = document.getElementById("prefSummary");
const gentleNotesEl = document.getElementById("gentleNotes");
const resultsHeading = document.querySelector(".results-header h2");
const resultsSubheading = document.querySelector(".results-subheading");
const resultsHeroTagline = document.querySelector(".results-page .app-header p");
const clearBtn = document.getElementById("clearBtn");
const clearPicksBtn = document.getElementById("clearPicksBtn");
const copyResultsBtn = document.getElementById("copyResultsBtn");
const savedPicksGrid = document.getElementById("savedPicksGrid");

/** Latest ranking session (for save buttons) */
let latestResults = [];

function setStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pickId(destination) {
  return String(destination || "")
    .trim()
    .toLowerCase();
}

function loadSavedResults() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadMeta() {
  const raw = localStorage.getItem(META_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadPicks() {
  const raw = localStorage.getItem(PICKS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePicks(picks) {
  localStorage.setItem(PICKS_KEY, JSON.stringify(picks));
}

function isPickSaved(destination) {
  const id = pickId(destination);
  return loadPicks().some((p) => pickId(p.destination) === id);
}

function updateCopyButtonState() {
  if (!copyResultsBtn) return;
  const hasRows = latestResults.length > 0;
  const hasPicks = loadPicks().length > 0;
  copyResultsBtn.disabled = !hasRows && !hasPicks;
}

function appendDestinationBlock(lines, item, index) {
  const rank = index !== undefined ? `#${index + 1} ` : "";
  lines.push(`${rank}${item.destination || "Unknown"}`);
  if (item.matchTier) lines.push(`  ${item.matchTier}`);
  if (item.reason) lines.push(`  ${item.reason}`);
  const highlights = Array.isArray(item.highlights) ? item.highlights : [];
  highlights.forEach((h) => {
    lines.push(`  • ${h}`);
  });
}

function buildCopyText() {
  const meta = loadMeta();
  const picks = loadPicks();
  const rows = latestResults;
  if (!rows.length && !picks.length) return "";

  const lines = [];
  lines.push("Pick My Place — results");
  lines.push("");

  if (meta?.source === "random") {
    lines.push("Mode: Surprise me (random draw)");
    lines.push("");
  } else if (meta?.preferences && rows.length) {
    const p = meta.preferences;
    lines.push("Your preferences:");
    if (p.hobbies) lines.push(`  Hobbies / interests: ${p.hobbies}`);
    if (p.budget) lines.push(`  Budget: ${prettyBudget(p.budget)}`);
    if (p.climate) lines.push(`  Climate: ${prettyClimate(p.climate)}`);
    if (p.mood) lines.push(`  Mood: ${prettyClimate(p.mood)}`);
    if (p.regions) lines.push(`  Regions: ${p.regions}`);
    lines.push("");
  }

  if (Array.isArray(meta?.gentleNotes) && meta.gentleNotes.length && rows.length) {
    lines.push("Heads-up:");
    meta.gentleNotes.forEach((note) => lines.push(`  - ${note}`));
    lines.push("");
  }

  if (rows.length) {
    lines.push(meta?.source === "random" ? "Random pick:" : "Ranked matches:");
    rows.forEach((item, index) => {
      lines.push("");
      appendDestinationBlock(lines, item, index);
    });
  } else if (picks.length) {
    lines.push("(No current ranked list on this page — saved picks only.)");
  }

  if (picks.length) {
    lines.push("");
    lines.push("Saved picks:");
    picks.forEach((item, index) => {
      lines.push("");
      appendDestinationBlock(lines, item, index);
    });
  }

  lines.push("");
  lines.push(`Exported ${new Date().toLocaleString()}`);
  return lines.join("\n");
}

async function copyResultsToClipboard() {
  const text = buildCopyText();
  if (!text) {
    setStatus("Nothing to copy yet. Open results from the home page or save at least one pick.");
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setStatus("Copied to clipboard. Paste into notes, email, or a message.");
  } catch {
    setStatus("Could not copy automatically. Your browser may block clipboard access on this page.");
  }
}

function togglePick(item) {
  const id = pickId(item.destination);
  let picks = loadPicks();
  const exists = picks.some((p) => pickId(p.destination) === id);
  if (exists) {
    picks = picks.filter((p) => pickId(p.destination) !== id);
  } else {
    picks = [...picks, { ...item }];
  }
  savePicks(picks);
  return !exists;
}

function prettyBudget(v) {
  const map = {
    "very-low": "shoestring",
    low: "budget-friendly",
    mid: "mid-range",
    high: "premium",
    "very-high": "luxury"
  };
  return map[v] || v || "";
}

function prettyClimate(v) {
  return (v || "").replace(/-/g, " ");
}

function renderPrefSummary(meta) {
  if (!prefSummary || !meta) return;
  if (meta.source === "random") {
    prefSummary.hidden = false;
    prefSummary.textContent =
      "Serendipity mode — one random destination from our world catalog (your quiz wasn't used). Hit \"Surprise me\" on the home page to spin again.";
    return;
  }
  if (!meta.preferences) {
    prefSummary.hidden = true;
    prefSummary.textContent = "";
    return;
  }
  const p = meta.preferences;
  const parts = [
    p.budget && `Budget: ${prettyBudget(p.budget)}`,
    p.climate && `Climate: ${prettyClimate(p.climate)}`,
    p.mood && `Mood: ${prettyClimate(p.mood)}`,
    p.regions && `Regions: ${p.regions}`
  ].filter(Boolean);
  if (!parts.length) {
    prefSummary.hidden = true;
    return;
  }
  prefSummary.hidden = false;
  prefSummary.textContent = `Based on your choices — ${parts.join(" · ")}`;
}

function renderGentleNotes(meta) {
  if (!gentleNotesEl) return;
  const notes = meta?.gentleNotes;
  if (meta?.source === "random" || !Array.isArray(notes) || notes.length === 0) {
    gentleNotesEl.hidden = true;
    gentleNotesEl.innerHTML = "";
    return;
  }
  gentleNotesEl.hidden = false;
  gentleNotesEl.innerHTML = `<ul class="gentle-notes-list">${notes
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("")}</ul>`;
}

function applyResultsPageTheme(meta) {
  const isRandom = meta?.source === "random";
  if (resultsHeading) {
    resultsHeading.textContent = isRandom ? "Your random place" : "Your Top Matches";
  }
  if (resultsSubheading) {
    resultsSubheading.textContent = isRandom ? "Wild card from our catalog" : "All ranked matches";
  }
  if (resultsHeroTagline) {
    resultsHeroTagline.textContent = isRandom
      ? "One surprise destination—picked at random from places around the world in our list."
      : "Here are your ranked destination matches, tuned to what you selected.";
  }
}

const FALLBACK_IMAGE = "images/cards/pmp-default.svg";

function localCardPath(seed) {
  const n = Number(seed);
  if (Number.isFinite(n) && n >= 29 && n <= 61) {
    return `images/cards/pmp-${n}.svg`;
  }
  return FALLBACK_IMAGE;
}

function localCardPathForDestination(destination) {
  const name = String(destination || "travel").toLowerCase();
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % 1000;
  }
  const seed = 29 + (hash % 33);
  return localCardPath(seed);
}

function getImageUrl(destination, providedImageUrl) {
  const url = providedImageUrl ? String(providedImageUrl) : "";
  if (url.includes("images/cards/pmp-")) {
    return url;
  }
  const legacyId = url.match(/picsum\.photos\/(?:id|seed\/pmp-)(\d+)/);
  if (legacyId) {
    return localCardPath(legacyId[1]);
  }
  if (url && !url.includes("source.unsplash.com") && !url.includes("picsum.photos")) {
    return url;
  }
  return localCardPathForDestination(destination);
}

function cardImageOnErrorAttr() {
  return `this.onerror=null;this.src='${FALLBACK_IMAGE}'`;
}

function renderPickCard(item, { showRemove }) {
  const destination = escapeHtml(item.destination || "Unknown destination");
  const reason = escapeHtml(item.reason || "");
  const tier = escapeHtml(item.matchTier || "Saved pick");
  const imageUrl = escapeHtml(getImageUrl(item.destination, item.imageUrl));
  const highlights = Array.isArray(item.highlights) ? item.highlights : [];
  const highlightsHtml =
    highlights.length > 0
      ? `<ul class="highlight-list">${highlights
          .map((h) => `<li>${escapeHtml(h)}</li>`)
          .join("")}</ul>`
      : "";

  const removeBtn = showRemove
    ? `<div class="card-actions"><button type="button" class="btn-secondary remove-pick-btn" data-pick-id="${encodeURIComponent(
        pickId(item.destination)
      )}">Remove from saved</button></div>`
    : "";

  return `
    <article class="card">
      <img class="card-image" src="${imageUrl}" alt="${destination}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="${cardImageOnErrorAttr()}" />
      <div class="card-top">
        <h3>${destination}</h3>
      </div>
      <p class="match-tier">${tier}</p>
      ${reason ? `<p class="reason">${reason}</p>` : ""}
      ${highlightsHtml}
      ${removeBtn}
    </article>
  `;
}

function renderSavedPicks() {
  if (!savedPicksGrid) return;
  const picks = loadPicks();
  if (picks.length === 0) {
    savedPicksGrid.innerHTML = `
      <div class="saved-picks-empty-state" role="status">
        <div class="saved-picks-empty-visual" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.35"
              stroke-linejoin="round"
            />
            <path d="M9 9h6" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" />
          </svg>
        </div>
        <p class="saved-picks-empty-title">Your shortlist is ready when you are</p>
        <p class="saved-picks-empty-text">
          Tap <strong>Save this pick</strong> on any destination below. Saved places stay here—even if you clear your
          latest ranked run—so you can compare favorites without starting over.
        </p>
        <a class="action-link saved-picks-empty-cta" href="#results">Jump to ranked matches</a>
      </div>`;
    return;
  }
  savedPicksGrid.innerHTML = picks.map((item) => renderPickCard(item, { showRemove: true })).join("");
}

function renderResults(destinations) {
  latestResults = destinations && destinations.length ? [...destinations] : [];

  if (!destinations || destinations.length === 0) {
    resultsEl.innerHTML =
      '<div class="empty-state">No saved recommendations found. Fill out the form to generate new results.</div>';
    updateSaveButtonStates();
    updateCopyButtonState();
    return;
  }

  const html = destinations
    .map((item, index) => {
      const destination = escapeHtml(item.destination || "Unknown destination");
      const reason = escapeHtml(item.reason || "No reason provided.");
      const tier = escapeHtml(item.matchTier || "Match");
      const imageUrl = escapeHtml(getImageUrl(item.destination, item.imageUrl));
      const highlights = Array.isArray(item.highlights) ? item.highlights : [];
      const highlightsHtml =
        highlights.length > 0
          ? `<ul class="highlight-list">${highlights
              .map((h) => `<li>${escapeHtml(h)}</li>`)
              .join("")}</ul>`
          : "";
      const saved = isPickSaved(item.destination);
      const btnLabel = saved ? "Saved ✓" : "Save this pick";
      const pressed = saved ? "true" : "false";
      const btnClass = saved ? "save-pick-btn is-saved" : "save-pick-btn";

      return `
        <article class="card">
          <img class="card-image" src="${imageUrl}" alt="${destination}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="${cardImageOnErrorAttr()}" />
          <div class="card-top">
            <h3>${destination}</h3>
            <span class="rank">#${index + 1}</span>
          </div>
          <p class="match-tier">${tier}</p>
          <p class="reason">${reason}</p>
          ${highlightsHtml}
          <div class="card-actions">
            <button type="button" class="${btnClass}" data-save-index="${index}" aria-pressed="${pressed}">${btnLabel}</button>
          </div>
        </article>
      `;
    })
    .join("");

  resultsEl.innerHTML = html;
  updateCopyButtonState();
}

function updateSaveButtonStates() {
  if (!latestResults.length) return;
  latestResults.forEach((item, index) => {
    const btn = resultsEl.querySelector(`[data-save-index="${index}"]`);
    if (!btn) return;
    const saved = isPickSaved(item.destination);
    btn.textContent = saved ? "Saved ✓" : "Save this pick";
    btn.classList.toggle("is-saved", saved);
    btn.setAttribute("aria-pressed", saved ? "true" : "false");
  });
}

resultsEl.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-save-index]");
  if (!btn) return;
  const index = Number(btn.dataset.saveIndex);
  const item = latestResults[index];
  if (!item) return;
  togglePick(item);
  renderSavedPicks();
  updateSaveButtonStates();
  updateCopyButtonState();
  const count = loadPicks().length;
  setStatus(`${count} destination${count === 1 ? "" : "s"} in your saved picks.`);
});

savedPicksGrid?.addEventListener("click", (event) => {
  const btn = event.target.closest(".remove-pick-btn");
  if (!btn || btn.dataset.pickId === undefined) return;
  const id = decodeURIComponent(btn.dataset.pickId);
  const picks = loadPicks().filter((p) => pickId(p.destination) !== id);
  savePicks(picks);
  renderSavedPicks();
  updateSaveButtonStates();
  updateCopyButtonState();
  const count = picks.length;
  setStatus(count ? `${count} saved pick${count === 1 ? "" : "s"} remaining.` : "Saved picks cleared from this list.");
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(META_KEY);
  renderResults(null);
  if (prefSummary) {
    prefSummary.hidden = true;
    prefSummary.textContent = "";
  }
  renderGentleNotes(null);
  applyResultsPageTheme(null);
  updateSaveButtonStates();
  updateCopyButtonState();
  setStatus("Latest results cleared. Your individually saved picks are still kept.");
});

copyResultsBtn?.addEventListener("click", () => {
  copyResultsToClipboard();
});

clearPicksBtn?.addEventListener("click", () => {
  localStorage.removeItem(PICKS_KEY);
  renderSavedPicks();
  updateSaveButtonStates();
  updateCopyButtonState();
  setStatus("All saved picks removed.");
});

const meta = loadMeta();
applyResultsPageTheme(meta);
renderPrefSummary(meta);
renderGentleNotes(meta);

renderSavedPicks();

const saved = loadSavedResults();
renderResults(saved);
if (saved && saved.length > 0) {
  const pickCount = loadPicks().length;
  if (meta?.source === "random") {
    setStatus(
      `Your wild card: ${saved[0]?.destination || "a surprise spot"}.` +
        (pickCount ? ` ${pickCount} saved pick${pickCount === 1 ? "" : "s"} in your shortlist.` : "")
    );
  } else {
    setStatus(
      `Showing ${saved.length} ranked recommendations.` +
        (pickCount ? ` ${pickCount} saved pick${pickCount === 1 ? "" : "s"} in your shortlist.` : "")
    );
  }
} else {
  setStatus(loadPicks().length ? "No latest run — your saved picks are below." : "No saved results yet.");
}

updateCopyButtonState();

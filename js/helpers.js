// Small pure formatting helpers shared by the Views.
// No DOM access, no Model access, no state.

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export const formatPeso = (amount) => pesoFormatter.format(amount);

// "2026-11-08" -> "Nov 8, 2026" (parsed as local time to avoid off-by-one days)
export const formatDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Prevents user text (e.g. a description) from breaking or injecting HTML.
export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
  );

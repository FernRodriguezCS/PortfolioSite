// TODO: Come back to this file
const JOBS = [
  { company: "FWD:Dynamics", startYear: 2025, startMonth: 7 },
  { company: "CodeNinjas", startYear: 2025, startMonth: 5 },
];

function monthsBetween(startY, startM, endDate = new Date()) {
  const startTotal = startY * 12 + (startM - 1);
  const endTotal = endDate.getFullYear() * 12 + endDate.getMonth();
  return Math.max(0, endTotal - startTotal);
}

function formatYearsMonths(totalMonths) {
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m || !y) parts.push(`${m} mo${m !== 1 ? "s" : ""}`);
  return parts.join(" ");
}

function msUntilNextMonth() {
  const now = new Date();
  // * 5 seconds after midnight of the 1st next month
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 5);
  return next - now;
}

function updateTenures() {
  document.querySelectorAll(".calcMDiff[data-company]").forEach((span) => {
    const company = span.dataset.company;
    const job = JOBS.find((j) => j.company === company);
    if (!job) return;

    const months = monthsBetween(job.startYear, job.startMonth);
    span.textContent = months;
    span.title = formatYearsMonths(months); 
  });
}

updateTenures();
setTimeout(function tick() {
  updateTenures();
  setTimeout(tick, msUntilNextMonth());
}, msUntilNextMonth());

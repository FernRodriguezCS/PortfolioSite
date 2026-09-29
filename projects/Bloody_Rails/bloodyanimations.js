const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = motionPreference?.matches ?? false;
const revealItems = [...document.querySelectorAll(".br-reveal")];
const releasePath = document.querySelector(".release-path");
let lenis = null;

if (!prefersReducedMotion) {
  if (typeof window.Lenis === "function") {
    lenis = new window.Lenis({ autoRaf: true });
  }

  if ("IntersectionObserver" in window) {
    const threshold = window.matchMedia("(max-width: 700px)").matches ? 0.12 : 0.35;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold }
    );

    document.body.classList.add("br-motion-ready");
    revealItems.forEach((item) => observer.observe(item));
    if (releasePath) observer.observe(releasePath);
  }
}

motionPreference?.addEventListener?.("change", (event) => {
  if (!event.matches) return;

  lenis?.destroy();
  document.body.classList.remove("br-motion-ready");
  revealItems.forEach((item) => item.classList.add("is-visible"));
  releasePath?.classList.add("is-visible");
});

(() => {
  const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const revealItems = [...document.querySelectorAll(".budget-reveal")];
  let lenis = null;
  let revealObserver = null;

  // Keep the page fully visible and still when motion is reduced.
  if (!motionPreference?.matches) {
    // Lenis is optional. The page remains functional if its CDN script is absent.
    if (typeof window.Lenis === "function") {
      try {
        lenis = new window.Lenis({ autoRaf: true });
        window.addEventListener("pagehide", () => {
          lenis?.destroy();
          lenis = null;
        }, { once: true });
      } catch (error) {
        // A Lenis load or initialization issue should not affect page content.
      }
    }

    if (revealItems.length && "IntersectionObserver" in window) {
      try {
        revealObserver = new IntersectionObserver(
          (entries, activeObserver) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              activeObserver.unobserve(entry.target);
            });
          },
          {
            threshold: 0.12,
            rootMargin: "0px 0px -4% 0px",
          }
        );

        revealItems.forEach((item) => revealObserver.observe(item));
        // CSS hides reveal targets only after the observer is ready to reveal them.
        document.body.classList.add("budget-motion-ready");
      } catch (error) {
        // Without a working observer, the page stays visible with no reveal styling.
      }
    }
  }

  motionPreference?.addEventListener?.("change", (event) => {
    if (!event.matches) return;

    revealObserver?.disconnect();
    lenis?.destroy();
    lenis = null;
    document.body.classList.remove("budget-motion-ready");
    revealItems.forEach((item) => item.classList.add("is-visible"));
  });
})();

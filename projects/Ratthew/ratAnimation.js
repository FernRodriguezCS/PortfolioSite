/* Optional, one-time frame entrances. Nothing is hidden while awaiting a reveal. */
(() => {
  const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const revealItems = [...document.querySelectorAll(".hero-copy, .hero-art, .process-step")];
  const seenItems = new WeakSet();
  let revealObserver = null;
  let lenis = null;

  function stopMotion() {
    revealObserver?.disconnect();
    revealObserver = null;
    document.body.classList.remove("rat-motion-ready");
    revealItems.forEach((item) => item.classList.remove("is-visible"));

    // Clear our reference even if the optional CDN library fails during cleanup.
    const previousLenis = lenis;
    lenis = null;
    try {
      previousLenis?.destroy();
    } catch {
      // Native scrolling and visible page content remain the fallback.
    }
  }

  function startMotion() {
    stopMotion();
    if (motionPreference?.matches) return;

    if (typeof window.Lenis === "function") {
      try {
        lenis = new window.Lenis({ autoRaf: true, anchors: true });
      } catch {
        // A blocked CDN or failed initialization must not affect the page.
        lenis = null;
      }
    }

    if (!("IntersectionObserver" in window)) return;

    try {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seenItems.has(entry.target)) return;
          seenItems.add(entry.target);
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        // A tall image should animate when its first edge appears, on any screen.
        threshold: 0,
        rootMargin: "0px 0px -24px 0px",
      });

      revealItems.forEach((item) => {
        if (!seenItems.has(item)) revealObserver.observe(item);
      });
      document.body.classList.add("rat-motion-ready");
    } catch {
      revealObserver?.disconnect();
      revealObserver = null;
      document.body.classList.remove("rat-motion-ready");
    }
  }

  if (motionPreference?.addEventListener) {
    motionPreference.addEventListener("change", startMotion);
  } else {
    motionPreference?.addListener?.(startMotion);
  }

  window.addEventListener("pagehide", stopMotion);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) startMotion();
  });

  // Each HTML page loads this file with defer, after its content exists.
  startMotion();
})();

(() => {
  const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let revealItems = [];
  let revealObserver = null;
  let lenis = null;

  function showEverything() {
    document.body.classList.remove("spell-motion-ready");
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  function stopMotion() {
    revealObserver?.disconnect();
    revealObserver = null;
    lenis?.destroy();
    lenis = null;
    showEverything();
  }

  function startMotion() {
    revealItems = [...document.querySelectorAll(".spell-reveal")];

    if (motionPreference?.matches) {
      stopMotion();
      return;
    }

    // Lenis is optional: missing or failing CDN code must not affect the page.
    if (typeof window.Lenis === "function") {
      try {
        lenis = new window.Lenis({ autoRaf: true });
      } catch (error) {
        lenis = null;
      }
    }

    if (!revealItems.length || !("IntersectionObserver" in window)) {
      showEverything();
      return;
    }

    try {
      revealItems.forEach((item) => item.classList.remove("is-visible"));
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
      // CSS only hides reveal targets after the observer is ready to show them.
      document.body.classList.add("spell-motion-ready");
    } catch (error) {
      revealObserver?.disconnect();
      revealObserver = null;
      showEverything();
    }
  }

  function handleMotionPreferenceChange(event) {
    if (event.matches) {
      stopMotion();
    } else {
      startMotion();
    }
  }

  function initialize() {
    startMotion();

    if (motionPreference?.addEventListener) {
      motionPreference.addEventListener("change", handleMotionPreferenceChange);
    } else {
      motionPreference?.addListener?.(handleMotionPreferenceChange);
    }

    window.addEventListener("pagehide", stopMotion, { once: true });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) startMotion();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

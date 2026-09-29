(() => {
  const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let lenis;

  // The page still uses native scrolling if the optional CDN script is unavailable.
  if (typeof window.Lenis === "function") {
    try {
      lenis = new window.Lenis({
        autoRaf: true,
        anchors: true,
        lerp: 0.1,
        respectReducedMotion: true,
      });
    } catch {
      lenis = undefined;
    }
  }

  if (!("IntersectionObserver" in window)) return;

  const page = document.documentElement;
  const revealTargets = Array.from(
    document.querySelectorAll(
      ".hero-copy, .hero-art, .section-heading, .process-list, .study-heading, .study-list",
    ),
  );

  if (revealTargets.length === 0) return;

  let revealObserver;

  function disableReveal() {
    revealObserver?.disconnect();
    page.classList.remove("motion-ready");
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  function enableReveal() {
    if (motionPreference?.matches) {
      disableReveal();
      return;
    }

    revealObserver?.disconnect();
    revealTargets.forEach((target) => {
      target.classList.remove("is-visible");
      target.dataset.reveal = target.classList.contains("hero-art") ? "hero-art" : "group";
    });

    try {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -6% 0px",
          threshold: 0.01,
        },
      );

      revealTargets.forEach((target) => revealObserver.observe(target));
      // Enable the hidden starting state only after every target is observed.
      page.classList.add("motion-ready");
    } catch {
      disableReveal();
    }
  }

  enableReveal();
  motionPreference?.addEventListener?.("change", (event) => {
    if (event.matches) disableReveal();
    else enableReveal();
  });
})();

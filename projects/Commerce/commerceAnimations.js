(function () {
  const body = document.body;
  const revealItems = Array.from(document.querySelectorAll(".commerce-reveal"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver = null;
  let lenis = null;

  function startLenis() {
    if (lenis || typeof window.Lenis !== "function") return;

    try {
      lenis = new window.Lenis({ autoRaf: true });
    } catch (error) {
      // Smooth scrolling is optional; native scrolling remains available.
      lenis = null;
    }
  }

  function stopLenis() {
    if (!lenis) return;

    try {
      if (typeof lenis.destroy === "function") {
        lenis.destroy();
      } else if (typeof lenis.stop === "function") {
        lenis.stop();
      }
    } catch (error) {
      // Keep the page usable if an optional Lenis instance cannot be torn down.
    }

    lenis = null;
  }

  function showEverything() {
    body.classList.remove("commerce-motion-ready");
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  function disableRevealMotion() {
    if (revealObserver) {
      try {
        if (typeof revealObserver.disconnect === "function") {
          revealObserver.disconnect();
        }
      } catch (error) {
        // Reveals are still made visible if observer cleanup is unavailable.
      }

      revealObserver = null;
    }

    showEverything();
  }

  function stopMotion() {
    disableRevealMotion();
    stopLenis();
  }

  function startMotion() {
    if (reducedMotion.matches) {
      stopMotion();
      return;
    }

    startLenis();

    if (!("IntersectionObserver" in window) || revealItems.length === 0) return;

    try {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");

            if (revealObserver && typeof revealObserver.unobserve === "function") {
              try {
                revealObserver.unobserve(entry.target);
              } catch (error) {
                // The target is visible even if it cannot be unobserved.
              }
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -4% 0px",
        }
      );

      body.classList.add("commerce-motion-ready");
      revealItems.forEach((item) => {
        if (!item.classList.contains("is-visible")) revealObserver.observe(item);
      });
    } catch (error) {
      disableRevealMotion();
    }
  }

  function handleMotionPreferenceChange() {
    if (reducedMotion.matches) {
      stopMotion();
    } else {
      startMotion();
    }
  }

  startMotion();

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionPreferenceChange);
  }
})();

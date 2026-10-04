const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasIntersectionObserver = "IntersectionObserver" in window;

if (!reduceMotion && hasIntersectionObserver) {
  const reveals = document.querySelectorAll(".reveal, .textReveal");
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          activeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((reveal) => observer.observe(reveal));
  document.documentElement.classList.add("motion-ready");
}

if (!reduceMotion && typeof window.Lenis === "function") {
  new window.Lenis({ autoRaf: true });
}

const aboutParagraphs = Array.from(
  document.querySelectorAll("#extraInfo .about-copy")
);

if (!reduceMotion && aboutParagraphs.length > 0) {
  const paragraphWords = aboutParagraphs.map((paragraph) => {
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    const words = [];
    let currentNode;

    while ((currentNode = walker.nextNode())) {
      if (/\S/.test(currentNode.nodeValue)) textNodes.push(currentNode);
    }

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      const pieces = textNode.nodeValue.split(/(\s+)/);

      pieces.forEach((piece) => {
        if (!piece) return;

        if (/^\s+$/.test(piece)) {
          fragment.appendChild(document.createTextNode(piece));
          return;
        }

        const word = document.createElement("span");
        word.className = "about-word";
        word.textContent = piece;
        words.push(word);
        fragment.appendChild(word);
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });

    return { paragraph, words };
  });
  const allAboutWords = paragraphWords.flatMap(({ words }) => words);
  const aboutText = document.getElementById("aboutMe-text");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let updateQueued = false;

  const updateAboutTextReveal = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const restingOpacity = window.matchMedia("(max-width: 600px)").matches
      ? 0.58
      : 0.42;
    const startLine = viewportHeight * 0.84;
    const endLine = viewportHeight * 0.3;
    const bounds = aboutText.getBoundingClientRect();
    const travelDistance = Math.max(bounds.height + startLine - endLine, 1);
    const aboutProgress = clamp(
      (startLine - bounds.top) / travelDistance,
      0,
      1
    );
    const revealedWordPosition = aboutProgress * (allAboutWords.length + 1);

    allAboutWords.forEach((word, index) => {
      const wordProgress = clamp(revealedWordPosition - index, 0, 1);
      const opacity = (
        restingOpacity + wordProgress * (1 - restingOpacity)
      ).toFixed(2);

      if (word.dataset.revealOpacity !== opacity) {
        word.style.setProperty("--word-opacity", opacity);
        word.dataset.revealOpacity = opacity;
      }
    });

    updateQueued = false;
  };

  const queueAboutTextUpdate = () => {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(updateAboutTextReveal);
  };

  document.documentElement.classList.add("about-text-ready");
  updateAboutTextReveal();
  window.addEventListener("scroll", queueAboutTextUpdate, { passive: true });
  window.addEventListener("resize", queueAboutTextUpdate, { passive: true });
  document.fonts?.ready.then(queueAboutTextUpdate);
}

const aboutVideos = Array.from(
  document.querySelectorAll("#aboutMe-imageGrid video")
);

if (!reduceMotion && hasIntersectionObserver && aboutVideos.length > 0) {
  const nearbyVideos = new Set();
  const resumeWhenVisible = new Set();
  const pausedWhenHidden = new Set();
  const pausesRequestedForVisibility = new Set();
  let hasBeenVisible = !document.hidden;
  const playVideo = (video) => {
    video.muted = true;
    video.playsInline = true;

    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
  };

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting) {
          const wasNearby = nearbyVideos.has(video);
          nearbyVideos.add(video);
          if (document.hidden && hasBeenVisible && !wasNearby) {
            pausedWhenHidden.delete(video);
          }
          if (!document.hidden) playVideo(video);
        } else {
          nearbyVideos.delete(video);
          resumeWhenVisible.delete(video);
          pausedWhenHidden.delete(video);
          video.pause();
        }
      });
    },
    { rootMargin: "120px 0px", threshold: 0.01 }
  );

  aboutVideos.forEach((video) => {
    video.addEventListener("pause", () => {
      if (pausesRequestedForVisibility.delete(video)) return;
      if (document.hidden && resumeWhenVisible.delete(video)) {
        pausedWhenHidden.add(video);
      }
    });
    video.addEventListener("play", () => {
      if (document.hidden && nearbyVideos.has(video)) {
        pausedWhenHidden.delete(video);
        resumeWhenVisible.add(video);
      }
    });
    videoObserver.observe(video);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      nearbyVideos.forEach((video) => {
        if (!video.paused) {
          resumeWhenVisible.add(video);
          pausesRequestedForVisibility.add(video);
        } else {
          pausedWhenHidden.add(video);
        }
        video.pause();
      });
      return;
    }

    if (!hasBeenVisible) {
      nearbyVideos.forEach(playVideo);
    } else {
      nearbyVideos.forEach((video) => {
        if (resumeWhenVisible.has(video) || !pausedWhenHidden.has(video)) {
          playVideo(video);
        }
      });
    }
    resumeWhenVisible.clear();
    pausedWhenHidden.clear();
    pausesRequestedForVisibility.clear();
    hasBeenVisible = true;
  });
}

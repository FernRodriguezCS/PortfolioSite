const typedText = document.getElementById("typedText");

window.addEventListener("load", () => {
  const landingPage = document.getElementById("landingPage");
  landingPage.classList.add("fadeIn");

  const arrow = document.getElementById("scrollDown");
  setTimeout(() => {
    arrow.classList.add("show");
  }, 3000);

  setTimeout(typeEffect, 1000);
});

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // * fixes animation repeating while in view
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

reveals.forEach((reveal) => {
  observer.observe(reveal);
});

const phrases = [
  "Software Engineer",
  "CS Student",
  "Student Mentor",
  "LeetCode Warrior",
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[currentPhraseIndex];
  const currentText = currentPhrase.substring(0, currentCharIndex);

  typedText.textContent = currentText;

  if (!isDeleting && currentCharIndex < currentPhrase.length) {
    currentCharIndex++;
    setTimeout(typeEffect, 100);
  } else if (isDeleting && currentCharIndex > 0) {
    currentCharIndex--;
    setTimeout(typeEffect, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }
    setTimeout(typeEffect, 1000);
  }
}

const donateBtn = document.getElementById("donateBtn");
const hero = document.getElementById("landingPage");
const heroObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      donateBtn.classList.remove("fade-out");
    } else {
      donateBtn.classList.add("fade-out");
    }
  },
  { threshold: 0.1 }
);

heroObserver.observe(hero);

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".projectPost");
  const backdrop = document.getElementById("projectModalBackdrop");
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalTagline = document.getElementById("modalTagline");
  const modalTech = document.getElementById("modalTech");
  const closeBtn = document.querySelector(".modal-close");

  let activeCard = null;
  let isAnimating = false;

  // Project metadata (what shows "on the back" of the card)
  const projectMeta = {
    lunaris: {
      title: "Lunaris",
      tagline: "Full-stack web app built with modern JS tooling and auth.",
      tech: ["React", "JWT", "PostgreSQL", "Express.js", "Git", "GitHub"],
    },
    spellsprint: {
      title: "Spell Sprint",
      tagline: "Fast-paced typing game crafted in the Godot engine.",
      tech: ["Godot", "GDScript"],
    },
    portfolio: {
      title: "Portfolio Site",
      tagline: "Hand-rolled portfolio with custom animations and Stripe donations.",
      tech: ["HTML", "CSS", "JavaScript", "Stripe", "Git", "GitHub"],
    },
  };

  function createFlyingClone(card) {
    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);

    // Match card appearance & position
    clone.style.position = "fixed";
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.zIndex = "60"; // above backdrop/modal
    clone.style.pointerEvents = "none";
    clone.style.borderRadius = window.getComputedStyle(card).borderRadius;
    clone.style.boxShadow = "0 12px 30px rgba(0,0,0,0.6)";
    clone.style.background = window.getComputedStyle(card).backgroundColor;

    // 3D flip setup
    clone.style.transformStyle = "preserve-3d";
    clone.style.backfaceVisibility = "hidden";
    clone.style.transition =
      "transform 0.8s ease, box-shadow 0.8s ease, border-radius 0.8s ease, opacity 0.3s ease";
    clone.style.transform = "translate3d(0, 0, 0) scale(1) rotateY(0deg)";
    clone.style.opacity = "1";

    document.body.appendChild(clone);

    // Calculate center translation
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const translateX = viewportCenterX - cardCenterX;
    const translateY = viewportCenterY - cardCenterY;

    // Force layout so transition kicks in
    clone.getBoundingClientRect();

    requestAnimationFrame(() => {
      clone.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.15) rotateY(180deg)`;
      clone.style.borderRadius = "18px";
      clone.style.boxShadow = "0 24px 60px rgba(0,0,0,0.75)";
    });

    return clone;
  }

  function openModal(card) {
    if (isAnimating || backdrop.classList.contains("show")) return;
    isAnimating = true;

    activeCard = card;

    // Figure out which project was clicked
    const idKey = card.id.toLowerCase(); // "lunaris", "spellsprint", "portfolio"
    const meta = projectMeta[idKey];

    if (meta) {
      if (modalTitle) modalTitle.textContent = meta.title;
      if (modalTagline) modalTagline.textContent = meta.tagline;
      if (modalTech) {
        modalTech.innerHTML = meta.tech
          .map((t) => `<span class="tech-pill">${t}</span>`)
          .join("");
      }
    } else {
      // Fallback: just use card title
      const titleEl = card.querySelector("h4");
      if (titleEl && modalTitle) {
        modalTitle.textContent = titleEl.textContent;
      }
      if (modalTagline) modalTagline.textContent = "Details coming soon...";
      if (modalTech) modalTech.innerHTML = "";
    }

    // Fade original card out so it looks like it left the grid
    card.style.transition = "opacity 0.25s ease";
    card.style.opacity = "0";

    // Show backdrop + modal (modal sits underneath flying clone)
    backdrop.classList.add("show");
    document.body.style.overflow = "hidden";

    // Create and animate flying clone on top
    const clone = createFlyingClone(card);

    clone.addEventListener(
      "transitionend",
      () => {
        // Fade clone away after flip finishes, modal is already visible
        clone.style.opacity = "0";

        setTimeout(() => {
          if (clone && clone.parentNode) {
            clone.parentNode.removeChild(clone);
          }
          isAnimating = false; // animations done, safe to close now
        }, 180);
      },
      { once: true }
    );
  }

  function closeModal() {
    if (!activeCard || isAnimating) return;
    isAnimating = true;

    // Grab where the modal currently is BEFORE hiding it
    const modalRect = modal.getBoundingClientRect();
    const cardRect = activeCard.getBoundingClientRect();

    // Hide modal backdrop (fades out)
    backdrop.classList.remove("show");
    document.body.style.overflow = "";

    // Create a clone starting where the modal was
    const returningClone = activeCard.cloneNode(true);
    returningClone.style.position = "fixed";
    returningClone.style.top = modalRect.top + "px";
    returningClone.style.left = modalRect.left + "px";
    returningClone.style.width = modalRect.width + "px";
    returningClone.style.height = modalRect.height + "px";
    returningClone.style.margin = "0";
    returningClone.style.zIndex = "60";
    returningClone.style.pointerEvents = "none";
    returningClone.style.opacity = "1";
    returningClone.style.borderRadius = "18px";
    returningClone.style.boxShadow = "0 24px 60px rgba(0,0,0,0.75)";
    returningClone.style.transformStyle = "preserve-3d";
    returningClone.style.backfaceVisibility = "hidden";
    returningClone.style.transition =
      "transform 0.8s ease, box-shadow 0.8s ease, border-radius 0.8s ease, opacity 0.3s ease";

    // Start flipped to mirror the "modal side"
    returningClone.style.transform = "scale(1.15) rotateY(180deg)";

    document.body.appendChild(returningClone);

    // Keep the real card invisible during the flight
    activeCard.style.opacity = "0";

    // Force layout
    returningClone.getBoundingClientRect();

    // Fly and flip back to the card's position
    requestAnimationFrame(() => {
      returningClone.style.top = cardRect.top + "px";
      returningClone.style.left = cardRect.left + "px";
      returningClone.style.width = cardRect.width + "px";
      returningClone.style.height = cardRect.height + "px";
      returningClone.style.borderRadius =
        window.getComputedStyle(activeCard).borderRadius;
      returningClone.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5)";
      returningClone.style.transform = "scale(1) rotateY(0deg)";
    });

    // IMPORTANT: always clean up after the flight finishes
    returningClone.addEventListener(
      "transitionend",
      () => {
        // Crossfade: fade clone out while fading real card in
        activeCard.style.transition = "opacity 0.25s ease";
        activeCard.style.opacity = "1";
        returningClone.style.opacity = "0";

        setTimeout(() => {
          if (returningClone && returningClone.parentNode) {
            returningClone.parentNode.removeChild(returningClone);
          }
          activeCard = null;
          isAnimating = false;
        }, 260);
      },
      { once: true }
    );
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close when clicking outside the modal
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });
  }

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("show")) {
      closeModal();
    }
  });
});
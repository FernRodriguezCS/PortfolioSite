window.addEventListener("load", () => {
  const landingPage = document.getElementById("landingPage");
  landingPage.classList.add("fadeIn");
});

const reveals = document.querySelectorAll(".reveal");
const revealThreshold = window.matchMedia("(max-width: 700px)").matches ? 0.12 : 0.35;

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
    threshold: revealThreshold,
  }
);

reveals.forEach((reveal) => {
  observer.observe(reveal);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(!reduceMotion){
  const lenis = new Lenis({
    autoRaf: true
  });
}

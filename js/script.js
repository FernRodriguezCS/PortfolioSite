const typedText = document.getElementById("typedText");

window.addEventListener("load", () => {
  const landingPage = document.getElementById("landingPage");
  landingPage.classList.add("fadeIn");
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

document.querySelectorAll(".card-inner").forEach(inner => {
  inner.addEventListener("click", ()=>{
    inner.classList.toggle("is-flipped");
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(!reduceMotion){
  const lenis = new Lenis({
    autoRaf: true,
    duration: 1,
    wheelMultiplier: 0.6,
    smoothWheel: true,
    smoothTouch: true,
  });
}
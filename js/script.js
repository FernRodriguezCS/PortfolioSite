//Todo: Come back to this file
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

document.querySelectorAll(".card-inner").forEach(inner => {
  inner.addEventListener("click", ()=>{
    inner.classList.toggle("is-flipped");
  });
});
const typedText = document.getElementById("typedText");

window.addEventListener('load', () => {
    const landingPage = document.getElementById('landingPage');
    landingPage.classList.add('fadeIn');

    const arrow = document.getElementById('scrollDown');
    setTimeout(() => {
      arrow.classList.add('show');
    }, 3000);

    setTimeout(typeEffect, 1000); 
});

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // fixes animation repeating while in view
      observer.unobserve(entry.target); 
    }
  });
}, {
  threshold: 0.1 
});

reveals.forEach(reveal => {
  observer.observe(reveal);
});

const phrases = [
  "Software Engineer",
  "CS Student",
  "Backend Builder",
  "LeetCode Warrior"
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

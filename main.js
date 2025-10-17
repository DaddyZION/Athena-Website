import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Force scroll to top on page load/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Logo Intro Screen Handler
const logoIntro = document.getElementById('logoIntro');
const scrollIndicator = document.querySelector('.scroll-indicator');
let hasScrolled = false;

// Hide intro on scroll or click
function hideIntro() {
  if (!hasScrolled) {
    hasScrolled = true;
    logoIntro.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Prevent scrolling initially
document.body.style.overflow = 'hidden';

// Listen for wheel event (before scroll happens)
window.addEventListener('wheel', (e) => {
  if (!hasScrolled) {
    e.preventDefault();
    hideIntro();
  }
}, { passive: false });

// Listen for touch scroll on mobile
window.addEventListener('touchmove', hideIntro, { once: true, passive: true });

// Click on scroll indicator
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    hideIntro();
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 100);
  });
}

// Smooth scroll (initialize after potential intro)
const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, smoothTouch: false });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Fade-stack word cycle
const words = Array.from(document.querySelectorAll(".fade-stack b"));
let idx = 0;
function cycleWords() {
  words.forEach((w, i) => w.style.opacity = i === idx ? 1 : 0);
  idx = (idx + 1) % words.length;
}
cycleWords();
setInterval(cycleWords, 1600);

// Hero entrance
gsap.from(".hero-content > *", { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power2.out" });
gsap.to(".device-glow", { opacity: 0.7, duration: 1.2, ease: "power2.out" });

// Cards reveal on scroll
gsap.utils.toArray(".card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: "top 85%" },
    y: 20, opacity: 0, duration: 0.6, delay: i * 0.04, ease: "power2.out"
  });
});

// Demo slider
const shots = Array.from(document.querySelectorAll(".shot"));
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let current = 0;

function show(i) {
  shots[current]?.classList.remove("current");
  current = (i + shots.length) % shots.length;
  shots[current]?.classList.add("current");
}
prev.addEventListener("click", () => show(current - 1));
next.addEventListener("click", () => show(current + 1));

// Auto-cycle, pause on hover/focus
let auto = setInterval(() => show(current + 1), 2500);
const device = document.querySelector(".device");
["mouseenter", "focusin"].forEach(evt => device.addEventListener(evt, () => { clearInterval(auto); }));
["mouseleave", "focusout"].forEach(evt => device.addEventListener(evt, () => { auto = setInterval(() => show(current + 1), 2500); }));

// CTA form mock
const form = document.querySelector(".cta-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = new FormData(form).get("email");
  gsap.to(form, { y: -6, duration: 0.2, yoyo: true, repeat: 1 });
  alert(`Thanks! We'll reach out to ${email}`);
});

// Scroll-linked subtle parallax for hero rings
gsap.to(".hero-visual .rings span:nth-child(1)", {
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 },
  rotate: 90, scale: 1.05
});
gsap.to(".hero-visual .rings span:nth-child(2)", {
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 },
  rotate: -120, scale: 1.08
});
gsap.to(".hero-visual .rings span:nth-child(3)", {
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 },
  rotate: 180, scale: 1.1
});


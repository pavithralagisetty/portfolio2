import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// === Hero entrance (only hero uses opacity — it's above the fold) ===
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
    .from('.hero-tag', { opacity: 0, y: 10, duration: 0.5 })
    .from('.hero-content h1', { opacity: 0, y: 15, duration: 0.6 }, '-=0.2')
    .from('.hero-desc', { opacity: 0, y: 10, duration: 0.5 }, '-=0.3')
    .from('.hero-actions a', { opacity: 0, y: 10, stagger: 0.1, duration: 0.4 }, '-=0.2');

// === Subtle scroll movements (NO opacity — content always visible) ===
gsap.utils.toArray('.exp-card').forEach((card, i) => {
    gsap.from(card, {
        y: 20, duration: 0.5, delay: i * 0.05,
        scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" }
    });
});

gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
        y: 20, duration: 0.5, delay: i * 0.08,
        scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" }
    });
});

gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
        y: 15, duration: 0.3, delay: i * 0.04,
        scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" }
    });
});

// === Nav active state ===
const navLinks = document.querySelectorAll('.nav-links a');

document.querySelectorAll('section').forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: self => {
            if (self.isActive) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${section.id}"]`);
                if (active) active.classList.add('active');
            }
        }
    });
});

// === Mobile nav ===
const toggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');

if (toggle && navLinksEl) {
    toggle.addEventListener('click', () => navLinksEl.classList.toggle('open'));
    navLinksEl.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => navLinksEl.classList.remove('open'))
    );
}

document.addEventListener("DOMContentLoaded", () => {

    // ── SCROLL PROGRESS BAR ──────────────────────────────────────────────
    const progressBar = document.getElementById("scrollProgress");
    const header = document.getElementById("mainHeader");

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${(scrolled / maxScroll) * 100}%`;
        header.classList.toggle("scrolled", scrolled > 60);
    }, { passive: true });


    // ── PARTICLES CANVAS ─────────────────────────────────────────────────
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let W, H, particles;
    const MAX = 90;
    const MAX_DIST = 160;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", () => { resize(); particles.forEach(p => p.reset(true)); });

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x  = Math.random() * W;
            this.y  = init ? Math.random() * H : Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r  = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        move() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
            ctx.fill();
        }
    }

    particles = Array.from({ length: MAX }, () => new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    let lastTime = 0;
    function animateParticles(ts) {
        if (ts - lastTime < 33) { requestAnimationFrame(animateParticles); return; } // ~30fps
        lastTime = ts;
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.move(); p.draw(); });
        drawLines();
        requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);


    // ── TYPEWRITER ───────────────────────────────────────────────────────
    const typeEl = document.querySelector(".typewriter");
    if (typeEl) {
        const titles = [
            "Data Engineer",
            "Cloud Engineer · GCP / AWS",
            "Pipeline Architect",
            "GenAI Applications Developer",
            "Data Platform Engineer",
            "GIS & Geospatial Engineer"
        ];
        let ti = 0, ci = 0, deleting = false;

        function type() {
            const cur = titles[ti];
            typeEl.textContent = deleting ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
            ci += deleting ? -1 : 1;
            let speed = deleting ? 55 : 95;
            if (!deleting && ci === cur.length) { speed = 1600; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % titles.length; speed = 400; }
            setTimeout(type, speed);
        }
        setTimeout(type, 1400);
    }


    // ── SCROLL REVEAL (sections + items) ─────────────────────────────────
    const revealSections = document.querySelectorAll(".fade-in-section");
    const revealItems    = document.querySelectorAll(".fade-in-item");

    const sectionObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("visible"); sectionObs.unobserve(e.target); }
        });
    }, { threshold: 0.08 });
    revealSections.forEach(el => sectionObs.observe(el));

    const itemObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                const siblings = Array.from(e.target.parentElement.querySelectorAll(".fade-in-item"));
                const idx = siblings.indexOf(e.target);
                setTimeout(() => e.target.classList.add("visible"), idx * 60);
                itemObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(el => itemObs.observe(el));


    // ── ANIMATED COUNTERS ────────────────────────────────────────────────
    const counters = document.querySelectorAll(".count-up");
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.done) {
                e.target.dataset.done = "1";
                const target = +e.target.dataset.target;
                const duration = 1800;
                const step = target / (duration / 16);
                let cur = 0;
                const tick = () => {
                    cur = Math.min(cur + step, target);
                    e.target.textContent = Math.round(cur);
                    if (cur < target) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        });
    }, { threshold: 0.6 });
    counters.forEach(el => countObs.observe(el));


    // ── PROJECT FILTER ───────────────────────────────────────────────────
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;

            projectCards.forEach((card, i) => {
                const cats = (card.dataset.category || "").split(" ");
                const show = filter === "all" || cats.includes(filter);
                if (show) {
                    card.style.display = "flex";
                    card.style.animationDelay = `${i * 0.04}s`;
                    // Re-trigger fade
                    card.classList.remove("visible");
                    void card.offsetWidth;
                    setTimeout(() => card.classList.add("visible"), i * 40);
                } else {
                    card.style.display = "none";
                    card.classList.remove("visible");
                }
            });
        });
    });


    // ── MOBILE NAV TOGGLE ────────────────────────────────────────────────
    const navToggle = document.getElementById("navToggle");
    const mainNav   = document.getElementById("mainNav");
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
            const open = mainNav.classList.contains("open");
            navToggle.setAttribute("aria-expanded", open);
            const spans = navToggle.querySelectorAll("span");
            if (open) {
                spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
                spans[1].style.opacity   = "0";
                spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
            } else {
                spans[0].style.transform = "";
                spans[1].style.opacity   = "";
                spans[2].style.transform = "";
            }
        });
        mainNav.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                mainNav.classList.remove("open");
                navToggle.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
            });
        });
    }


    // ── SMOOTH SCROLL (offset for fixed header) ──────────────────────────
    const headerH = () => document.getElementById("mainHeader")?.offsetHeight || 68;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            const target = document.querySelector(a.getAttribute("href"));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH() - 12, behavior: "smooth" });
            }
        });
    });


    // ── PROJECT CARD MOUSE GLOW ──────────────────────────────────────────
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        });
    });


    // ── FOOTER YEAR ──────────────────────────────────────────────────────
    const yearEl = document.querySelector(".footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});

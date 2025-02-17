document.addEventListener("DOMContentLoaded", () => {
  // Quick Stats Modal
  const statsBtn = document.getElementById("statsBtn");
  const statsModal = document.getElementById("statsModal");
  const modalClose = document.getElementById("modalClose");

  if (statsBtn) {
    statsBtn.addEventListener("click", () => {
      statsModal.style.display = "flex";
    });
  }
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      statsModal.style.display = "none";
    });
  }

  // Fade-in on scroll using IntersectionObserver
  const fadeEls = document.querySelectorAll(".fade-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeEls.forEach((el) => observer.observe(el));

  // Project Filter Logic
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
          // Re-trigger fade-in
          card.classList.add("visible");
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Carousel functionality for Skills section
  const slides = document.querySelectorAll('.skills-carousel .slide');
  const prevBtn = document.querySelector('.carousel-btn.prev-slide');
  const nextBtn = document.querySelector('.carousel-btn.next-slide');
  let currentSlide = 0;

  // Initialize: show first slide
  if(slides.length > 0) {
    slides[currentSlide].classList.add('active');
  }

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });

  // Optional: auto-rotate every 7 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 7000);
});

document.addEventListener("DOMContentLoaded", () => {

    // --- Intersection Observer for Fade-in Effect ---
    const fadeElements = document.querySelectorAll('.fade-in-element');
    const projectCards = document.querySelectorAll('.project-item'); // Target project cards specifically for stagger
    const experienceItems = document.querySelectorAll('.experience-item'); // Target experience items specifically for stagger

    const observerOptions = { threshold: 0.1 }; // Trigger when 10% visible

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => { // Use index if needed for dynamic delays
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Apply stagger delay specifically to project cards and experience items
                if (entry.target.classList.contains('project-item') || entry.target.classList.contains('experience-item')) {
                    // Calculate index relative to its type for consistent stagger
                     const itemsOfSameType = Array.from(document.querySelectorAll(`.${entry.target.className.split(' ')[0]}`)); // Get all elements of the same base class
                     const itemIndex = itemsOfSameType.indexOf(entry.target);
                     entry.target.style.transitionDelay = `${itemIndex * 0.05}s`;
                 }

                observer.unobserve(entry.target); // Animate only once
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    fadeElements.forEach(el => observer.observe(el));
    projectCards.forEach(el => observer.observe(el)); // Observe cards for stagger
    experienceItems.forEach(el => observer.observe(el)); // Observe experience items for stagger


    // --- Typing Animation for Hero Title ---
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const titles = [
            "Data Scientist",
            "ML Engineer",
            "Cloud Engineer (GCP/AWS)",
            "Data Engineer",
            "Problem Solver"
        ];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 60;
        const delayBetweenTitles = 1500;

        function type() {
            const currentTitle = titles[titleIndex];
            let text = isDeleting
                ? currentTitle.substring(0, charIndex - 1)
                : currentTitle.substring(0, charIndex + 1);

            typewriterElement.textContent = text;
            charIndex += isDeleting ? -1 : 1;

            let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentTitle.length) {
                typeSpeed = delayBetweenTitles;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typeSpeed = typingSpeed * 1.5;
            }
            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1200); // Start after initial hero animations
    }

    // --- Number Counting Animation ---
    const counterElements = document.querySelectorAll('.count-up');
    const countObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounters(entry.target);
                entry.target.dataset.animated = "true"; // Prevent re-animating this specific element
                // obs.unobserve(entry.target); // Unobserve after animating once
            }
        });
    }, { threshold: 0.8 }); // Trigger when mostly visible

    function animateCounters(counter) { // Animate single counter
        counter.innerText = '0';
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const increment = target / (duration / 16);

        const updateCount = () => {
            const current = +counter.innerText.replace('%', '').replace('+', '');
            if (current < target) {
                counter.innerText = `${Math.ceil(current + increment)}`;
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
                const parentText = counter.parentElement.textContent || "";
                if (parentText.includes('+')) counter.innerText += '+';
                if (parentText.includes('%')) counter.innerText += '%';
            }
        };
        requestAnimationFrame(updateCount);
    }
    counterElements.forEach(el => countObserver.observe(el)); // Observe each counter

    // --- Project Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn-monokai'); // Target Monokai filter buttons
    const projectGridItems = document.querySelectorAll('.project-item'); // Target Monokai project cards

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Button active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter grid items
            projectGridItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category')?.split(' ') || []; // Get categories as array

                // Check if 'all' is selected OR if any of the item's categories match the filter
                const shouldShow = filterValue === 'all' || itemCategories.includes(filterValue);

                if (shouldShow) {
                    item.style.display = 'flex'; // Use flex as defined in Monokai CSS for project-item
                    // Optional: Slightly re-animate visible items if needed
                    // item.classList.remove('visible');
                    // void item.offsetWidth; // Trigger reflow
                    // item.classList.add('visible');
                } else {
                    item.style.display = 'none';
                    // item.classList.remove('visible'); // Ensure hidden items lose visible state if re-animating
                }
            });
        });
    });


    // --- Optional: Smooth scroll adjustment for fixed navbar ---
    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 60;
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .logo[href^="#"]'); // Target Monokai nav/logo

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 15;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Footer Year ---
    const yearSpan = document.querySelector('.main-footer p span'); // More specific selector if needed
    if (yearSpan) {
       // Check if the element is intended for the year, e.g., by id or specific class if added
       // For now, assuming the LAST span in the FIRST p tag is the year
       const footerYearSpan = document.querySelector('.main-footer p:first-of-type span:last-of-type'); // Example, adjust if needed
       // OR add an ID to the span: <span id="footer-year"></span>
       // const footerYearSpan = document.getElementById('footer-year');
       if(footerYearSpan) {
          footerYearSpan.textContent = new Date().getFullYear();
       }
    }


}); // End DOMContentLoaded
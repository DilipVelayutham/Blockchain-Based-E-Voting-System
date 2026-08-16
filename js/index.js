document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.querySelector(".about-us");
    const landingImage = document.querySelector(".landing-image");
    const overlay = document.querySelector(".overlay");
    const scrollElems = document.querySelectorAll(".scroll-animation");
    const navbar = document.querySelector(".navbar");

    function revealOnScroll() {
        scrollElems.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add("show");
            }
        });
    }

    function adjustBackground() {
        let scrollY = window.scrollY;
        // gentle shrink as user scrolls down
        let scaleValue = Math.max(1 - scrollY / 7000, 0.96);
        let overlayOpacity = Math.min(scrollY / 1000, 0.5);
        landingImage.style.transform = `scale(${scaleValue})`;
        overlay.style.background = `rgba(0, 0, 0, ${overlayOpacity})`;
    }

    function handleNavbarAndHeroFade() {
        let landingText = document.querySelector(".landing-text");
        let landingText2 = document.querySelector(".landing-text2");
        let scrollPosition = window.scrollY;
        if (scrollPosition > 200) {
            if (landingText) landingText.classList.add("scroll");
            if (landingText2) landingText2.classList.add("scroll");
            if (navbar) navbar.classList.add("scroll");
        } else {
            if (landingText) landingText.classList.remove("scroll");
            if (landingText2) landingText2.classList.remove("scroll");
            if (navbar) navbar.classList.remove("scroll");
        }
    }

    // initial calls
    revealOnScroll();
    adjustBackground();
    handleNavbarAndHeroFade();

    window.addEventListener("scroll", () => {
        revealOnScroll();
        adjustBackground();
        handleNavbarAndHeroFade();
    });

    // Smooth scroll for anchor links
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href.length === 1) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Contact form demo handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');
            const original = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            // simulate send
            setTimeout(() => {
                btn.textContent = 'Message Sent';
                contactForm.reset();
                setTimeout(() => {
                    btn.textContent = original;
                    btn.disabled = false;
                }, 1600);
            }, 900);
        });
    }
});

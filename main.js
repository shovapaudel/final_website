// ========================================
// MOBILE MENU TOGGLE
// ========================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a navigation link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
});


// ========================================
// ACTIVE NAVIGATION ON SCROLL
// ========================================

// Your website uses .page divs rather than <section> elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    pages.forEach(page => {
        const pageTop = page.offsetTop;
        const pageHeight = page.offsetHeight;

        if (window.scrollY >= pageTop - 200) {
            current = page.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            // Account for the fixed navigation bar
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// ========================================
// CONTACT FORM
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        alert(
            'Thank you for your message! I will respond within 2-3 business days.'
        );

        contactForm.reset();
    });
}


// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    },
    {
        threshold: 0.1
    }
);


// Elements that should animate when entering the screen
document
    .querySelectorAll(
        '.research-card, .skill-category, .stat-card, .pub-item'
    )
    .forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition =
            'opacity 0.6s ease, transform 0.6s ease';

        observer.observe(el);
    });


// ========================================
// SET ACTIVE NAVIGATION ON PAGE LOAD
// ========================================

window.addEventListener('load', () => {
    const currentHash = window.location.hash;

    if (currentHash) {
        const target = document.querySelector(currentHash);

        if (target) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;

            setTimeout(() => {
                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});
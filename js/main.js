// Center-Screen Scroll Tracker for Navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateNavigation() {
    let current = '';
    const viewportHeight = window.innerHeight;
    
    // Define the center 30% of the screen (35% from the top, 35% from the bottom)
    const triggerTop = viewportHeight * 0.1;
    const triggerBottom = viewportHeight * 0.4;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        // A section is in focus if its top edge is above our bottom trigger line
        // AND its bottom edge is below our top trigger line.
        if (rect.top <= triggerBottom && rect.bottom >= triggerTop) {
            current = section.getAttribute('id');
        }
    });

    // Safety net 1: If you scroll all the way to the absolute top, force the 'About' section
    if (window.scrollY < 50) {
        current = sections[0].getAttribute('id');
    }
    
    // Safety net 2: If you scroll to the absolute bottom of the page, force the last section
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = sections[sections.length - 1].getAttribute('id');
    }

    // Apply the active class to the corresponding link
    if (current) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Run on scroll
window.addEventListener('scroll', updateNavigation);

// Run once on page load to set initial state
window.addEventListener('load', updateNavigation);


// --- 1. ENTRY ANIMATION (Fade-in on scroll) ---
const sectionsToAnimate = document.querySelectorAll('section');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sectionsToAnimate.forEach(sec => animationObserver.observe(sec));


// --- 2. LIGHTBOX (IMAGE ZOOM MODAL) ---
// --- UNIFIED LIGHTBOX GALLERY WITH PREV / NEXT ARROWS ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const prevBtn = document.getElementById('lightbox-prev');
const nextBtn = document.getElementById('lightbox-next');

// Collect all map figures across every section in order
const allFigures = Array.from(document.querySelectorAll('.figure-frame img'));
let activeIndex = 0;

function displayImage(index) {
    // Loop around if reaching the ends
    if (index < 0) index = allFigures.length - 1;
    if (index >= allFigures.length) index = 0;
    
    activeIndex = index;
    const currentImg = allFigures[activeIndex];

    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt || 'Map image';

    // Update the caption to match the current image
    const captionElement = currentImg.nextElementSibling;
    if (captionElement && captionElement.classList.contains('figure-caption')) {
        lightboxCaption.innerHTML = captionElement.innerHTML;
    } else {
        lightboxCaption.innerHTML = '';
    }
}

// Open lightbox at clicked image
allFigures.forEach((img, idx) => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        displayImage(idx);
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto';
}

// Arrow click events
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    displayImage(activeIndex - 1);
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    displayImage(activeIndex + 1);
});

// Close when clicking empty dark backdrop
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard controls: Arrow Left, Arrow Right, Escape
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') displayImage(activeIndex - 1);
    if (e.key === 'ArrowRight') displayImage(activeIndex + 1);
    if (e.key === 'Escape') closeLightbox();
});
//Slider button in a page;

// --- HORIZONTAL MAP SLIDER CONTROLLER ---
document.querySelectorAll('.slider-container').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');

    if (!track || !prevBtn || !nextBtn) return;

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
});
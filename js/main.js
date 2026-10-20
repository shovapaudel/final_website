
/* =====================================================
   SHOVA PAUDEL - MAIN JAVASCRIPT
   Navigation, Animations, Lightbox, Slider,
   and Synchronized Sidebar Scrolling
===================================================== */

"use strict";

/* =====================================================
   1. NAVIGATION SCROLL TRACKER
===================================================== */

const sections = document.querySelectorAll(
    "main.content-col section[id]"
);

const navLinks = document.querySelectorAll(".nav-link");

function updateNavigation() {
    if (!sections.length || !navLinks.length) return;

    let current = "";
    const viewportHeight = window.innerHeight;

    const triggerTop = viewportHeight * 0.1;
    const triggerBottom = viewportHeight * 0.4;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        if (
            rect.top <= triggerBottom &&
            rect.bottom >= triggerTop
        ) {
            current = section.id;
        }
    });

    if (window.scrollY < 50) {
        current = sections[0].id;
    }

    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (window.scrollY >= maxScroll - 50) {
        current = sections[sections.length - 1].id;
    }

    if (current) {
        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + current
            );
        });
    }
}

window.addEventListener("scroll", updateNavigation, {
    passive: true
});

window.addEventListener("load", updateNavigation);

updateNavigation();


/* =====================================================
   2. SECTION FADE-IN ANIMATION
===================================================== */

const sectionsToAnimate = document.querySelectorAll(
    "main.content-col section"
);

if ("IntersectionObserver" in window) {

    const animationObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    animationObserver.unobserve(
                        entry.target
                    );
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    sectionsToAnimate.forEach(section => {
        animationObserver.observe(section);
    });

} else {

    sectionsToAnimate.forEach(section => {
        section.classList.add("visible");
    });

}


/* =====================================================
   3. IMAGE LIGHTBOX GALLERY
===================================================== */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById(
    "lightbox-caption"
);
const prevBtn = document.getElementById("lightbox-prev");
const nextBtn = document.getElementById("lightbox-next");

const allFigures = Array.from(
    document.querySelectorAll(".figure-frame img")
);

let activeIndex = 0;

function displayImage(index) {

    if (
        !allFigures.length ||
        !lightboxImg
    ) return;

    if (index < 0) {
        index = allFigures.length - 1;
    }

    if (index >= allFigures.length) {
        index = 0;
    }

    activeIndex = index;

    const currentImg = allFigures[activeIndex];

    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt || "Map image";

    if (lightboxCaption) {

        const captionElement =
            currentImg.nextElementSibling;

        if (
            captionElement &&
            captionElement.classList.contains(
                "figure-caption"
            )
        ) {
            lightboxCaption.innerHTML =
                captionElement.innerHTML;
        } else {
            lightboxCaption.innerHTML = "";
        }

    }
}

function openLightbox(index) {

    if (!lightbox || !lightboxImg) return;

    displayImage(index);

    lightbox.style.display = "flex";

    requestAnimationFrame(() => {
        lightbox.classList.add("show");
    });

    document.body.style.overflow = "hidden";
}

function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("show");

    setTimeout(() => {
        if (!lightbox.classList.contains("show")) {
            lightbox.style.display = "none";
        }
    }, 300);

    document.body.style.overflow = "";
}

if (lightbox && lightboxImg) {

    allFigures.forEach((img, index) => {

        img.addEventListener("click", event => {
            event.stopPropagation();
            openLightbox(index);
        });

    });

    if (prevBtn) {

        prevBtn.addEventListener("click", event => {
            event.stopPropagation();
            displayImage(activeIndex - 1);
        });

    }

    if (nextBtn) {

        nextBtn.addEventListener("click", event => {
            event.stopPropagation();
            displayImage(activeIndex + 1);
        });

    }

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    document.addEventListener("keydown", event => {

        if (!lightbox.classList.contains("show")) {
            return;
        }

        if (event.key === "ArrowLeft") {
            displayImage(activeIndex - 1);
        }

        if (event.key === "ArrowRight") {
            displayImage(activeIndex + 1);
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

    });

}


/* =====================================================
   4. HORIZONTAL IMAGE SLIDER
===================================================== */

document.querySelectorAll(
    ".slider-container"
).forEach(slider => {

    const track = slider.querySelector(
        ".slider-track"
    );

    const previousButton = slider.querySelector(
        ".prev-btn"
    );

    const nextButton = slider.querySelector(
        ".next-btn"
    );

    if (
        !track ||
        !previousButton ||
        !nextButton
    ) return;

    nextButton.addEventListener("click", event => {

        event.preventDefault();

        track.scrollBy({
            left: track.clientWidth,
            behavior: "smooth"
        });

    });

    previousButton.addEventListener("click", event => {

        event.preventDefault();

        track.scrollBy({
            left: -track.clientWidth,
            behavior: "smooth"
        });

    });

});


/* =====================================================
   5. SYNCHRONIZED LEFT COLUMN SCROLL
   Desktop only: 1024px and above
===================================================== */

(function () {

    const sidebar = document.querySelector(
        ".header-col"
    );

    const mainContent = document.querySelector(
        ".content-col"
    );

    if (!sidebar || !mainContent) return;

    const desktopQuery = window.matchMedia(
        "(min-width: 1024px)"
    );

    let animationFrame = null;

    function synchronizeSidebar() {

        if (!desktopQuery.matches) {
            sidebar.scrollTop = 0;
            return;
        }

        // Maximum scrolling distance of webpage
        const pageMaxScroll = Math.max(
            0,
            document.documentElement.scrollHeight -
            window.innerHeight
        );

        // Maximum internal scrolling distance
        // of left column
        const sidebarMaxScroll = Math.max(
            0,
            sidebar.scrollHeight -
            sidebar.clientHeight
        );

        // Overall webpage scroll progress
        const scrollProgress = pageMaxScroll > 0
            ? Math.min(
                1,
                Math.max(
                    0,
                    window.scrollY / pageMaxScroll
                )
            )
            : 0;

        // Left column follows same percentage
        const targetScroll =
            scrollProgress * sidebarMaxScroll;

        sidebar.scrollTop = targetScroll;

    }

    function requestSync() {

        if (animationFrame !== null) return;

        animationFrame = requestAnimationFrame(() => {

            animationFrame = null;

            synchronizeSidebar();

        });

    }

    // Scroll synchronization
    window.addEventListener(
        "scroll",
        requestSync,
        { passive: true }
    );

    // Update when screen dimensions change
    window.addEventListener(
        "resize",
        requestSync
    );

    // Update after page loads
    window.addEventListener(
        "load",
        requestSync
    );

    // Update after fonts finish loading
    if (document.fonts) {

        document.fonts.ready.then(() => {
            requestSync();
        });

    }

    // Update when sidebar dimensions change
    if ("ResizeObserver" in window) {

        const resizeObserver = new ResizeObserver(
            requestSync
        );

        resizeObserver.observe(sidebar);

        const sidebarContent =
            sidebar.querySelector(
                ".header-content-wrap"
            );

        if (sidebarContent) {
            resizeObserver.observe(
                sidebarContent
            );
        }

    }

    // Initial synchronization
    requestSync();

})();

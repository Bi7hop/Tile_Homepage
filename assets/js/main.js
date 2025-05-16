document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    setupMobileNav();

    // Enable smooth scrolling for all internal links
    setupSmoothScrolling();

    // Initialize lazy loading for images (fallback for browsers without native support)
    setupLazyLoading();
});

/**
 * Initialize mobile navigation
 */
function setupMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    // Menu toggle button functionality
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Add close button to mobile menu, only if it doesn't exist yet
    if (!navMenu.querySelector('.menu-close') && window.innerWidth <= 767) {
    const menuClose = document.createElement('button');
        menuClose.className = 'menu-close';
        menuClose.innerHTML = '&times;';
        menuClose.setAttribute('aria-label', 'Close menu');
        navMenu.prepend(menuClose);

        menuClose.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    });
    }

    // Click outside closes the menu
    document.addEventListener('click', function(e) {
        if (
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // ESC key closes the menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Reset mobile menu on window resize > 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

/**
 * Enable smooth scrolling for internal links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Ignore if href is "#" or empty
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');

                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }

                // Calculate scroll position (considering sticky header)
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Lazy loading for images (fallback for browsers without native support)
 */
function setupLazyLoading() {
    // Check if the browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported, nothing to do
        return;
    }

    // Fallback for browsers without native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src || image.src;
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyImages.forEach(image => {
            // Ensure image has a data-src and hasn't been loaded yet
            if (image.dataset.src && image.src !== image.dataset.src) {
                imageObserver.observe(image);
            }
        });
    } else {
        // Fallback: just load all images
        lazyImages.forEach(image => {
            image.src = image.dataset.src || image.src;
        });
    }
}

/**
 * Scroll animation (fade-in effect)
 * Optional: activate if needed
 */
function setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const elements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback: show all elements immediately
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('fade-in');
        });
    }
}

/**
 * Check WebP support and add class name to <body>
 * Optional: activate if needed
 */
function checkWebpSupport() {
    const webpTest = new Image();
    webpTest.onload = function() {
        if (webpTest.width > 0 && webpTest.height > 0) {
            document.body.classList.add('webp-support');
        } else {
            document.body.classList.add('no-webp-support');
        }
    };
    webpTest.onerror = function() {
        document.body.classList.add('no-webp-support');
    };
    webpTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
}

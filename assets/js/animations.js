/**
 * Animations and scroll effects for the Runnebaum Tiles website
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero animations
    initHeroAnimations();
    
    // Set up scroll animations
    setupScrollAnimations();
    
    // Service items animations
    setupServiceItemAnimations();
    
    // Enhance gallery item hover effects
    enhanceGalleryItems();
    
    // Button hover effects
    enhanceButtons();
});

/**
 * Initializes the animations for the hero section
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Animate hero elements (if not already animated via CSS)
    const heroElements = hero.querySelectorAll('h1, p, .btn');
    heroElements.forEach((element, index) => {
        // Only add if no animation is present
        if (!element.style.animation) {
            element.style.opacity = '0';
            element.style.animation = `fadeIn 0.8s ease-out forwards ${0.2 * index}s`;
        }
    });
}

/**
 * Sets up the scroll animations
 */
function setupScrollAnimations() {
    // Elements to animate on scroll
    const elementsToAnimate = document.querySelectorAll(
        '.about-content, .service-card, .skill-card, .gallery-item, .contact-form-container, .contact-info, .map-container, .service-item'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element is in the viewport
                    entry.target.classList.add('in-view');
                    
                    // For elements with their own animation classes
                    if (entry.target.classList.contains('animate-on-scroll')) {
                        entry.target.classList.add('animate-fadeIn');
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        elementsToAnimate.forEach(element => {
            element.classList.add('in-view');
        });
    }
}

/**
 * Sets up animations for service items (on the services page)
 */
function setupServiceItemAnimations() {
    const serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length === 0) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        serviceItems.forEach(item => {
            observer.observe(item);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        serviceItems.forEach(item => {
            item.classList.add('in-view');
        });
    }
}

/**
 * Enhances the hover effects for gallery items
 */
function enhanceGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add additional zoom effect
            const image = this.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1.1)';
                image.style.transition = 'transform 0.5s ease';
            }
            
            // Enhance caption animation
            const caption = this.querySelector('.gallery-item-caption');
            if (caption) {
                caption.style.transform = 'translateY(0)';
                caption.style.opacity = '1';
                caption.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('img');
            if (image) {
                image.style.transform = '';
            }
            
            const caption = this.querySelector('.gallery-item-caption');
            if (caption) {
                caption.style.transform = '';
                caption.style.opacity = '';
            }
        });
    });
}

/**
 * Enhances the hover effects for buttons
 */
function enhanceButtons() {
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    if (buttons.length === 0) return;
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Amplify hover effect
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 7px 15px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });
}

/**
 * Adds a parallax effect to the hero section (optional - can be added if desired)
 */
function setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (scrollPosition <= window.innerHeight) {
            // Parallax effect: background moves slower than scroll
            hero.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
        }
    });
}

/**
 * Enhanced lightbox animation for the gallery
 * This function should be called after the existing lightbox initialization
 */
function enhanceLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    
    if (!lightbox || !lightboxImg || !lightboxCaption || !lightboxClose) return;
    
    // Enhanced open animation
    function showLightboxWithAnimation() {
        lightbox.style.display = 'flex';
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.style.transition = 'opacity 0.3s ease-out';
            
            // Content animation
            lightboxImg.style.transform = 'scale(0.9)';
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            }, 100);
            
            lightboxCaption.style.opacity = '0';
            setTimeout(() => {
                lightboxCaption.style.opacity = '1';
                lightboxCaption.style.transition = 'opacity 0.5s ease-out';
            }, 300);
        }, 10);
    }
    
    // Close animation
    function hideLightboxWithAnimation() {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Reset for next open
            lightbox.style.opacity = '';
            lightboxImg.style.transform = '';
            lightboxImg.style.opacity = '';
        }, 300);
    }
    
    // Add event listener for existing lightbox
    lightboxClose.addEventListener('click', hideLightboxWithAnimation);
    
    // Add outside click handler
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            hideLightboxWithAnimation();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupMobileNav();
    setupSmoothScrolling();
    setupLazyLoading();
    setupPageTransition();
    setupGalleryFilter();
    setupFormValidation();
    checkWebpSupport();
});

function setupMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    if (window.innerWidth <= 767 && !navMenu.querySelector('.menu-close')) {
        const menuClose = document.createElement('button');
        menuClose.className = 'menu-close';
        menuClose.innerHTML = '&times;';
        menuClose.setAttribute('aria-label', 'Menü schließen');
        navMenu.prepend(menuClose);
        menuClose.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        });
    } else if (window.innerWidth > 767) {
        const menuClose = navMenu.querySelector('.menu-close');
        if (menuClose && menuClose.parentNode) {
            menuClose.parentNode.removeChild(menuClose);
        }
    }

    document.addEventListener('click', function(e) {
        if (
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
            const menuClose = navMenu.querySelector('.menu-close');
            if (menuClose && menuClose.parentNode) {
                menuClose.parentNode.removeChild(menuClose);
            }
        } else {
            if (!navMenu.querySelector('.menu-close')) {
                const menuClose = document.createElement('button');
                menuClose.className = 'menu-close';
                menuClose.innerHTML = '&times;';
                menuClose.setAttribute('aria-label', 'Menü schließen');
                navMenu.prepend(menuClose);
                menuClose.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    document.body.style.overflow = '';
                });
            }
        }
    });

    markActiveNavItem();
}

function markActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath === 'index.html') ||
            (currentPath === '/index.html' && linkPath === 'index.html') ||
            (currentPath.includes(linkPath) && linkPath !== 'index.html' && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    document.body.style.overflow = '';
                }
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 20;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) return;
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.style.opacity = '0';
                    image.style.transition = 'opacity 0.5s ease';
                    image.src = image.dataset.src || image.src;
                    image.onload = function() {
                        image.style.opacity = '1';
                    };
                    imageObserver.unobserve(image);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px 200px 0px'
        });
        lazyImages.forEach(image => {
            if (image.dataset.src && image.src !== image.dataset.src) {
                image.style.opacity = '0';
                imageObserver.observe(image);
            }
        });
    } else {
        lazyImages.forEach(image => {
            image.src = image.dataset.src || image.src;
        });
    }
}

function setupPageTransition() {
    if (!document.querySelector('.page-transition')) {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        setTimeout(() => {
            transition.classList.add('fade-out');
            transition.addEventListener('transitionend', function() {
                transition.style.display = 'none';
            });
        }, 500);
    }
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        if (link.hostname === window.location.hostname && 
            !link.hasAttribute('download') && 
            !link.getAttribute('target') && 
            link.getAttribute('href') !== '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const transition = document.querySelector('.page-transition');
                transition.style.display = 'block';
                setTimeout(() => {
                    transition.classList.add('active');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                }, 10);
            });
        }
    });
}

function setupGalleryLayout() {
    const gallery = document.getElementById('gallery');
    if (!gallery || gallery.children.length === 0) return;
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.gridRow = '';
        item.style.gridColumn = '';
        item.style.height = window.innerWidth >= 768 ? '280px' : '250px';
        const img = item.querySelector('img');
        if (img) {
            img.style.objectFit = 'cover';
            img.style.width = '100%';
            img.style.height = '100%';
        }
    });
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && activeFilter.getAttribute('data-filter') !== 'all') {
        const filter = activeFilter.getAttribute('data-filter');
        let delay = 0;
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.transitionDelay = `${delay * 0.05}s`;
                delay++;
            }
        });
    }
}

function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            let delay = 0;
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
                    item.style.transitionDelay = `${delay * 0.05}s`;
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 20);
                    }, delay * 30);
                    delay++;
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
            setTimeout(setupGalleryLayout, 500);
        });
    });
    const allFilterButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterButton) {
        allFilterButton.classList.add('active');
    }
    setupGalleryLayout();
    window.addEventListener('resize', setupGalleryLayout);
}

function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const privacy = document.getElementById('privacy');
        if (!name.value.trim()) {
            name.classList.add('error');
            isValid = false;
            name.classList.add('shake');
            setTimeout(() => { name.classList.remove('shake'); }, 500);
        } else {
            name.classList.remove('error');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            isValid = false;
            email.classList.add('shake');
            setTimeout(() => { email.classList.remove('shake'); }, 500);
        } else {
            email.classList.remove('error');
        }
        if (!message.value.trim()) {
            message.classList.add('error');
            isValid = false;
            message.classList.add('shake');
            setTimeout(() => { message.classList.remove('shake'); }, 500);
        } else {
            message.classList.remove('error');
        }
        if (!privacy.checked) {
            privacy.classList.add('error');
            isValid = false;
            const privacyLabel = privacy.parentElement;
            privacyLabel.classList.add('shake');
            setTimeout(() => { privacyLabel.classList.remove('shake'); }, 500);
        } else {
            privacy.classList.remove('error');
        }
        return isValid;
    }

    const formFields = contactForm.querySelectorAll('.form-control, .form-check-input');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (field.type === 'checkbox') {
                field.classList.toggle('error', !field.checked);
            } else if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                field.classList.toggle('error', !field.value.trim() || !emailRegex.test(field.value.trim()));
            } else if (field.hasAttribute('required')) {
                field.classList.toggle('error', !field.value.trim());
            }
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm()) {
            if (formMessage) {
                formMessage.textContent = 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
                formMessage.className = 'form-message error';
            }
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Wird gesendet...';
            submitBtn.classList.add('btn-loading');
        }

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Fehler beim Senden der Nachricht');
        })
        .then(data => {
            if (formMessage) {
                formMessage.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.';
                formMessage.className = 'form-message success';
            }
            contactForm.reset();
            setTimeout(() => {
                if (formMessage) formMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            if (formMessage) {
                formMessage.textContent = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie uns telefonisch.';
                formMessage.className = 'form-message error';
            }
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Nachricht senden';
                submitBtn.classList.remove('btn-loading');
            }
        });
    });

    if (!document.querySelector('style#loading-spinner-style')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'loading-spinner-style';
        styleElement.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s infinite linear;
                margin-right: 8px;
            }
            .shake {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
                40%, 60% { transform: translate3d(3px, 0, 0); }
            }
            .btn-loading {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

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

function addHoverEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.btn');
    heroButtons.forEach(button => {
        if (button.getAttribute('href') && button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .certificate-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const setVisible = () => { img.style.opacity = '1'; };
        const setHidden = () => { img.style.opacity = '0'; };
        img.style.transition = 'opacity 0.5s ease';
        
        if (img.complete && img.naturalWidth > 0) {
            setVisible();
        } else {
            setHidden();
            img.addEventListener('load', setVisible, { once: true });
        }
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.product-card, .certificate-item, .contact-item, .btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // HERO CAROUSEL
    const slides = Array.from(document.querySelectorAll('.hero-carousel .slide'));
    const dots = Array.from(document.querySelectorAll('.hero-carousel .dot'));
    const prevBtn = document.querySelector('.hero-carousel .prev');
    const nextBtn = document.querySelector('.hero-carousel .next');
    let currentSlide = 0;
    let autoPlayTimer = null;
    const AUTO_PLAY_INTERVAL_MS = 4000;

    function goToSlide(index) {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        dots.forEach((d, i) => {
            const isActive = i === currentSlide;
            d.classList.toggle('active', isActive);
            d.setAttribute('aria-selected', String(isActive));
        });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
        stopAutoplay();
        autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL_MS);
    }

    function stopAutoplay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }

    if (slides.length) {
        // Setup controls
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); }));

        // Pause on hover for better UX
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }

        // Initialize
        goToSlide(0);
        if (slides.length >= 2) startAutoplay();
    }

    // Lightbox fullscreen on click
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lbPrev = document.querySelector('.lightbox-control.lb-prev');
    const lbNext = document.querySelector('.lightbox-control.lb-next');
    const carouselRoot = document.querySelector('.hero-carousel');
    if (carouselRoot && lightbox && lightboxImg) {
        const openWithIndex = (index) => {
            stopAutoplay();
            currentSlide = index;
            lightboxImg.src = slides[currentSlide].querySelector('img').src;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        carouselRoot.addEventListener('click', (e) => {
            const img = e.target.closest('img');
            if (!img) return;
            // find slide index for clicked image
            const parentSlide = img.closest('.slide');
            const index = slides.indexOf(parentSlide);
            openWithIndex(index >= 0 ? index : currentSlide);
        });
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            if (slides.length >= 2) startAutoplay();
        };
        const nextLightbox = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            lightboxImg.src = slides[currentSlide].querySelector('img').src;
        };
        const prevLightbox = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            lightboxImg.src = slides[currentSlide].querySelector('img').src;
        };
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });
        if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
        });
    }

    // Form validation (if forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form validation logic here
            console.log('Form submitted');
        });
    });
    
    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to scroll to top button
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .nav.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-list {
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
        }
        
        .nav-link {
            padding: 1rem;
            display: block;
            border-bottom: 1px solid #eee;
        }
        
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

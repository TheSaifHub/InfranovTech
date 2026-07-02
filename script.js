document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('scroll-progress');
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const scrollTop = document.querySelector('.scroll-top');

    const removeMenu = () => navLinks?.classList.remove('active');

    const updateScroll = () => {
        const scroll = window.scrollY;
        const max = document.body.scrollHeight - window.innerHeight;
        const progress = max > 0 ? (scroll / max) * 100 : 0;
        if (progressBar) progressBar.style.width = `${progress}%`;
        header?.classList.toggle('scrolled', scroll > 40);
        scrollTop?.classList.toggle('visible', scroll > 520);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll);

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach((link) => {
        if (link.getAttribute('href') === window.location.pathname.split('/').pop() ||
            (window.location.pathname.split('/').pop() === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
        link.addEventListener('click', removeMenu);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
        revealObserver.observe(el);
    });

    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.dataset.target, 10) || 0;
        let current = 0;
        const step = Math.max(Math.round(target / 120), 1);
        const startCounter = () => {
            current += step;
            counter.textContent = current < target ? current : `${target}${target >= 100 ? '+' : ''}`;
            if (current < target) requestAnimationFrame(startCounter);
        };
        const counterObserver = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                startCounter();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        counterObserver.observe(counter);
    });

    const typedElement = document.querySelector('.typing-text');
    if (typedElement) {
        const lines = [
            'AI-Driven Platforms',
            'Cloud-Native Experiences',
            'Enterprise Web Systems',
            'Mobile & SaaS Ecosystems'
        ];
        let lineIndex = 0;
        let charIndex = 0;
        const type = () => {
            const current = lines[lineIndex];
            typedElement.textContent = current.slice(0, charIndex);
            charIndex += 1;
            if (charIndex <= current.length) {
                setTimeout(type, 80);
            } else {
                setTimeout(() => {
                    charIndex = 0;
                    lineIndex = (lineIndex + 1) % lines.length;
                    type();
                }, 1500);
            }
        };
        type();
    }

    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    if (slider && prevBtn && nextBtn) {
        let position = 0;
        const cards = slider.children;
        const updateSlider = () => {
            const cardWidth = cards[0]?.clientWidth || 0;
            slider.style.transform = `translateX(${-position * cardWidth}px)`;
        };
        nextBtn.addEventListener('click', () => {
            if (position < cards.length - 1) {
                position += 1;
                updateSlider();
            }
        });
        prevBtn.addEventListener('click', () => {
            if (position > 0) {
                position -= 1;
                updateSlider();
            }
        });
        window.addEventListener('resize', updateSlider);
    }

    const filterButtons = document.querySelectorAll('.project-filter button');
    const projectItems = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.project-filter button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            projectItems.forEach(item => {
                item.style.display = filter === 'all' || item.dataset.category === filter ? 'grid' : 'none';
            });
        });
    });

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const popup = document.querySelector('.popup-msg');
            popup?.classList.add('show');
            form.reset();
            setTimeout(() => popup?.classList.remove('show'), 3200);
        });
    }

    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');
    if (window.innerWidth > 768) {
        cursorDot.className = 'cursor-dot';
        cursorRing.className = 'cursor-ring';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', event => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const animateCursor = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.querySelectorAll('a, button, .btn, .service-card, .project-card, .testimonial-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
        });
    }

    document.querySelectorAll('[data-speed]').forEach(layer => {
        window.addEventListener('scroll', () => {
            const value = window.scrollY * parseFloat(layer.dataset.speed);
            layer.style.transform = `translateY(${value}px)`;
        });
    });

    scrollTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('load', () => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 800);
        }
    });
});

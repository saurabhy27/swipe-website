/* ============================================================
   Swipe — Animation & Interaction System
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Sticky navbar + scroll-spy ── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    // Map each nav link to its target section
    const sections = [...navLinks].map(link => {
        const id = link.getAttribute('href').replace('#', '');
        return { link, section: document.getElementById(id) };
    }).filter(({ section }) => section);

    function updateNavbar() {
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

        // Scrolled background
        navbar.classList.toggle('scrolled', scrollY > 40);

        // Active link — find the section closest to top of viewport
        let current = null;
        sections.forEach(({ section }) => {
            const top = section.getBoundingClientRect().top;
            if (top <= 120) current = section.id;
        });

        navLinks.forEach(link => {
            const isActive = current && link.getAttribute('href') === `#${current}`;
            link.classList.toggle('nav-active', !!isActive);
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    /* ── 2. Split hero heading into word spans ── */
    function splitWords(el) {
        const text = el.innerText;
        el.innerHTML = text.split(/(\s+)/).map(word =>
            word.trim()
                ? `<span class="word"><span class="word-inner">${word}</span></span>`
                : word
        ).join('');
    }
    document.querySelectorAll('.hero-content h1').forEach(splitWords);

    /* ── 3. Stagger delay helper ── */
    function staggerChildren(parent, selector, baseDelay = 0, step = 80) {
        parent.querySelectorAll(selector).forEach((el, i) => {
            el.style.transitionDelay = `${baseDelay + i * step}ms`;
        });
    }

    /* ── 4. IntersectionObserver for all animated elements ── */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('in-view');
            io.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    // Hero words — fire immediately on load
    requestAnimationFrame(() => {
        document.querySelectorAll('.hero-content h1 .word').forEach((w, i) => {
            w.style.transitionDelay = `${120 + i * 60}ms`;
            w.classList.add('in-view');
        });

        // Animate hero sub-elements in sequence after title
        const heroEls = [
            document.querySelector('.hero-content .hero-sub'),
            document.querySelector('.hero-content .workspace-pill'),
            document.querySelector('.hero-content .hero-cta'),
        ].filter(Boolean);

        heroEls.forEach((el, i) => {
            el.style.transitionDelay = `${500 + i * 130}ms`;
            el.classList.add('in-view');
        });
    });

    // Observe all animatable elements
    document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-scale, .reveal').forEach(el => {
        if (!el.closest('.hero-content')) io.observe(el);
    });

    // Feature lists — stagger each <li>
    document.querySelectorAll('.feature-list').forEach(list => {
        list.querySelectorAll('li').forEach((li, i) => {
            li.classList.add('fade-up');
            li.style.transitionDelay = `${i * 70}ms`;
            io.observe(li);
        });
    });

    // Workspace modes — stagger
    document.querySelectorAll('.ws-mode').forEach((m, i) => {
        m.classList.add('fade-up');
        m.style.transitionDelay = `${i * 120}ms`;
        io.observe(m);
    });

    // Bank items — stagger
    document.querySelectorAll('.bank-item').forEach((b, i) => {
        b.classList.add('fade-up');
        b.style.transitionDelay = `${i * 50}ms`;
        io.observe(b);
    });

    /* ── 5. Subtle hero phone parallax on scroll ── */
    const heroPhones = document.querySelector('.hero-phones');
    window.addEventListener('scroll', () => {
        if (!heroPhones) return;
        const y = window.scrollY;
        heroPhones.style.transform = `translateY(${y * 0.12}px)`;
    }, { passive: true });

    /* ── 6. Workspace pill — animate active/idle toggle ── */
    const wsItems = document.querySelectorAll('.ws-item');
    if (wsItems.length >= 2) {
        let active = 0;
        setInterval(() => {
            wsItems.forEach(i => i.classList.remove('ws-active'));
            active = (active + 1) % wsItems.length;
            wsItems[active].classList.add('ws-active');
        }, 2400);
    }

    /* ── 7. Workspace phone — floating animation ── */
    const wsPhone = document.querySelector('.ws-phone-img');
    if (wsPhone) {
        wsPhone.style.animation = 'float 4s ease-in-out infinite';
    }

    /* ── 8. Mobile Menu Toggle ── */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('nav-open');
        });
    }

});

/* Carrousel du HERO */

(function () {
    const slides = Array.from(document.querySelectorAll('#slides .slide'));
    const dotsBox = document.getElementById('dots');
    const hero = document.querySelector('.hero');
    const DELAY = 6000;          // durée d'affichage de chaque image (ms)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0, timer = null;

    if (!slides.length) return;

    /* Pastilles générées automatiquement (une par slide) */
    slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Image ' + (i + 1));
        b.addEventListener('click', () => { goTo(i); restart(); });
        dotsBox.appendChild(b);
    });
    const dots = Array.from(dotsBox.children);

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
        dots.forEach((d, n) => d.setAttribute('aria-current', n === index ? 'true' : 'false'));
    }
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function start() {
        if (reduced) return;              // pas d'autoplay si "réduire les animations"
        stop();
        timer = setInterval(next, DELAY);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    document.getElementById('nextBtn').addEventListener('click', () => { next(); restart(); });
    document.getElementById('prevBtn').addEventListener('click', () => { prev(); restart(); });

    /* Pause au survol / focus */
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);

    /* Reprise quand l'onglet redevient visible */
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

    /* Clavier */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); restart(); }
        if (e.key === 'ArrowLeft') { prev(); restart(); }
    });

    /* Swipe tactile */
    let x0 = null;
    hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); restart(); }
        x0 = null;
    });

    goTo(0);
    start();
})();


/* Navbar */

(function () {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    const links = Array.from(navLinks.querySelectorAll('a[href^="#"]'));

    /* Ombre + hauteur réduite après 10 px de scroll */
    const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Menu mobile */
    burger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    links.concat(navLinks.querySelectorAll('a')).forEach(a =>
        a.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
        })
    );

    /* Section active surlignée dans la navbar */
    const sections = links
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                links.forEach(a => a.classList.toggle('is-active',
                    a.getAttribute('href') === '#' + e.target.id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(s => io.observe(s));
    }
})();
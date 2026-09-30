(function () {
    var doc = document.documentElement;
    doc.classList.add('js');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Typing effect
    var words = ['2D & 3D games', 'game AI', 'fun gameplay', 'Unity worlds'];
    var el = document.getElementById('typed');
    if (reduce) {
        el.textContent = words[0];
    } else {
        var w = 0, c = 0, deleting = false;
        (function tick() {
            var word = words[w];
            c += deleting ? -1 : 1;
            el.textContent = word.slice(0, c);
            var delay = deleting ? 45 : 90;
            if (!deleting && c === word.length) { deleting = true; delay = 1500; }
            else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
            setTimeout(tick, delay);
        })();
    }

    // Scroll reveal + count-up
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            e.target.querySelectorAll('[data-count]').forEach(countUp);
            io.unobserve(e.target);
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });

    function countUp(n) {
        var target = +n.dataset.count;
        if (reduce) { n.textContent = target + '+'; return; }
        var start = performance.now();
        (function step(t) {
            var p = Math.min((t - start) / 1200, 1);
            n.textContent = Math.round(target * p) + (p === 1 ? '+' : '');
            if (p < 1) requestAnimationFrame(step);
        })(start);
    }

    // Nav: scrolled state, progress bar, active link
    var nav = document.getElementById('nav');
    var bar = document.getElementById('progress');
    var links = document.querySelectorAll('.nav-links a');
    var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
    function onScroll() {
        var y = window.scrollY;
        nav.classList.toggle('scrolled', y > 20);
        bar.style.width = (y / (doc.scrollHeight - innerHeight)) * 100 + '%';
        var idx = 0;
        sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) idx = i; });
        links.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navLinks');
    toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
    });
    links.forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });

    if (reduce || !window.matchMedia('(hover: hover)').matches) return;

    // Cursor glow
    var glow = document.getElementById('glow');
    addEventListener('mousemove', function (e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // 3D tilt on cards
    document.querySelectorAll('.tilt').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transition = 'border-color .3s, box-shadow .3s';
            card.style.transform = 'perspective(900px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg) translateY(-6px)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transition = '';
            card.style.transform = '';
        });
    });
})();

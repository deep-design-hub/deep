import { subscribe } from "./data/subscribers";

export default function mountHomeRuntime() {

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ======================================================================
       1. HERO INTRO
       header.html runs a loader for ~1.8s, so hold the intro until it clears.
       ====================================================================== */
    function markReady() { document.body.classList.add('is-ready'); }

    (function waitForLoader() {
        var loader = document.getElementById('loaderWrapper');
        var hero = document.getElementById('hero');
        var deadline = Date.now() + 2400;

        (function poll() {
            var done = !loader || loader.classList.contains('hidden') || Date.now() > deadline;
            if (done) {
                if (hero) hero.classList.add('is-in');
                markReady();
                return;
            }
            setTimeout(poll, 120);
        })();
    })();

    /* ======================================================================
       2. SPLIT HEADLINE
       ====================================================================== */
    document.querySelectorAll('[data-split]').forEach(function (line) {
        var words = line.textContent.trim().split(/\s+/);
        line.textContent = '';
        words.forEach(function (word, i) {
            var span = document.createElement('span');
            span.className = 'nh-word';
            span.style.setProperty('--d', (i * 0.08 + 0.1) + 's');
            span.textContent = word;
            line.appendChild(span);
            if (i < words.length - 1) line.appendChild(document.createTextNode(' '));
        });
    });

    /* ======================================================================
       3. MARQUEE — duplicate the group so -50% loops seamlessly
       ====================================================================== */
    function loopTicker(trackId) {
        var t = document.getElementById(trackId);
        if (t && t.children.length === 1) {
            t.appendChild(t.firstElementChild.cloneNode(true));
        }
    }
    loopTicker('nhMarquee');
    loopTicker('nhTrust');

    /* ======================================================================
       4. POINTER PARALLAX
       ====================================================================== */
    var portrait = document.querySelector('.nh-portrait__frame');
    var glowA = document.querySelector('.nh-hero__glow--a');
    var glowB = document.querySelector('.nh-hero__glow--b');

    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        var rx = 0, ry = 0, tx = 0, ty = 0, raf = null;

        window.addEventListener('mousemove', function (e) {
            tx = (e.clientX / window.innerWidth - 0.5) * 2;
            ty = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!raf) raf = requestAnimationFrame(tick);
        });

        function tick() {
            rx += (tx - rx) * 0.06;
            ry += (ty - ry) * 0.06;
            if (portrait) {
                portrait.style.transform =
                    'perspective(1200px) rotateY(' + (rx * 6) + 'deg) rotateX(' + (-ry * 5) + 'deg)';
            }
            if (glowA) glowA.style.transform = 'translate3d(' + (-rx * 40) + 'px,' + (-ry * 30) + 'px,0)';
            if (glowB) glowB.style.transform = 'translate3d(' + (rx * 34) + 'px,' + (ry * 26) + 'px,0)';
            raf = (Math.abs(tx - rx) > 0.001 || Math.abs(ty - ry) > 0.001) ? requestAnimationFrame(tick) : null;
        }
    }

    /* ======================================================================
       5. SCROLL REVEALS + COUNTERS
       Moved to revealRuntime.js — mounted globally for every route in App.jsx,
       gated on page load (body.is-loaded) so inner pages reveal too.
       ====================================================================== */

    /* ======================================================================
       6b. NEWSLETTER
       Stored in the subscribers table (src/data/subscribers.js) — this is
       the "DB insert" until the PHP API replaces data/db.js.
       ====================================================================== */
    var newsForm = document.getElementById('nhNewsForm');
    var newsMsg = document.getElementById('nhNewsMsg');

    if (newsForm && newsMsg) {
        newsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById('nhNewsEmail');
            var email = (input.value || '').trim();

            function say(text, ok) {
                newsMsg.textContent = text;
                newsMsg.className = 'nh-form__msg ' + (ok ? 'nh-form__msg--ok' : 'nh-form__msg--err');
            }

            if (!email) { say('Add your email first.', false); input.focus(); return; }

            var result = subscribe(email);
            if (result.ok) {
                newsForm.reset();
                say(result.message, true);
            } else {
                say(result.message, false);
                input.focus();
            }
        });
    }

    /* ======================================================================
       7. PREVIEW PROTECTION
       Discourages casual saving. Not a security boundary — real protection
       has to live on the server (no originals shipped, hotlink rules,
       expiring signed URLs).
       ====================================================================== */
    document.addEventListener('contextmenu', function (e) {
        if (e.target.closest('[data-protect], .nh-viewer')) e.preventDefault();
    });
    document.addEventListener('dragstart', function (e) {
        if (e.target.closest('[data-protect]')) e.preventDefault();
    });
    document.addEventListener('selectstart', function (e) {
        if (e.target.closest('[data-protect]')) e.preventDefault();
    });

    /* ======================================================================
       8. PREVIEWER  (image mode + live-demo frame mode)
       ====================================================================== */
    var viewer = document.getElementById('nhViewer');
    var vImg = document.getElementById('nhVImg');
    var vFrame = document.getElementById('nhVFrame');
    var vWm = document.getElementById('nhVWatermark');
    var vTitle = document.getElementById('nhVTitle');
    var vMeta = document.getElementById('nhVMeta');
    var lastFocus = null;
    var mode = 'image';
    var current = 0;

    var images = [].slice.call(document.querySelectorAll('[data-viewer]'));
    var frames = [].slice.call(document.querySelectorAll('[data-frame]'));

    function renderImage(item) {
        mode = 'image';
        current = images.indexOf(item);
        if (current < 0) current = 0;
        vImg.src = item.getAttribute('data-src');
        vImg.alt = item.getAttribute('data-title') || '';
        vTitle.textContent = item.getAttribute('data-title') || '';
        vMeta.textContent = item.getAttribute('data-meta') || '';
        vImg.hidden = false; vWm.hidden = false; vFrame.hidden = true;
    }

    function step(delta) {
        if (!images.length) return;
        renderImage(images[(current + delta + images.length) % images.length]);
    }

    function renderFrame(btn) {
        mode = 'frame';
        var url = btn.getAttribute('data-url');
        vTitle.textContent = btn.getAttribute('data-title') || '';
        vMeta.textContent = btn.getAttribute('data-meta') || '';
        vImg.hidden = true; vWm.hidden = true; vFrame.hidden = false;
        vFrame.src = url;
    }

    function open() {
        lastFocus = document.activeElement;
        viewer.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(function () { viewer.classList.add('is-visible'); });
        document.getElementById('nhVClose').focus();
    }

    function close() {
        viewer.classList.remove('is-visible');
        document.body.style.overflow = '';
        vFrame.removeAttribute('src');
        setTimeout(function () { viewer.classList.remove('is-open'); }, 300);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function wire(el, fn) {
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', fn);
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
        });
    }

    images.forEach(function (item) { wire(item, function () { renderImage(item); open(); }); });
    frames.forEach(function (btn) { wire(btn, function () { renderFrame(btn); open(); }); });

    document.getElementById('nhVClose').addEventListener('click', close);
    document.getElementById('nhVPrev').addEventListener('click', function () { step(-1); });
    document.getElementById('nhVNext').addEventListener('click', function () { step(1); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer) close(); });

    document.addEventListener('keydown', function (e) {
        if (!viewer.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
    });
})();

}

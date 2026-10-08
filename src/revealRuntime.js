/*
 * mountReveal() — scroll reveals for EVERY page.
 *
 * Two observers:
 *   ioShow — adds .is-in when an element climbs into view (bottom margin 8%),
 *            so content animates in whether you scroll down OR up.
 *   ioHide — removes .is-in only when the element is completely out of the
 *            viewport, so the next time it re-enters it animates again.
 *
 * A MutationObserver picks up elements React renders later (filters, lists),
 * so cards added after mount are observed too. Counters run once
 * (data-counted) to avoid re-counting on every pass.
 */
export default function mountReveal() {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var started = false;
    var pollId = null;
    var ioShow = null;
    var ioHide = null;
    var mo = null;
    var deadline = Date.now() + 5000;

    function countUp(el) {
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion) { el.textContent = target + suffix; return; }

        var duration = 1500, start = null;
        function frame(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function show(el) {
        if (!el.classList.contains('is-in')) el.classList.add('is-in');
        if (el.hasAttribute('data-count') && !el.hasAttribute('data-counted')) {
            el.setAttribute('data-counted', '');
            countUp(el);
        }
    }

    function hide(el) {
        if (el.classList.contains('is-in')) el.classList.remove('is-in');
    }

    function isRevealable(node) {
        return node && node.nodeType === 1 &&
            (node.matches('.nh-in, [data-count]') ||
             (node.querySelector && node.querySelector('.nh-in, [data-count]')));
    }

    function watch(root) {
        if (!ioShow) return;
        if (isRevealable(root)) {
            if (root.matches && root.matches('.nh-in, [data-count]')) {
                ioShow.observe(root);
                ioHide.observe(root);
            }
            if (root.querySelectorAll) {
                root.querySelectorAll('.nh-in, [data-count]').forEach(function (el) {
                    ioShow.observe(el);
                    ioHide.observe(el);
                });
            }
        }
    }

    function revealNow() {
        document.querySelectorAll('.nh-in, [data-count]').forEach(show);
    }

    function start() {
        if (started) return;
        started = true;
        if (pollId) { clearInterval(pollId); pollId = null; }

        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealNow();
            return;
        }

        // Show when the element climbs into the safe viewing area.
        ioShow = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) show(entry.target);
            });
        }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

        // Hide only once the element has fully left the screen —
        // scrolling back (up or down) plays the reveal again.
        ioHide = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) hide(entry.target);
            });
        }, { threshold: 0 });

        document.querySelectorAll('.nh-in, [data-count]').forEach(function (el) {
            ioShow.observe(el);
            ioHide.observe(el);
        });

        // React re-renders (filters, tabs) add nodes later — watch for them.
        if ('MutationObserver' in window) {
            mo = new MutationObserver(function (muts) {
                muts.forEach(function (m) {
                    Array.prototype.forEach.call(m.addedNodes, watch);
                });
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Gate: nothing animates until the loader has cleared and the page is
    // loaded (body.is-loaded is set by headerRuntime). Hard deadline so a
    // stuck loader can never leave content invisible.
    function gate() {
        var loader = document.getElementById('loaderWrapper');
        var loaderGone = !loader || loader.classList.contains('hidden');
        var pageLoaded = document.readyState === 'complete' &&
                         document.body.classList.contains('is-loaded');
        if ((loaderGone && pageLoaded) || Date.now() > deadline) start();
    }

    pollId = setInterval(gate, 120);
    gate();

    return function cleanup() {
        if (pollId) clearInterval(pollId);
        if (ioShow) ioShow.disconnect();
        if (ioHide) ioHide.disconnect();
        if (mo) mo.disconnect();
        started = false;
    };
}

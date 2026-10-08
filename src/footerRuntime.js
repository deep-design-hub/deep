import { SITE } from "./data/site.js";
import { SOCIALS, socialIcons } from "./data/socials.js";

export default function mountFooterRuntime() {
(function () {
    var isInit = !!window._ddInit;
    window._ddInit = true;

            // Map legacy Font Awesome classes to short icon names
            var iconMap = {
                'fab fa-behance': 'behance',
                'fab fa-dribbble': 'dribbble',
                'fab fa-instagram': 'instagram',
                'fab fa-linkedin': 'linkedin',
                'fab fa-linkedin-in': 'linkedin',
                'fab fa-github': 'github',
                'fab fa-x-twitter': 'twitter',
                'fab fa-twitter': 'twitter',
                'fab fa-figma': 'figma',
                'fab fa-codepen': 'codepen',
                'fab fa-youtube': 'youtube',
                'fab fa-facebook-f': 'facebook',
                'fab fa-facebook': 'facebook',
            };

            function getSocialIcon(iconClass) {
                if (socialIcons[iconClass]) return socialIcons[iconClass];
                if (iconMap[iconClass]) return socialIcons[iconMap[iconClass]];
                // Try partial match
                for (var key in iconMap) {
                    if (iconClass && iconClass.indexOf(key.split(' ').pop()) !== -1) {
                        return socialIcons[iconMap[key]];
                    }
                }
                return socialIcons.linkedin;
            }

    /* ---------- helpers: tolerate both "label" and "name" ---------- */
    function socialLabel(item) {
        return (item && (item.label || item.name)) || 'Social';
    }

    function socialUrl(item) {
        var url = item && item.url ? String(item.url).trim() : '';
        if (!url) return '#';
        if (!/^(https?:)?\/\//i.test(url) && !/^mailto:/i.test(url) && !/^tel:/i.test(url)) {
            url = 'https://' + url.replace(/^\/+/, '');
        }
        return url;
    }

    function pageUrl(page) {
        if (!page || page === 'home' || page === 'index') return '/';
        return '/' + String(page).replace(/^\/+/, '');
    }

    function linkHref(item) {
        if (item.to) return item.to;
        return pageUrl(item.page);
    }

    function renderSocial(target, list, linkClass, withLabel) {
        if (!target) return;
        var items = (list && list.length) ? list : SOCIALS;
        target.innerHTML = '';
        items.forEach(function (item) {
            var name = socialLabel(item);
            var a = document.createElement('a');
            a.href = socialUrl(item);
            a.className = linkClass;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', name);
            a.title = name;
            a.innerHTML = getSocialIcon(item.icon) + (withLabel ? '<span>' + name + '</span>' : '');
            target.appendChild(a);
        });
    }

    function renderLinks(target, list) {
        if (!target) return;
        var items = (list && list.length) ? list : [];
        target.innerHTML = '';
        items.forEach(function (item) {
            var label = (item && (item.label || item.name)) || '';
            if (!label) return;
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = linkHref(item);
            a.setAttribute('data-nav', '');
            a.innerHTML = '<span class="material-symbols-rounded">chevron_right</span> ' + label;
            li.appendChild(a);
            target.appendChild(li);
        });
    }

    /* ---------- render footer from src/data/site.js (single source) ---------- */
    function applyData() {
        renderSocial(document.getElementById('footerSocial'), SOCIALS, 'social-link', false);

        renderLinks(document.getElementById('footerQuickLinks'), SITE.footer.quickLinks);
        renderLinks(document.getElementById('footerServiceLinks'), SITE.footer.serviceLinks);

        var footerEmail = document.getElementById('footerEmail');
        if (footerEmail) footerEmail.textContent = SITE.contact.email;
        var footerLocation = document.getElementById('footerLocation');
        if (footerLocation) footerLocation.innerHTML = SITE.contact.location + '<br>' + SITE.contact.locationNote;

        // WhatsApp float - always visible; number comes from site data
        var waNumber = String(SITE.contact.whatsapp || '').replace(/[^0-9]/g, '');
        var waFloat = document.getElementById('whatsappFloat');
        if (waFloat) {
            waFloat.href = waNumber ? 'https://wa.me/' + waNumber : '#';
            waFloat.style.display = 'flex';
        }

        var footerCopyright = document.getElementById('footerCopyright');
        if (footerCopyright) {
            footerCopyright.innerHTML = '&copy; ' + SITE.footer.copyright + '. All rights reserved.';
        }
    }

    applyData();

            // ========== FOOTER INTERACTIONS ==========
            // Ripple effect on social links + keydown (global — only bind once)
            if (!isInit) {
                document.addEventListener('click', function(e) {
                    var link = e.target.closest('.social-link');
                    if (link) {
                        e.preventDefault();
                        var ripple = document.createElement('span');
                        ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.4);width:20px;height:20px;animation:ripple 0.6s ease-out;pointer-events:none;';
                        link.style.position = 'relative';
                        link.style.overflow = 'hidden';
                        link.appendChild(ripple);
                        setTimeout(function() {
                            ripple.remove();
                        }, 600);
                    }
                });

                // Add ripple animation style dynamically
                var rippleStyle = document.createElement('style');
                rippleStyle.textContent = '@keyframes ripple { from { transform: scale(0); opacity: 1; } to { transform: scale(4); opacity: 0; } }';
                document.head.appendChild(rippleStyle);
            }
})();

}

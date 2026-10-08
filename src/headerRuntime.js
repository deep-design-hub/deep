import { submitRequest } from "./data/requests";
import { sendEmail } from "./data/emails";
import { currentUser } from "./data/users";

export default function mountHeaderRuntime() {

(function () {
    var isInit = !!window._ddInit;
    window._ddInit = true;

            // ========== LOADER ==========
            var loaderWrapper = document.getElementById('loaderWrapper');

            function hideLoader() {
                if (loaderWrapper) {
                    loaderWrapper.classList.add('hidden');
                }
                // Gate every page animation on "page actually loaded"
                document.body.classList.add('is-loaded');
            }

            // Hide loader after content is ready (global — only bind once)
            if (!isInit) {
                if (document.readyState === 'complete') {
                    setTimeout(hideLoader, 1800);
                } else {
                    window.addEventListener('load', function() {
                        setTimeout(hideLoader, 1800);
                    });
                }
                // Safety: never leave the loader up past 4.5s
                setTimeout(hideLoader, 4500);
            } else {
                // On SPA nav, hide loader quickly
                setTimeout(hideLoader, 300);
            }

            // ========== PANELS & NAVIGATION ==========
            var overlay = document.getElementById('panelOverlay');
            var mobileNavPanel = document.getElementById('mobileNavPanel');
            var requestPanel = document.getElementById('requestPanel');
            var mobileMenuToggler = document.getElementById('mobileMenuToggler');
            var closeMobileNav = document.getElementById('closeMobileNav');
            var openRequestBtn = document.getElementById('openRequestBtn');
            var closeRequestPanel = document.getElementById('closeRequestPanel');
            var mobileRequestBtn = document.getElementById('mobileRequestBtn');
            var requestForm = document.getElementById('requestForm');
            var toastSuccess = document.getElementById('toastSuccess');
            var mainHeader = document.getElementById('mainHeader');
            var activePanel = null;

            function closeAllPanels() {
                if (mobileNavPanel) mobileNavPanel.classList.remove('active');
                if (requestPanel) requestPanel.classList.remove('active');
                if (overlay) overlay.classList.remove('show');
                if (mobileMenuToggler) mobileMenuToggler.classList.remove('active');
                activePanel = null;
                document.body.style.overflow = '';
            }

            function openPanel(panel) {
                closeAllPanels();
                if (panel) {
                    panel.classList.add('active');
                    if (overlay) overlay.classList.add('show');
                    activePanel = panel;
                    document.body.style.overflow = 'hidden';
                    if (panel === mobileNavPanel && mobileMenuToggler) {
                        mobileMenuToggler.classList.add('active');
                    }
                }
            }

            function toggleMobileNav() {
                if (activePanel === mobileNavPanel) {
                    closeAllPanels();
                } else {
                    openPanel(mobileNavPanel);
                }
            }

            function showToast() {
                var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Request sent successfully!';
                if (toastSuccess) {
                    var iconSpan = toastSuccess.querySelector('span');
                    if (iconSpan) iconSpan.textContent = 'check_circle';
                    var textNode = toastSuccess.childNodes[1];
                    if (textNode) textNode.textContent = ' ' + message;
                    toastSuccess.classList.add('show');
                    setTimeout(function() {
                        toastSuccess.classList.remove('show');
                    }, 3000);
                }
            }

            // Header scroll effect (global — only bind once)
            if (!isInit) {
                var scrollTicking = false;
                window.addEventListener('scroll', function() {
                    if (!scrollTicking) {
                        requestAnimationFrame(function() {
                            if (window.scrollY > 20) {
                                var h = document.getElementById('mainHeader');
                                if (h) h.classList.add('header-scrolled');
                            } else {
                                var h = document.getElementById('mainHeader');
                                if (h) h.classList.remove('header-scrolled');
                            }
                            scrollTicking = false;
                        });
                        scrollTicking = true;
                    }
                });
            }

            // Event listeners
            if (mobileMenuToggler) {
                mobileMenuToggler.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleMobileNav();
                });
            }

            if (closeMobileNav) closeMobileNav.addEventListener('click', closeAllPanels);
            if (closeRequestPanel) closeRequestPanel.addEventListener('click', closeAllPanels);

            if (openRequestBtn) {
                openRequestBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openPanel(requestPanel);
                });
            }

            if (mobileRequestBtn) {
                mobileRequestBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeAllPanels();
                    setTimeout(function() {
                        openPanel(requestPanel);
                    }, 150);
                });
            }

            if (overlay) overlay.addEventListener('click', closeAllPanels);

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeAllPanels();
            });

            // Form submission
            if (requestForm) {
                requestForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var inputs = requestForm.querySelectorAll('input[required], textarea[required], select[required]');
                    var valid = true;
                    inputs.forEach(function(input) {
                        if (!input.value.trim()) {
                            valid = false;
                            input.style.borderColor = '#ff4444';
                            input.style.animation = 'shake 0.5s ease';
                            setTimeout(function() {
                                input.style.animation = '';
                            }, 500);
                        } else {
                            input.style.borderColor = '#2a2a2a';
                        }
                    });

                    if (!valid) return;

                    var submitBtn = requestForm.querySelector('.submit-request');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = 'Sending... <span class="material-symbols-rounded">hourglass_empty</span>';
                    }

                    var formData = {
                        name: requestForm.querySelector('[name="name"]').value.trim(),
                        email: requestForm.querySelector('[name="email"]').value.trim(),
                        service: requestForm.querySelector('[name="service"]').value,
                        message: requestForm.querySelector('[name="message"]').value.trim(),
                        budget: requestForm.querySelector('[name="budget"]') ? requestForm.querySelector('[name="budget"]').value.trim() : ''
                    };

                    try {
                        var user = currentUser();
                        var row = submitRequest({
                            name: formData.name,
                            email: formData.email,
                            service: formData.service,
                            message: formData.message,
                            budget: formData.budget,
                            source: "panel",
                            userId: user ? user.id : ""
                        });
                        sendEmail({
                            to: formData.email,
                            name: formData.name,
                            template: "request_received",
                            data: { request: row }
                        });
                        showToast('Request sent! Confirmation is on its way to your inbox.');
                    } catch (err) {
                        showToast('Request received! I\'ll get back to you soon.');
                    }

                    requestForm.reset();
                    closeAllPanels();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Send Request <span class="material-symbols-rounded">arrow_forward</span>';
                    }
                });
            }

            // Close mobile nav when a link is clicked
            var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            mobileNavLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    closeAllPanels();
                });
            });

            // Mark the current page — green underline only
            (function markCurrent() {
                var here = (location.pathname || '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '');
                if (here === '') here = '/';
                document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
                    var href = (link.getAttribute('href') || '').replace(/\.html$/, '');
                    if (!href) return;
                    if (href === here || (href === '/' && (here === '/' || here === ''))) {
                        link.classList.add('is-current');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            })();

})();
    
}

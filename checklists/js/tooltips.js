/* ==========================================================
   Tooltips — Fixed-position popovers for document guides
   Uses position: fixed to avoid parent overflow clipping
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const guides = window.documentGuides || {};

    // Only ONE popover exists at a time — reused across all buttons
    let activePopover = null;
    let activeBtn = null;
    let closeTimer = null;

    // ---------- BUILD POPOVER HTML ----------
    function buildPopoverContent(docKey) {
        const guide = guides[docKey];
        if (!guide) return null;

        let html = `
            <div class="doc-popover-header">
                <h4>${guide.title}</h4>
                <button class="close-btn" aria-label="Close guide">✕</button>
            </div>
            <div class="doc-popover-body">
        `;

        if (guide.lookFor && guide.lookFor.length) {
            html += `<div class="doc-popover-section lookfor">
                <h5>✅ Look For</h5>
                <ul>${guide.lookFor.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.redFlags && guide.redFlags.length) {
            html += `<div class="doc-popover-section redflags">
                <h5>⚠️ Red Flags</h5>
                <ul>${guide.redFlags.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.crossCheck && guide.crossCheck.length) {
            html += `<div class="doc-popover-section crosscheck">
                <h5>🔗 Cross-Check With</h5>
                <ul class="pill-list">${guide.crossCheck.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.feedsInto && guide.feedsInto.length) {
            html += `<div class="doc-popover-section feedsinto">
                <h5>📐 Feeds Into</h5>
                <ul class="pill-list">${guide.feedsInto.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    // ---------- CREATE / REUSE THE POPOVER ELEMENT ----------
    function getPopover() {
        if (activePopover) return activePopover;

        // Create a fresh popover appended to <body> — nowhere to clip from
        activePopover = document.createElement('div');
        activePopover.className = 'doc-popover';
        document.body.appendChild(activePopover);

        // Close button handler (delegated)
        activePopover.addEventListener('click', (e) => {
            if (e.target.closest('.close-btn')) {
                e.stopPropagation();
                hidePopover();
            }
        });

        // Hover keeps it open (desktop)
        activePopover.addEventListener('mouseenter', () => {
            clearTimeout(closeTimer);
        });
        activePopover.addEventListener('mouseleave', () => {
            if (window.matchMedia('(min-width: 701px)').matches) {
                closeTimer = setTimeout(hidePopover, 250);
            }
        });

        return activePopover;
    }

    // ---------- POSITION THE POPOVER ----------
    function positionPopover(popover, btn) {
        // Mobile: fixed bottom sheet — CSS handles it
        if (window.matchMedia('(max-width: 700px)').matches) {
            popover.style.top = '';
            popover.style.left = '';
            popover.style.right = '';
            popover.style.bottom = '';
            return;
        }

        // Reset for measurement
        popover.style.top = '0px';
        popover.style.left = '0px';
        popover.style.right = 'auto';
        popover.style.bottom = 'auto';

        const btnRect = btn.getBoundingClientRect();
        const popWidth = popover.offsetWidth;
        const popHeight = popover.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const gutter = 16;
        const gap = 8;

        // ---------- Horizontal placement ----------
        // Prefer aligning popover's right edge with the button's right edge
        let left = btnRect.right - popWidth;

        // If it goes off the left edge, shift right
        if (left < gutter) left = gutter;

        // If it goes off the right edge, shift left
        if (left + popWidth > viewportWidth - gutter) {
            left = viewportWidth - popWidth - gutter;
        }

        // ---------- Vertical placement ----------
        const spaceBelow = viewportHeight - btnRect.bottom - gap;
        const spaceAbove = btnRect.top - gap;

        let top;
        let placement; // 'bottom' or 'top'

        if (spaceBelow >= popHeight || spaceBelow >= spaceAbove) {
            // Place below button
            top = btnRect.bottom + gap;
            placement = 'bottom';

            // If it still overflows the bottom, clamp to viewport
            if (top + popHeight > viewportHeight - gutter) {
                top = viewportHeight - popHeight - gutter;
                // If clamping pushes it above the button, mark as flipped
                if (top < btnRect.top) placement = 'flipped';
            }
        } else {
            // Place above button
            top = btnRect.top - popHeight - gap;
            placement = 'top';

            // If it overflows the top, clamp
            if (top < gutter) top = gutter;
        }

        // Apply position
        popover.style.top = top + 'px';
        popover.style.left = left + 'px';
        popover.style.right = 'auto';
        popover.style.bottom = 'auto';

        // Track placement as data attribute for potential arrow
        popover.dataset.placement = placement;
    }

    // ---------- SHOW / HIDE ----------
    function showPopover(docKey, btn) {
        const popover = getPopover();
        const content = buildPopoverContent(docKey);
        if (!content) return;

        // Update content
        popover.innerHTML = content;

        // Show (must be visible to measure)
        popover.classList.add('show');
        popover.style.visibility = 'hidden';
        popover.style.display = 'block';

        // Force reflow so measurements are accurate
        void popover.offsetHeight;

        // Position
        positionPopover(popover, btn);

        // Reveal
        popover.style.visibility = 'visible';

        // Track state
        if (activeBtn && activeBtn !== btn) {
            activeBtn.classList.remove('active');
            activeBtn.setAttribute('aria-expanded', 'false');
        }
        activeBtn = btn;
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
    }

    function hidePopover() {
        if (!activePopover) return;
        activePopover.classList.remove('show');
        activePopover.style.display = 'none';
        if (activeBtn) {
            activeBtn.classList.remove('active');
            activeBtn.setAttribute('aria-expanded', 'false');
        }
        activeBtn = null;
    }

    // ---------- ATTACH HANDLERS ----------
    const infoButtons = document.querySelectorAll('.info-btn');

    infoButtons.forEach(btn => {
        const docKey = btn.getAttribute('data-doc');
        if (!docKey || !guides[docKey]) return;

        // Desktop: hover
        btn.addEventListener('mouseenter', () => {
            if (window.matchMedia('(min-width: 701px)').matches) {
                clearTimeout(closeTimer);
                showPopover(docKey, btn);
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (window.matchMedia('(min-width: 701px)').matches) {
                closeTimer = setTimeout(hidePopover, 250);
            }
        });

        // Click (mobile + keyboard)
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.classList.contains('active')) {
                hidePopover();
            } else {
                showPopover(docKey, btn);
            }
        });

        // Keyboard
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPopover(docKey, btn);
            }
            if (e.key === 'Escape') {
                hidePopover();
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.info-btn') && !e.target.closest('.doc-popover')) {
            hidePopover();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hidePopover();
    });

    // Reposition on scroll/resize
    window.addEventListener('scroll', () => {
        if (activeBtn && activePopover && activePopover.classList.contains('show')) {
            positionPopover(activePopover, activeBtn);
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (activeBtn && activePopover && activePopover.classList.contains('show')) {
            positionPopover(activePopover, activeBtn);
        }
    });
});

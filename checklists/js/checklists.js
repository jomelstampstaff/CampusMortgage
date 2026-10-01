/* ==========================================================
   Checklists — Checkbox state + progress tracking + print
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');

    // ---------- UPDATE PROGRESS ----------
    function updateProgress() {
        if (!checklistItems.length) return;

        const total = checklistItems.length;
        const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        const percent = Math.round((checked / total) * 100);

        if (progressFill) {
            progressFill.style.width = percent + '%';
        }
        if (progressPercent) {
            progressPercent.textContent = percent + '%';
        }
    }

    // ---------- CHECKBOX HANDLERS ----------
    checklistItems.forEach(checkbox => {
        const item = checkbox.closest('.checklist-item');

        // Sync initial state
        if (checkbox.checked && item) {
            item.classList.add('checked');
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
            updateProgress();
        });

        // Click on label toggles checkbox
        const label = item?.querySelector('label');
        if (label) {
            label.addEventListener('click', (e) => {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
        }
    });

    // ---------- RESET BUTTON ----------
    const resetBtn = document.getElementById('resetChecklist');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!confirm('Reset all checkboxes for this stage?')) return;
            checklistItems.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.closest('.checklist-item').classList.remove('checked');
            });
            updateProgress();
        });
    }

    // ---------- PRINT BUTTON ----------
    const printBtn = document.getElementById('printChecklist');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Expand all popovers so guides print inline
            document.querySelectorAll('.checklist-item').forEach(item => {
                const btn = item.querySelector('.info-btn');
                if (!btn) return;
                const existingPopover = item.querySelector('.doc-popover');
                if (!existingPopover) {
                    btn.click();
                }
                const popover = item.querySelector('.doc-popover');
                if (popover) {
                    popover.classList.add('print-visible');
                }
            });

            window.print();
        });
    }

    // Initial progress calc
    updateProgress();
});

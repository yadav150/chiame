/* ============================================================
   SCRIPT.JS — CV By Chiame 💝
   All interactive functionality for the entire website.
   ============================================================ */

// ---------- Wait for DOM to be fully loaded ----------
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================================
    // 1. HAMBURGER MENU TOGGLE
    // ============================================================
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');

    if (hamburger && navMobile) {
        hamburger.addEventListener('click', function () {
            const isOpen = navMobile.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMobile.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================================
    // 2. FADE-IN ON SCROLL (Intersection Observer)
    // ============================================================
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================================
    // 3. FAQ ACCORDION
    // ============================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            // Close all other open FAQs
            faqQuestions.forEach(other => {
                if (other !== this && other.getAttribute('aria-expanded') === 'true') {
                    other.setAttribute('aria-expanded', 'false');
                }
            });
            this.setAttribute('aria-expanded', !expanded);
        });
    });

    // ============================================================
    // 4. RESUME FORM FUNCTIONALITY
    // ============================================================
    const form = document.getElementById('resume-form');

    if (form) {
        // ---------- 4a. Auto-fill current date in declaration ----------
        const dateField = document.getElementById('date');
        if (dateField) {
            const today = new Date();
            const formatted = today.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            dateField.value = formatted;
        }

        // ---------- 4b. Glass Notification ----------
        const notificationEl = document.getElementById('glass-notification');
        const notifMessage = document.getElementById('notif-message');

        function showNotification(message, type = 'error') {
            if (!notificationEl) return;
            notifMessage.textContent = message;
            notificationEl.className = 'glass-notification show ' + type;
            // Auto-hide after 5 seconds
            clearTimeout(window.notificationTimeout);
            window.notificationTimeout = setTimeout(() => {
                hideNotification();
            }, 5000);
        }

        function hideNotification() {
            if (notificationEl) {
                notificationEl.classList.remove('show');
            }
            clearTimeout(window.notificationTimeout);
        }

        // ---------- 4c. Dynamic Add/Remove for Education ----------
        const eduContainer = document.getElementById('education-container');
        let eduCount = document.querySelectorAll('#education-container .entry-wrapper').length;

        function getEduIndex(entry) {
            const entries = document.querySelectorAll('#education-container .entry-wrapper');
            return Array.from(entries).indexOf(entry) + 1;
        }

        function createEducationEntry(index) {
            const wrapper = document.createElement('div');
            wrapper.className = 'entry-wrapper';
            wrapper.dataset.entry = 'education';
            wrapper.innerHTML = `
                <div class="entry-header">
                    <span class="entry-number">#${index}</span>
                    <button type="button" class="btn-remove remove-education" aria-label="Remove this qualification">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edu_exam_${index}">Examination Name <span class="required">*</span></label>
                        <input type="text" id="edu_exam_${index}" name="edu_exam[]" class="form-control" placeholder="e.g. 10th, 12th, B.Sc." required />
                    </div>
                    <div class="form-group">
                        <label for="edu_board_${index}">Board/University <span class="required">*</span></label>
                        <input type="text" id="edu_board_${index}" name="edu_board[]" class="form-control" placeholder="e.g. CBSE, Mumbai University" required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edu_institution_${index}">Institution <span class="required">*</span></label>
                        <input type="text" id="edu_institution_${index}" name="edu_institution[]" class="form-control" placeholder="School/College name" required />
                    </div>
                    <div class="form-group">
                        <label for="edu_stream_${index}">Stream <span class="required">*</span></label>
                        <input type="text" id="edu_stream_${index}" name="edu_stream[]" class="form-control" placeholder="e.g. Science, Commerce, Arts" required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edu_year_${index}">Year of Passing <span class="required">*</span></label>
                        <input type="number" id="edu_year_${index}" name="edu_year[]" class="form-control" placeholder="e.g. 2020" min="1900" max="2099" required />
                    </div>
                    <div class="form-group">
                        <label for="edu_grade_${index}">Grade / Percentage / CGPA <span class="required">*</span></label>
                        <input type="text" id="edu_grade_${index}" name="edu_grade[]" class="form-control" placeholder="e.g. 85%, 8.5 CGPA" required />
                    </div>
                </div>
                <div class="form-group">
                    <label for="edu_subjects_${index}">Subjects (Optional)</label>
                    <input type="text" id="edu_subjects_${index}" name="edu_subjects[]" class="form-control" placeholder="e.g. Mathematics, Physics, Chemistry" />
                </div>
            `;
            return wrapper;
        }

        // Add Education
        const addEduBtn = document.getElementById('add-education');
        if (addEduBtn) {
            addEduBtn.addEventListener('click', function () {
                const entries = document.querySelectorAll('#education-container .entry-wrapper');
                const newIndex = entries.length + 1;
                const newEntry = createEducationEntry(newIndex);
                eduContainer.appendChild(newEntry);
                // Show remove button on all entries if more than one
                updateRemoveButtonsVisibility('.remove-education');
                // Re-index numbers
                reindexEducationEntries();
                // Attach validation removal
                attachValidationCleanup(newEntry);
            });
        }

        // Remove Education (delegated)
        eduContainer.addEventListener('click', function (e) {
            const removeBtn = e.target.closest('.remove-education');
            if (removeBtn) {
                const entry = removeBtn.closest('.entry-wrapper');
                if (entry) {
                    const entries = document.querySelectorAll('#education-container .entry-wrapper');
                    if (entries.length > 1) {
                        entry.remove();
                        reindexEducationEntries();
                        updateRemoveButtonsVisibility('.remove-education');
                    } else {
                        showNotification('You must have at least one education entry.', 'error');
                    }
                }
            }
        });

        function reindexEducationEntries() {
            const entries = document.querySelectorAll('#education-container .entry-wrapper');
            entries.forEach((entry, idx) => {
                const num = entry.querySelector('.entry-number');
                if (num) num.textContent = '#' + (idx + 1);
                // Update IDs and for attributes inside
                const inputs = entry.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    const oldId = input.id;
                    if (oldId) {
                        const newId = oldId.replace(/_\d+$/, '_' + (idx + 1));
                        input.id = newId;
                        // Update label's for attribute
                        const label = entry.querySelector('label[for="' + oldId + '"]');
                        if (label) label.setAttribute('for', newId);
                    }
                });
            });
        }

        function updateRemoveButtonsVisibility(selector) {
            const entries = document.querySelectorAll('#education-container .entry-wrapper');
            entries.forEach((entry, idx) => {
                const btn = entry.querySelector(selector);
                if (btn) {
                    btn.style.display = entries.length > 1 ? 'inline-flex' : 'none';
                }
            });
        }
        // Initial update
        updateRemoveButtonsVisibility('.remove-education');

        // ---------- 4d. Dynamic Add/Remove for Other Qualifications ----------
        const otherQualContainer = document.getElementById('other-qual-container');
        let otherQualCount = 0;

        function createOtherQualEntry(index) {
            const wrapper = document.createElement('div');
            wrapper.className = 'entry-wrapper';
            wrapper.dataset.entry = 'otherqual';
            wrapper.innerHTML = `
                <div class="entry-header">
                    <span class="entry-number">#${index}</span>
                    <button type="button" class="btn-remove remove-otherqual" aria-label="Remove this certification">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="other_cert_${index}">Certification Name</label>
                        <input type="text" id="other_cert_${index}" name="other_cert[]" class="form-control" placeholder="e.g. AWS Certified" />
                    </div>
                    <div class="form-group">
                        <label for="other_inst_${index}">Institute</label>
                        <input type="text" id="other_inst_${index}" name="other_inst[]" class="form-control" placeholder="e.g. Coursera" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="other_year_${index}">Year</label>
                        <input type="number" id="other_year_${index}" name="other_year[]" class="form-control" placeholder="e.g. 2022" min="1900" max="2099" />
                    </div>
                    <div class="form-group">
                        <label for="other_desc_${index}">Description</label>
                        <textarea id="other_desc_${index}" name="other_desc[]" class="form-control" rows="2" placeholder="Brief description"></textarea>
                    </div>
                </div>
            `;
            return wrapper;
        }

        const addOtherQualBtn = document.getElementById('add-other-qual');
        if (addOtherQualBtn) {
            addOtherQualBtn.addEventListener('click', function () {
                otherQualCount++;
                const newEntry = createOtherQualEntry(otherQualCount);
                otherQualContainer.appendChild(newEntry);
                // Show remove buttons
                otherQualContainer.querySelectorAll('.remove-otherqual').forEach(btn => btn.style.display = 'inline-flex');
                attachValidationCleanup(newEntry);
            });
        }

        otherQualContainer.addEventListener('click', function (e) {
            const removeBtn = e.target.closest('.remove-otherqual');
            if (removeBtn) {
                const entry = removeBtn.closest('.entry-wrapper');
                if (entry) {
                    entry.remove();
                    // Re-index numbers
                    const entries = otherQualContainer.querySelectorAll('.entry-wrapper');
                    entries.forEach((el, idx) => {
                        const num = el.querySelector('.entry-number');
                        if (num) num.textContent = '#' + (idx + 1);
                    });
                }
            }
        });

        // ---------- 4e. Dynamic Add/Remove for Experience ----------
        const expContainer = document.getElementById('experience-container');
        let expCount = 0;

        function createExperienceEntry(index) {
            const wrapper = document.createElement('div');
            wrapper.className = 'entry-wrapper';
            wrapper.dataset.entry = 'experience';
            wrapper.innerHTML = `
                <div class="entry-header">
                    <span class="entry-number">#${index}</span>
                    <button type="button" class="btn-remove remove-experience" aria-label="Remove this experience">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="exp_org_${index}">Organization</label>
                        <input type="text" id="exp_org_${index}" name="exp_org[]" class="form-control" placeholder="e.g. Google" />
                    </div>
                    <div class="form-group">
                        <label for="exp_pos_${index}">Position</label>
                        <input type="text" id="exp_pos_${index}" name="exp_pos[]" class="form-control" placeholder="e.g. Software Engineer" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="exp_duration_${index}">Duration</label>
                        <input type="text" id="exp_duration_${index}" name="exp_duration[]" class="form-control" placeholder="e.g. Jan 2020 - Dec 2022" />
                    </div>
                    <div class="form-group">
                        <label for="exp_resp_${index}">Responsibilities</label>
                        <textarea id="exp_resp_${index}" name="exp_resp[]" class="form-control" rows="2" placeholder="Key responsibilities"></textarea>
                    </div>
                </div>
            `;
            return wrapper;
        }

        const addExpBtn = document.getElementById('add-experience');
        if (addExpBtn) {
            addExpBtn.addEventListener('click', function () {
                expCount++;
                const newEntry = createExperienceEntry(expCount);
                expContainer.appendChild(newEntry);
                expContainer.querySelectorAll('.remove-experience').forEach(btn => btn.style.display = 'inline-flex');
                attachValidationCleanup(newEntry);
            });
        }

        expContainer.addEventListener('click', function (e) {
            const removeBtn = e.target.closest('.remove-experience');
            if (removeBtn) {
                const entry = removeBtn.closest('.entry-wrapper');
                if (entry) {
                    entry.remove();
                    const entries = expContainer.querySelectorAll('.entry-wrapper');
                    entries.forEach((el, idx) => {
                        const num = el.querySelector('.entry-number');
                        if (num) num.textContent = '#' + (idx + 1);
                    });
                }
            }
        });

        // ---------- 4f. Skills & Languages Selection Limit ----------
        const skillsSelect = document.getElementById('skills');
        const languagesSelect = document.getElementById('languages');

        function setupSelectLimit(selectElement, max, fieldName) {
            if (!selectElement) return;
            selectElement.addEventListener('change', function () {
                const selected = Array.from(this.selectedOptions);
                if (selected.length > max) {
                    // Show notification and deselect the last selected
                    showNotification(`You can select a maximum of ${max} ${fieldName}.`, 'error');
                    // Remove the last selected option
                    const last = selected[selected.length - 1];
                    last.selected = false;
                } else {
                    hideNotification();
                }
            });
        }

        setupSelectLimit(skillsSelect, 3, 'skills');
        setupSelectLimit(languagesSelect, 3, 'languages');

        // ---------- 4g. Form Validation ----------
        // Helper to get all required inputs within a container
        function getRequiredInputs(container) {
            return container ? container.querySelectorAll('input[required], select[required], textarea[required]') : [];
        }

        // Remove error class on input/change
        function attachValidationCleanup(container) {
            const inputs = container.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.addEventListener('input', function () {
                    this.classList.remove('error');
                });
                input.addEventListener('change', function () {
                    this.classList.remove('error');
                });
            });
        }

        // Attach to existing fields
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', function () {
                this.classList.remove('error');
            });
            input.addEventListener('change', function () {
                this.classList.remove('error');
            });
        });

        // Validate entire form
        function validateForm() {
            let isValid = true;
            let firstInvalid = null;
            const errorMessages = [];

            // 1. Check all required fields in personal details (within form)
            const personalFields = form.querySelectorAll('fieldset:first-of-type input[required], fieldset:first-of-type select[required]');
            personalFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                    errorMessages.push(`Please fill in "${field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : 'a required field'}"`);
                }
            });

            // 2. Check education entries (all required fields inside each entry)
            const eduEntries = document.querySelectorAll('#education-container .entry-wrapper');
            eduEntries.forEach((entry, idx) => {
                const inputs = entry.querySelectorAll('input[required], select[required]');
                inputs.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                        if (!firstInvalid) firstInvalid = field;
                        const label = entry.querySelector('label[for="' + field.id + '"]');
                        const labelText = label ? label.textContent.replace('*', '').trim() : 'Education field #' + (idx+1);
                        errorMessages.push(`Please fill in "${labelText}" in Education #${idx+1}`);
                    }
                });
            });

            // 3. Skills (must have at least one selected)
            if (skillsSelect) {
                const selectedSkills = Array.from(skillsSelect.selectedOptions);
                if (selectedSkills.length === 0) {
                    skillsSelect.classList.add('error');
                    isValid = false;
                    if (!firstInvalid) firstInvalid = skillsSelect;
                    errorMessages.push('Please select at least one skill.');
                } else {
                    skillsSelect.classList.remove('error');
                }
            }

            // 4. Languages (must have at least one selected)
            if (languagesSelect) {
                const selectedLangs = Array.from(languagesSelect.selectedOptions);
                if (selectedLangs.length === 0) {
                    languagesSelect.classList.add('error');
                    isValid = false;
                    if (!firstInvalid) firstInvalid = languagesSelect;
                    errorMessages.push('Please select at least one language.');
                } else {
                    languagesSelect.classList.remove('error');
                }
            }

            // 5. Photo upload (must have a file)
            const photoInput = document.getElementById('photo');
            if (photoInput && !photoInput.files.length) {
                photoInput.classList.add('error');
                isValid = false;
                if (!firstInvalid) firstInvalid = photoInput;
                errorMessages.push('Please upload a photo.');
            } else if (photoInput) {
                photoInput.classList.remove('error');
            }

            // 6. Declaration place
            const placeInput = document.getElementById('place');
            if (placeInput && !placeInput.value.trim()) {
                placeInput.classList.add('error');
                isValid = false;
                if (!firstInvalid) firstInvalid = placeInput;
                errorMessages.push('Please enter a place for the declaration.');
            } else if (placeInput) {
                placeInput.classList.remove('error');
            }

            // If not valid, show notification with first message
            if (!isValid) {
                const firstMsg = errorMessages.length > 0 ? errorMessages[0] : 'Please fill in all required fields.';
                showNotification(firstMsg, 'error');
                // Scroll to first invalid field
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Focus on the field
                    setTimeout(() => firstInvalid.focus(), 300);
                }
            } else {
                hideNotification();
                // If valid, show success and proceed (preview)
                showNotification('All fields are valid! Generating resume preview...', 'success');
                // Here you would implement actual resume generation (backend phase)
                // For now, just a placeholder.
                setTimeout(() => {
                    hideNotification();
                }, 3000);
            }

            return isValid;
        }

        // Handle Generate Resume button
        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', function (e) {
                e.preventDefault();
                validateForm();
            });
        }

        // ---------- 4h. Reset form (clear errors) ----------
        const resetBtn = form.querySelector('button[type="reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                // Clear error classes
                form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                hideNotification();
                // Reset selects (clear selections) - optional
                if (skillsSelect) {
                    Array.from(skillsSelect.options).forEach(opt => opt.selected = false);
                }
                if (languagesSelect) {
                    Array.from(languagesSelect.options).forEach(opt => opt.selected = false);
                }
                // Reset file input
                if (photoInput) photoInput.value = '';
            });
        }

        // ---------- 4i. Optional: contact form (simple validation) ----------
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const required = this.querySelectorAll('[required]');
                let valid = true;
                let firstError = null;
                required.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('error');
                        valid = false;
                        if (!firstError) firstError = field;
                    } else {
                        field.classList.remove('error');
                    }
                });
                if (!valid) {
                    showNotification('Please fill in all required fields.', 'error');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstError.focus();
                    }
                } else {
                    showNotification('Message sent! (Demo only)', 'success');
                    this.reset();
                    setTimeout(hideNotification, 3000);
                }
            });
        }

    } // end if (form)

    // ============================================================
    // 5. ADDITIONAL: Smooth scroll for anchor links (optional)
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // 6. CLOSE NOTIFICATION ON CLICK (optional)
    // ============================================================
    if (notificationEl) {
        notificationEl.addEventListener('click', function () {
            hideNotification();
        });
    }

}); // end DOMContentLoaded

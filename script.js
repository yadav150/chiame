/* ============================================================
   SCRIPT.JS — CV By Chiame 💝
   All interactive functionality for the entire website.
   ============================================================ */

// ---------- Wait for DOM to be fully loaded ----------
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================================
    // 1. HAMBURGER MENU TOGGLE (FIXED)
    // ============================================================
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    const body = document.body;

    if (hamburger && navMobile) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navMobile.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMobile.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (navMobile.classList.contains('open')) {
                const isClickInside = navMobile.contains(e.target) || hamburger.contains(e.target);
                if (!isClickInside) {
                    navMobile.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                }
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMobile.classList.contains('open')) {
                navMobile.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
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
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================================
    // 3. FAQ ACCORDION
    // ============================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            faqQuestions.forEach(other => {
                if (other !== this && other.getAttribute('aria-expanded') === 'true') {
                    other.setAttribute('aria-expanded', 'false');
                }
            });
            this.setAttribute('aria-expanded', !expanded);
        });
    });

    // ============================================================
    // 4. GLASS NOTIFICATION SYSTEM
    // ============================================================
    const notificationEl = document.getElementById('glass-notification');
    const notifMessage = document.getElementById('notif-message');

    function showNotification(message, type = 'error') {
        if (!notificationEl) return;
        notifMessage.textContent = message;
        notificationEl.className = 'glass-notification show ' + type;
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

    if (notificationEl) {
        notificationEl.addEventListener('click', function () {
            hideNotification();
        });
    }

    // ============================================================
    // 5. RESUME FORM FUNCTIONALITY
    // ============================================================
    const form = document.getElementById('resume-form');

    if (form) {
        // ---------- 5a. Auto-fill current date in declaration ----------
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

        // ---------- 5b. Dynamic Add/Remove for Education ----------
        const eduContainer = document.getElementById('education-container');

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

        const addEduBtn = document.getElementById('add-education');
        if (addEduBtn) {
            addEduBtn.addEventListener('click', function () {
                const entries = document.querySelectorAll('#education-container .entry-wrapper');
                const newIndex = entries.length + 1;
                const newEntry = createEducationEntry(newIndex);
                eduContainer.appendChild(newEntry);
                updateRemoveButtonsVisibility('.remove-education');
                reindexEducationEntries();
                attachValidationCleanup(newEntry);
            });
        }

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
                const inputs = entry.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    const oldId = input.id;
                    if (oldId) {
                        const newId = oldId.replace(/_\d+$/, '_' + (idx + 1));
                        input.id = newId;
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
        updateRemoveButtonsVisibility('.remove-education');

        // ---------- 5c. Dynamic Add/Remove for Other Qualifications ----------
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
                    const entries = otherQualContainer.querySelectorAll('.entry-wrapper');
                    entries.forEach((el, idx) => {
                        const num = el.querySelector('.entry-number');
                        if (num) num.textContent = '#' + (idx + 1);
                    });
                }
            }
        });

        // ---------- 5d. Dynamic Add/Remove for Experience ----------
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

        // ============================================================
        // 6. SKILLS & LANGUAGES — DROPDOWN WITH TAGS + CUSTOM OPTION
        // ============================================================

        // ---------- 6a. Generic Tag Selector ----------
        function initTagSelector(selectId, tagsContainerId, hiddenInputId, maxSelections, fieldName) {
            const select = document.getElementById(selectId);
            const tagsContainer = document.getElementById(tagsContainerId);
            const hiddenInput = document.getElementById(hiddenInputId);
            const customInputId = selectId + '-custom-input';

            if (!select || !tagsContainer || !hiddenInput) return;

            let selectedValues = [];

            // Create custom input field (hidden initially)
            const customInput = document.createElement('input');
            customInput.type = 'text';
            customInput.id = customInputId;
            customInput.className = 'form-control custom-tag-input';
            customInput.placeholder = 'Enter custom ' + fieldName + '...';
            customInput.style.display = 'none';
            customInput.style.marginTop = '8px';
            select.parentNode.insertBefore(customInput, select.nextSibling);

            // Function to update tags display
            function renderTags() {
                tagsContainer.innerHTML = '';
                selectedValues.forEach(value => {
                    const tag = document.createElement('span');
                    tag.className = 'tag-chip';
                    tag.innerHTML = value + ' <i class="fas fa-times tag-remove" data-value="' + value + '"></i>';
                    tagsContainer.appendChild(tag);
                });

                // Update hidden input
                hiddenInput.value = selectedValues.join(',');

                // Show/hide select based on max
                if (selectedValues.length >= maxSelections) {
                    select.style.display = 'none';
                    if (customInput.style.display !== 'block') {
                        customInput.style.display = 'none';
                    }
                } else {
                    select.style.display = 'block';
                    // Reset select to placeholder
                    select.value = '';
                }

                // Update helper text
                const helper = select.closest('.select-tag-group').querySelector('.helper');
                if (helper) {
                    const remaining = maxSelections - selectedValues.length;
                    helper.textContent = remaining + ' of ' + maxSelections + ' ' + fieldName + ' remaining. Select from dropdown or choose "Custom" to enter your own.';
                }
            }

            // Add tag from select option
            function addTag(value) {
                if (!value || value === '' || value === '__custom__') return;
                if (selectedValues.includes(value)) {
                    showNotification('"' + value + '" is already selected.', 'error');
                    return;
                }
                if (selectedValues.length >= maxSelections) {
                    showNotification('You can select a maximum of ' + maxSelections + ' ' + fieldName + '.', 'error');
                    return;
                }
                selectedValues.push(value);
                renderTags();
                hideNotification();
            }

            // Remove tag
            function removeTag(value) {
                selectedValues = selectedValues.filter(v => v !== value);
                renderTags();
            }

            // Handle select change
            select.addEventListener('change', function () {
                const value = this.value;
                if (value === '__custom__') {
                    // Show custom input
                    customInput.style.display = 'block';
                    customInput.focus();
                    this.value = '';
                } else if (value !== '') {
                    addTag(value);
                    this.value = '';
                }
            });

            // Handle custom input
            customInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = this.value.trim();
                    if (val !== '') {
                        addTag(val);
                        this.value = '';
                        this.style.display = 'none';
                    }
                }
                if (e.key === 'Escape') {
                    this.value = '';
                    this.style.display = 'none';
                }
            });

            customInput.addEventListener('blur', function () {
                const val = this.value.trim();
                if (val !== '') {
                    addTag(val);
                    this.value = '';
                }
                this.style.display = 'none';
            });

            // Handle tag removal (delegated)
            tagsContainer.addEventListener('click', function (e) {
                const removeBtn = e.target.closest('.tag-remove');
                if (removeBtn) {
                    const value = removeBtn.dataset.value;
                    if (value) {
                        removeTag(value);
                        // Show select again if needed
                        if (selectedValues.length < maxSelections) {
                            select.style.display = 'block';
                        }
                    }
                }
            });

            // Initial render
            renderTags();

            // Return API for external use
            return {
                getSelected: () => [...selectedValues],
                addTag: addTag,
                removeTag: removeTag,
                reset: function () {
                    selectedValues = [];
                    renderTags();
                    select.style.display = 'block';
                    customInput.style.display = 'none';
                    customInput.value = '';
                }
            };
        }

        // ---------- 6b. Initialize Skills ----------
        const skillsSelector = initTagSelector(
            'skills-select',
            'skills-tags',
            'skills-hidden',
            3,
            'skills'
        );

        // ---------- 6c. Initialize Languages ----------
        const languagesSelector = initTagSelector(
            'languages-select',
            'languages-tags',
            'languages-hidden',
            3,
            'languages'
        );

        // ---------- 6d. Attach validation cleanup to new entries ----------
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

        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', function () {
                this.classList.remove('error');
            });
            input.addEventListener('change', function () {
                this.classList.remove('error');
            });
        });

        // ============================================================
        // 7. FORM VALIDATION
        // ============================================================

        function getRequiredInputs(container) {
            return container ? container.querySelectorAll('input[required], select[required], textarea[required]') : [];
        }

        function validateForm() {
            let isValid = true;
            let firstInvalid = null;
            const errorMessages = [];

            // 1. Personal details
            const personalFields = form.querySelectorAll('fieldset:first-of-type input[required], fieldset:first-of-type select[required]');
            personalFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                    const label = field.closest('.form-group')?.querySelector('label');
                    const labelText = label ? label.textContent.replace('*', '').trim() : 'a required field';
                    errorMessages.push('Please fill in "' + labelText + '"');
                }
            });

            // 2. Education entries
            const eduEntries = document.querySelectorAll('#education-container .entry-wrapper');
            eduEntries.forEach((entry, idx) => {
                const inputs = entry.querySelectorAll('input[required], select[required]');
                inputs.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                        if (!firstInvalid) firstInvalid = field;
                        const label = entry.querySelector('label[for="' + field.id + '"]');
                        const labelText = label ? label.textContent.replace('*', '').trim() : 'Education field #' + (idx + 1);
                        errorMessages.push('Please fill in "' + labelText + '" in Education #' + (idx + 1));
                    }
                });
            });

            // 3. Skills (must have at least one)
            const skillsHidden = document.getElementById('skills-hidden');
            if (skillsHidden && !skillsHidden.value.trim()) {
                const skillsSelect = document.getElementById('skills-select');
                if (skillsSelect) skillsSelect.classList.add('error');
                isValid = false;
                if (!firstInvalid) firstInvalid = document.getElementById('skills-select');
                errorMessages.push('Please select at least one skill.');
            } else {
                const skillsSelect = document.getElementById('skills-select');
                if (skillsSelect) skillsSelect.classList.remove('error');
            }

            // 4. Languages (must have at least one)
            const languagesHidden = document.getElementById('languages-hidden');
            if (languagesHidden && !languagesHidden.value.trim()) {
                const languagesSelect = document.getElementById('languages-select');
                if (languagesSelect) languagesSelect.classList.add('error');
                isValid = false;
                if (!firstInvalid) firstInvalid = document.getElementById('languages-select');
                errorMessages.push('Please select at least one language.');
            } else {
                const languagesSelect = document.getElementById('languages-select');
                if (languagesSelect) languagesSelect.classList.remove('error');
            }

            // 5. Photo upload
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

            if (!isValid) {
                const firstMsg = errorMessages.length > 0 ? errorMessages[0] : 'Please fill in all required fields.';
                showNotification(firstMsg, 'error');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => firstInvalid.focus(), 300);
                }
            } else {
                hideNotification();
                showNotification('All fields are valid! Generating resume preview...', 'success');
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

        // ---------- 7a. Reset form ----------
        const resetBtn = form.querySelector('button[type="reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                hideNotification();
                if (skillsSelector) skillsSelector.reset();
                if (languagesSelector) languagesSelector.reset();
                const photoInput = document.getElementById('photo');
                if (photoInput) photoInput.value = '';
                const placeInput = document.getElementById('place');
                if (placeInput) placeInput.value = '';
                // Reset selects
                document.querySelectorAll('select.form-control').forEach(sel => {
                    sel.value = '';
                });
            });
        }

        // ---------- 7b. Contact form ----------
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
    // 8. SMOOTH SCROLL FOR ANCHOR LINKS
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

}); // end DOMContentLoaded

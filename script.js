document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing script.");

    // Selectors for forms and popup
    const dailyForm = document.getElementById('daily-report-form');
    const weeklyForm = document.getElementById('weekly-report-form');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // Selectors for reset buttons
    const resetDailyFormBtn = document.getElementById('resetDailyFormBtn');
    const resetWeeklyFormBtn = document.getElementById('resetWeeklyFormBtn');

    // Selectors for weekly plan specific elements
    const weeklyPlanEntriesContainer = document.getElementById('weeklyPlanEntries');
    const addDayPlanBtn = document.getElementById('addDayPlanBtn');

    // Verify if elements are found
    console.log("Daily Form found:", !!dailyForm);
    console.log("Weekly Form found:", !!weeklyForm);
    console.log("Confirmation Popup found:", !!confirmationPopup);
    console.log("Close Popup Button found:", !!closePopupBtn);
    console.log("Reset Daily Button found:", !!resetDailyFormBtn);
    console.log("Reset Weekly Button found:", !!resetWeeklyFormBtn);
    console.log("Weekly Plan Entries Container found:", !!weeklyPlanEntriesContainer);
    console.log("Add Day Plan Button found:", !!addDayPlanBtn);


    // --- Pop-up Functions ---
    function showConfirmationPopup() {
        console.log("Attempting to show confirmation popup...");
        if (confirmationPopup) {
            confirmationPopup.classList.add('show');
            console.log("Class 'show' added to confirmationPopup.");
        } else {
            console.error("Error: confirmationPopup element not found when trying to show.");
        }
    }

    function hideConfirmationPopup() {
        console.log("Attempting to hide confirmation popup...");
        if (confirmationPopup) {
            confirmationPopup.classList.remove('show');
            console.log("Class 'show' removed from confirmationPopup.");
        } else {
            console.error("Error: confirmationPopup element not found when trying to hide.");
        }
    }


    // --- Form Submission Handlers ---
    function handleFormSubmission(form) {
        return (event) => {
            console.log(`Form submitted: ${form.id}`);
            // Do NOT preventDefault() here, as we want the form to submit to Google Forms
            showConfirmationPopup();
            // Reset the form after a short delay to allow submission to start
            setTimeout(() => {
                form.reset(); // Native form reset
                if (form.id === 'weekly-report-form') {
                    // Re-initialize weekly plan entries to only Day 1
                    initializeWeeklyPlanEntries();
                }
                console.log(`Form reset: ${form.id}`);
            }, 1000); // Reset after 1 second
        };
    }

    if (dailyForm) {
        dailyForm.addEventListener('submit', handleFormSubmission(dailyForm));
    }

    if (weeklyForm) {
        weeklyForm.addEventListener('submit', handleFormSubmission(weeklyForm));
    }


    // --- Reset Button Handlers ---
    if (resetDailyFormBtn && dailyForm) {
        resetDailyFormBtn.addEventListener('click', () => {
            dailyForm.reset();
            console.log("Daily Form explicitly reset by button.");
        });
    }

    if (resetWeeklyFormBtn && weeklyForm) {
        resetWeeklyFormBtn.addEventListener('click', () => {
            weeklyForm.reset();
            initializeWeeklyPlanEntries(); // Also reset dynamic fields
            console.log("Weekly Form explicitly reset by button, dynamic fields re-initialized.");
        });
    }


    // --- Weekly Plan Dynamic Fields Logic ---
    let dayCounter = 1; // Start from 1, Day 1 is already in HTML

    function createDayPlanEntry(dayNum, isRemovable = true) {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('day-plan-entry');
        entryDiv.dataset.dayIndex = dayNum; // Use data attribute to store day number

        entryDiv.innerHTML = `
            <h3>Day ${dayNum} Plan</h3>
            <label>Date for Day ${dayNum}:</label>
            <div class="date-inputs">
                <div>
                    <label for="date_day_${dayNum}">Day:</label>
                    <input type="number" id="date_day_${dayNum}" name="entry.DAY${dayNum}_DATE_DAY_ID" placeholder="DD" min="1" max="31" required>
                </div>
                
                <div>
                    <label for="date_month_${dayNum}">Month:</label>
                    <input type="number" id="date_month_${dayNum}" name="entry.DAY${dayNum}_DATE_MONTH_ID" placeholder="MM" min="1" max="12" required>
                </div>
                
                <div>
                    <label for="date_year_${dayNum}">Year:</label>
                    <input type="number" id="date_year_${dayNum}" name="entry.DAY${dayNum}_DATE_YEAR_ID" placeholder="YYYY" min="1900" max="2100" required>
                </div>
            </div>
            <label for="plan_day_${dayNum}">Plan for Day ${dayNum}:</label>
            <textarea id="plan_day_${dayNum}" name="entry.PLAN_DAY${dayNum}_ID" rows="5" required></textarea>
            ${isRemovable ? `<button type="button" class="remove-day-btn">Remove Day ${dayNum}</button>` : ''}
        `;

        if (isRemovable) {
            const removeBtn = entryDiv.querySelector('.remove-day-btn');
            removeBtn.addEventListener('click', () => {
                entryDiv.remove();
                // Re-index remaining entries for consistent numbering in UI if needed
                updateDayEntryNumbers();
            });
        }
        return entryDiv;
    }

    function updateDayEntryNumbers() {
        const entries = weeklyPlanEntriesContainer.querySelectorAll('.day-plan-entry');
        let currentDayNum = 1;
        entries.forEach(entry => {
            entry.dataset.dayIndex = currentDayNum;
            entry.querySelector('h3').textContent = `Day ${currentDayNum} Plan`;
            // Update labels and input IDs/names
            const labels = entry.querySelectorAll('label');
            const inputs = entry.querySelectorAll('input, textarea');
            
            labels.forEach(label => {
                const forAttr = label.getAttribute('for');
                if (forAttr && forAttr.startsWith('date_day_')) label.setAttribute('for', `date_day_${currentDayNum}`);
                if (forAttr && forAttr.startsWith('date_month_')) label.setAttribute('for', `date_month_${currentDayNum}`);
                if (forAttr && forAttr.startsWith('date_year_')) label.setAttribute('for', `date_year_${currentDayNum}`);
                if (forAttr && forAttr.startsWith('plan_day_')) label.setAttribute('for', `plan_day_${currentDayNum}`);
            });

            inputs.forEach(input => {
                const idAttr = input.getAttribute('id');
                const nameAttr = input.getAttribute('name');

                if (idAttr && idAttr.startsWith('date_day_')) input.setAttribute('id', `date_day_${currentDayNum}`);
                if (idAttr && idAttr.startsWith('date_month_')) input.setAttribute('id', `date_month_${currentDayNum}`);
                if (idAttr && idAttr.startsWith('date_year_')) input.setAttribute('id', `date_year_${currentDayNum}`);
                if (idAttr && idAttr.startsWith('plan_day_')) input.setAttribute('id', `plan_day_${currentDayNum}`);

                // IMPORTANT: You MUST replace these placeholder IDs with your actual Google Form entry IDs
                // For example: name="entry.ACTUAL_GOOGLE_FORM_ID_FOR_DAY_N_DATE_DAY"
                if (nameAttr && nameAttr.includes('_DATE_DAY_ID')) input.setAttribute('name', `entry.DAY${currentDayNum}_DATE_DAY_ID`);
                if (nameAttr && nameAttr.includes('_DATE_MONTH_ID')) input.setAttribute('name', `entry.DAY${currentDayNum}_DATE_MONTH_ID`);
                if (nameAttr && nameAttr.includes('_DATE_YEAR_ID')) input.setAttribute('name', `entry.DAY${currentDayNum}_DATE_YEAR_ID`);
                if (nameAttr && nameAttr.includes('_PLAN_ID')) input.setAttribute('name', `entry.PLAN_DAY${currentDayNum}_ID`);
            });

            const removeBtn = entry.querySelector('.remove-day-btn');
            if (removeBtn) {
                removeBtn.textContent = `Remove Day ${currentDayNum}`;
            }
            currentDayNum++;
        });
        dayCounter = currentDayNum; // Update global counter
    }


    function initializeWeeklyPlanEntries() {
        if (weeklyPlanEntriesContainer) {
            // Clear all existing entries
            weeklyPlanEntriesContainer.innerHTML = '';
            dayCounter = 1; // Reset counter

            // Add the initial Day 1 entry
            const initialEntry = createDayPlanEntry(dayCounter, false); // Day 1 is not removable
            weeklyPlanEntriesContainer.appendChild(initialEntry);
            dayCounter++; // Increment for the next day to be added
        }
    }

    if (addDayPlanBtn && weeklyPlanEntriesContainer) {
        addDayPlanBtn.addEventListener('click', () => {
            const newEntry = createDayPlanEntry(dayCounter, true); // New entries are removable
            weeklyPlanEntriesContainer.appendChild(newEntry);
            dayCounter++;
        });
    }

    // Initialize weekly plan entries on page load (only if it's the weekly form page)
    if (weeklyForm) {
        initializeWeeklyPlanEntries();
    }


    // --- Close Pop-up Button Listener ---
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hideConfirmationPopup);
    }

    // Close popup if clicked outside content
    if (confirmationPopup) {
        confirmationPopup.addEventListener('click', (event) => {
            if (event.target === confirmationPopup) {
                hideConfirmationPopup();
            }
        });
    }
});

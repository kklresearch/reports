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

    // Verify if elements are found (for debugging purposes)
    console.log("Daily Form found:", !!dailyForm);
    console.log("Weekly Form found:", !!weeklyForm);
    console.log("Confirmation Popup found:", !!confirmationPopup);
    console.log("Close Popup Button found:", !!closePopupBtn);
    console.log("Reset Daily Button found:", !!resetDailyFormBtn);
    console.log("Reset Weekly Button found:", !!resetWeeklyFormBtn);


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
            console.log("Weekly Form explicitly reset by button.");
        });
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

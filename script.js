document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing script.");

    // Selectors for forms and popup
    const dailyForm = document.getElementById('daily-report-form');
    const weeklyForm = document.getElementById('weekly-report-form');
    const grnForm = document.getElementById('grn-form'); // Selector for GRN form

    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // Selectors for reset buttons
    const resetDailyFormBtn = document.getElementById('resetDailyFormBtn');
    const resetWeeklyFormBtn = document.getElementById('resetWeeklyFormBtn');
    const resetGrnFormBtn = document.getElementById('resetGrnFormBtn'); // Selector for GRN reset button

    // Selectors for hidden iframes (MUST correspond to the 'target' attribute in your HTML forms)
    // IMPORTANT: You will need to add these iframes to daily.html and weekly.html
    const dailyFormIframe = document.querySelector('iframe[name="daily-form-iframe"]'); 
    const weeklyFormIframe = document.querySelector('iframe[name="weekly-form-iframe"]');
    const grnFormIframe = document.querySelector('iframe[name="google-form-iframe"]'); // This is the GRN iframe

    // Verify if elements are found (for debugging purposes)
    console.log("Daily Form found:", !!dailyForm);
    console.log("Weekly Form found:", !!weeklyForm);
    console.log("GRN Form found:", !!grnForm);
    console.log("Confirmation Popup found:", !!confirmationPopup);
    console.log("Close Popup Button found:", !!closePopupBtn);
    console.log("Reset Daily Button found:", !!resetDailyFormBtn);
    console.log("Reset Weekly Button found:", !!resetWeeklyFormBtn);
    console.log("Reset GRN Button found:", !!resetGrnFormBtn);
    console.log("Daily Form Iframe found:", !!dailyFormIframe);
    console.log("Weekly Form Iframe found:", !!weeklyFormIframe);
    console.log("GRN Form Iframe found:", !!grnFormIframe);


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

    // --- Universal Form Submission Handler for Hidden Iframe Method ---
    // This function will be used by ALL forms that submit to Google Forms via an iframe.
    function handleIframeFormSubmission(formElement, iframeElement) {
        return (event) => {
            console.log(`Form submitted: ${formElement.id}`);
            // DO NOT preventDefault() here, as we want the form to submit naturally to the iframe.

            if (!iframeElement) {
                console.error(`Error: Iframe for ${formElement.id} not found. Cannot confirm submission via iframe.`);
                // Fallback: show popup and reset immediately, but actual Google Form submission might not occur
                showConfirmationPopup();
                setTimeout(() => {
                    formElement.reset();
                    console.log(`Form reset: ${formElement.id} (fallback)`);
                }, 1000);
                return; // Exit if no iframe
            }

            // Set the iframe's onload handler to trigger after the Google Form response loads.
            // Use a small timeout to ensure the form submission has initiated before we set the onload.
            setTimeout(() => {
                iframeElement.onload = function() {
                    console.log(`Iframe loaded for ${formElement.id}. Showing popup.`);
                    showConfirmationPopup();
                    formElement.reset(); // Reset the form after confirmation is shown
                    console.log(`Form reset: ${formElement.id}`);
                    iframeElement.onload = null; // Clear the onload handler to prevent re-triggering
                    iframeElement.src = 'about:blank'; // Clear iframe content
                };
            }, 50); // Small delay
        };
    }

    // --- Apply Event Listeners to Forms ---
    if (dailyForm) {
        dailyForm.addEventListener('submit', handleIframeFormSubmission(dailyForm, dailyFormIframe));
    }

    if (weeklyForm) {
        weeklyForm.addEventListener('submit', handleIframeFormSubmission(weeklyForm, weeklyFormIframe));
    }

    if (grnForm) {
        grnForm.addEventListener('submit', handleIframeFormSubmission(grnForm, grnFormIframe));
    }


    // --- Reset Button Handlers ---
    function handleResetButtonClick(formElement, iframeElement = null) {
        return () => {
            formElement.reset();
            console.log(`${formElement.id} explicitly reset by button.`);
            if (iframeElement) {
                iframeElement.src = 'about:blank'; // Clear iframe src on manual reset
                iframeElement.onload = null; // Clear onload listener
            }
        };
    }

    if (resetDailyFormBtn && dailyForm) {
        resetDailyFormBtn.addEventListener('click', handleResetButtonClick(dailyForm, dailyFormIframe));
    }

    if (resetWeeklyFormBtn && weeklyForm) {
        resetWeeklyFormBtn.addEventListener('click', handleResetButtonClick(weeklyForm, weeklyFormIframe));
    }

    if (resetGrnFormBtn && grnForm) {
        resetGrnFormBtn.addEventListener('click', handleResetButtonClick(grnForm, grnFormIframe));
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

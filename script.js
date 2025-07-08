document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing script.");

    // Selectors for forms and popup
    const dailyForm = document.getElementById('daily-report-form');
    const weeklyForm = document.getElementById('weekly-report-form');
    const grnForm = document.getElementById('grn-form'); // Selector for GRN form
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const googleFormIframe = document.querySelector('iframe[name="google-form-iframe"]'); // Selector for the iframe

    // Selectors for reset buttons
    const resetDailyFormBtn = document.getElementById('resetDailyFormBtn');
    const resetWeeklyFormBtn = document.getElementById('resetWeeklyFormBtn');
    const resetGrnFormBtn = document.getElementById('resetGrnFormBtn'); // Selector for GRN reset button

    // Verify if elements are found (for debugging purposes)
    console.log("Daily Form found:", !!dailyForm);
    console.log("Weekly Form found:", !!weeklyForm);
    console.log("GRN Form found:", !!grnForm);
    console.log("Confirmation Popup found:", !!confirmationPopup);
    console.log("Close Popup Button found:", !!closePopupBtn);
    console.log("Reset Daily Button found:", !!resetDailyFormBtn);
    console.log("Reset Weekly Button found:", !!resetWeeklyFormBtn);
    console.log("Reset GRN Button found:", !!resetGrnFormBtn);
    console.log("Google Form Iframe found:", !!googleFormIframe); // Log iframe

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
    // This function now specifically handles forms intended for iframe submission (like GRN)
    function handleIframeFormSubmission(form, iframe) {
        return (event) => {
            console.log(`Form submitted: ${form.id}`);
            // No preventDefault() here, allow the form to submit to the iframe

            // Set the iframe's onload handler to trigger after the Google Form response loads
            // Use a timeout to ensure the form submission has initiated before setting onload
            setTimeout(() => {
                iframe.onload = function() {
                    console.log(`Iframe loaded for ${form.id}. Showing popup.`);
                    showConfirmationPopup();
                    form.reset(); // Reset the form after confirmation is shown
                    console.log(`Form reset: ${form.id}`);
                    iframe.onload = null; // Clear the onload handler to prevent re-triggering
                    // Optional: You might also want to clear the iframe's src to prevent re-submission on refresh
                    iframe.src = 'about:blank'; 
                };
            }, 50); // Small delay to ensure form action is taken by browser
        };
    }

    // This function handles forms that DO NOT use the iframe submission (if any, like if they use fetch/XMLHttpRequest)
    // For now, GRN is the only one explicitly using iframe, so other forms will need review if they are also meant for GForms.
    function handleDirectFormSubmission(form) {
        return (event) => {
            event.preventDefault(); // Prevent default submission if not using iframe trick
            console.log(`Direct form submitted: ${form.id} (no iframe assumed for this one)`);
            // Here you would typically have your fetch() or XMLHttpRequest to an Apps Script or other backend
            // For now, we just show the popup and reset
            showConfirmationPopup();
            setTimeout(() => {
                form.reset();
                console.log(`Form reset: ${form.id}`);
            }, 1000);
        };
    }

    if (dailyForm) {
        // Assuming dailyForm is NOT using the iframe method for now.
        // If it *is* meant to submit to GForms via iframe, change this to handleIframeFormSubmission
        dailyForm.addEventListener('submit', handleDirectFormSubmission(dailyForm));
    }

    if (weeklyForm) {
        // Assuming weeklyForm is NOT using the iframe method for now.
        // If it *is* meant to submit to GForms via iframe, change this to handleIframeFormSubmission
        weeklyForm.addEventListener('submit', handleDirectFormSubmission(weeklyForm));
    }

    if (grnForm && googleFormIframe) { // Ensure both are found
        grnForm.addEventListener('submit', handleIframeFormSubmission(grnForm, googleFormIframe));
    } else if (grnForm) {
        console.error("GRN Form found but Google Form Iframe not found. GRN submission may not work as expected.");
        // Fallback for GRN if iframe isn't found, though it won't actually submit to GForms
        grnForm.addEventListener('submit', handleDirectFormSubmission(grnForm));
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

    if (resetGrnFormBtn && grnForm) {
        resetGrnFormBtn.addEventListener('click', () => {
            grnForm.reset();
            console.log("GRN Form explicitly reset by button.");
            if (googleFormIframe) {
                // Also clear iframe src if reset button is used, to prevent accidental re-submission
                googleFormIframe.src = 'about:blank';
                googleFormIframe.onload = null; // Clear onload listener
            }
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

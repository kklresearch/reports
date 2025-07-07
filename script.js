document.addEventListener('DOMContentLoaded', () => {
    const dailyForm = document.getElementById('daily-report-form');
    const weeklyForm = document.getElementById('weekly-report-form');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // Function to show the confirmation pop-up
    function showConfirmationPopup() {
        if (confirmationPopup) {
            confirmationPopup.classList.add('show');
            // Hide the popup automatically after a few seconds (optional)
            // setTimeout(() => {
            //     hideConfirmationPopup();
            // }, 5000); // Hide after 5 seconds
        }
    }

    // Function to hide the confirmation pop-up
    function hideConfirmationPopup() {
        if (confirmationPopup) {
            confirmationPopup.classList.remove('show');
        }
    }

    // Function to reset the form fields
    function resetForm(form) {
        if (form) {
            form.reset(); // Native form reset method
        }
    }

    // Add event listeners for form submission
    if (dailyForm) {
        dailyForm.addEventListener('submit', (event) => {
            // Do NOT preventDefault() here, as we want the form to submit to Google Forms
            showConfirmationPopup();
            // Reset the form after a short delay to allow submission to start
            // This is an assumption that submission will succeed.
            setTimeout(() => {
                resetForm(dailyForm);
            }, 1000); // Reset after 1 second
        });
    }

    if (weeklyForm) {
        weeklyForm.addEventListener('submit', (event) => {
            // Do NOT preventDefault() here, as we want the form to submit to Google Forms
            showConfirmationPopup();
            // Reset the form after a short delay to allow submission to start
            setTimeout(() => {
                resetForm(weeklyForm);
            }, 1000); // Reset after 1 second
        });
    }

    // Add event listener for the close button on the pop-up
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hideConfirmationPopup);
    }

    // Optional: Close popup if clicked outside content
    if (confirmationPopup) {
        confirmationPopup.addEventListener('click', (event) => {
            if (event.target === confirmationPopup) {
                hideConfirmationPopup();
            }
        });
    }
});

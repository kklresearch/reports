document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing script.");

    const dailyForm = document.getElementById('daily-report-form');
    const weeklyForm = document.getElementById('weekly-report-form');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // Verify if elements are found
    console.log("Daily Form found:", !!dailyForm);
    console.log("Weekly Form found:", !!weeklyForm);
    console.log("Confirmation Popup found:", !!confirmationPopup);
    console.log("Close Popup Button found:", !!closePopupBtn);

    // Function to show the confirmation pop-up
    function showConfirmationPopup() {
        console.log("Attempting to show confirmation popup...");
        if (confirmationPopup) {
            confirmationPopup.classList.add('show');
            console.log("Class 'show' added to confirmationPopup.");
            // Optional: check computed style after adding class
            // console.log("Computed display after 'show':", window.getComputedStyle(confirmationPopup).display);
            // console.log("Computed opacity after 'show':", window.getComputedStyle(confirmationPopup).opacity);
        } else {
            console.error("Error: confirmationPopup element not found when trying to show.");
        }
    }

    // Function to hide the confirmation pop-up
    function hideConfirmationPopup() {
        console.log("Attempting to hide confirmation popup...");
        if (confirmationPopup) {
            confirmationPopup.classList.remove('show');
            console.log("Class 'show' removed from confirmationPopup.");
        } else {
            console.error("Error: confirmationPopup element not found when trying to hide.");
        }
    }

    // Function to reset the form fields
    function resetForm(form) {
        if (form) {
            form.reset();
            console.log("Form reset:", form.id);
        }
    }

    // Add event listeners for form submission
    if (dailyForm) {
        dailyForm.addEventListener('submit', (event) => {
            console.log("Daily form submitted!");
            // Do NOT preventDefault() here, as we want the form to submit to Google Forms
            showConfirmationPopup();
            // Reset the form after a short delay to allow submission to start
            setTimeout(() => {
                resetForm(dailyForm);
            }, 1000); // Reset after 1 second
        });
    }

    if (weeklyForm) {
        weeklyForm.addEventListener('submit', (event) => {
            console.log("Weekly form submitted!");
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
    } else {
        console.error("Error: closePopupBtn element not found.");
    }

    // Optional: Close popup if clicked outside content
    if (confirmationPopup) {
        confirmationPopup.addEventListener('click', (event) => {
            if (event.target === confirmationPopup) { // Only close if clicking on the overlay, not the content
                hideConfirmationPopup();
            }
        });
    }
});

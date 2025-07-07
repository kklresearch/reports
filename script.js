document.addEventListener('DOMContentLoaded', function () {
  // The URL for the Google Apps Script Web App.
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzuRBzB623VKPE4IUmIdG9EhiFP0UOjfQqKKQ7jY5sEStSAPqSQq4oOVF2JTNQCQTAJ/exec';

  // Get references to common elements
  const dailyForm = document.getElementById('daily-form');
  const weeklyForm = document.getElementById('weekly-form');
  const modal = document.getElementById('responseModal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // --- MODAL DIALOG LOGIC ---
  // Function to display the success/error dialog
  function showModal(title, message, isError = false) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalCloseBtn.className = 'modal-close-btn'; // Reset class
    if (isError) {
      modalCloseBtn.classList.add('error');
    }
    modal.style.display = 'flex';
  }

  // Event listener to close the modal
  modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  // Also close modal if user clicks outside of it
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });


  // --- DAILY REPORT PAGE LOGIC ---
  if (dailyForm) {
    // Set default date to today for the daily form
    document.getElementById('date').valueAsDate = new Date();

    dailyForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const formData = new FormData(dailyForm);
      const data = {
        formType: 'daily',
        employeeId: formData.get('employeeId'),
        date: formData.get('date'),
        workDone: formData.get('workDone')
      };

      // Send the data to the Google Apps Script
      fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
      })
      .then(res => res.json())
      .then(response => {
        if (response.result === 'success') {
          showModal('Success!', response.message);
          dailyForm.reset();
          document.getElementById('date').valueAsDate = new Date(); // Reset date after submission
        } else {
          throw new Error(response.message || 'An unknown error occurred.');
        }
      })
      .catch(error => {
        showModal('Submission Error', `An error occurred: ${error.message}. Please try again.`, true);
      })
      .finally(() => {
        // Re-enable the submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Report';
      });
    });
  }


  // --- WEEKLY PLAN PAGE LOGIC ---
  if (weeklyForm) {
    const planEntriesContainer = document.getElementById('plan-entries-container');
    const addDayBtn = document.getElementById('add-day-btn');
    let entryCount = 0;

    // Function to add a new day's plan entry to the form
    const addPlanEntry = () => {
      entryCount++;
      const entryDiv = document.createElement('div');
      entryDiv.className = 'plan-entry';
      entryDiv.id = `entry-${entryCount}`;
      entryDiv.innerHTML = `
        <button type="button" class="delete-btn" title="Delete this entry">×</button>
        <div class="form-group">
          <label for="date-${entryCount}">Date</label>
          <input type="date" id="date-${entryCount}" class="plan-date" required>
        </div>
        <div class="form-group">
          <label for="plan-${entryCount}">Plan for this day</label>
          <textarea id="plan-${entryCount}" class="plan-text" rows="3" required></textarea>
        </div>
      `;
      planEntriesContainer.appendChild(entryDiv);
    };

    // Add the first entry automatically when the page loads
    addPlanEntry();

    // Event listener for the "Add Day" button
    addDayBtn.addEventListener('click', addPlanEntry);

    // Event listener to handle deleting an entry
    planEntriesContainer.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('delete-btn')) {
        // Prevent deleting the very last entry
        if (planEntriesContainer.childElementCount > 1) {
          e.target.closest('.plan-entry').remove();
        } else {
          showModal('Action Denied', 'You cannot delete the last plan entry. Add another one first if you wish to change this one.', true);
        }
      }
    });

    // Event listener for the main form submission
    weeklyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const employeeId = document.getElementById('employeeId').value;
        if (!employeeId) {
            showModal('Error!', 'Please enter your Employee ID.', true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Full Plan';
            return;
        }

        const planEntries = [];
        const entryDivs = planEntriesContainer.querySelectorAll('.plan-entry');

        let allValid = true;
        entryDivs.forEach(div => {
            const date = div.querySelector('.plan-date').value;
            const plan = div.querySelector('.plan-text').value;
            if (date && plan) {
                planEntries.push({ date, plan });
            } else {
                allValid = false;
            }
        });

        if (!allValid) {
            showModal('Error!', 'Please fill out all date and plan fields for each entry.', true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Full Plan';
            return;
        }

        const data = {
            formType: 'weekly',
            employeeId: employeeId,
            plans: planEntries
        };

        // Send the data to Google Apps Script
        fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(response => {
            if (response.result === 'success') {
                showModal('Success!', response.message);
                weeklyForm.reset();
                planEntriesContainer.innerHTML = ''; // Clear all entries
                addPlanEntry(); // Add back one fresh entry
            } else {
                throw new Error(response.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            showModal('Submission Error', `An error occurred: ${error.message}. Please try again.`, true);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Full Plan';
        });
    });
  }
});

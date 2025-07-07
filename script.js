document.addEventListener('DOMContentLoaded', function () {
  // !!! IMPORTANT !!!
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzuRBzB623VKPE4IUmIdG9EhiFP0UOjfQqKKQ7jY5sEStSAPqSQq4oOVF2JTNQCQTAJ/exec';

  const dailyForm = document.getElementById('daily-form');
  const weeklyForm = document.getElementById('weekly-form');
  const modal = document.getElementById('responseModal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // --- MODAL DIALOG LOGIC ---
  function showModal(title, message, isError = false) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalCloseBtn.className = 'modal-close-btn'; // Reset class
    if (isError) {
      modalCloseBtn.classList.add('error');
    }
    modal.style.display = 'flex';
  }

  modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });


  // --- DAILY REPORT LOGIC ---
  if (dailyForm) {
    // Set default date to today for daily form
    document.getElementById('date').valueAsDate = new Date();

    dailyForm.addEventListener('submit', function (e) {
      e.preventDefault();
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

      fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(res => res.json())
      .then(response => {
        if (response.result === 'success') {
          showModal('Success!', response.message);
          dailyForm.reset();
          document.getElementById('date').valueAsDate = new Date(); // Reset date after submission
        } else {
          throw new Error(response.message);
        }
      })
      .catch(error => {
        showModal('Error!', `An error occurred: ${error.message}`, true);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Report';
      });
    });
  }


  // --- WEEKLY PLAN LOGIC ---
  if (weeklyForm) {
    const planEntriesContainer = document.getElementById('plan-entries-container');
    const addDayBtn = document.getElementById('add-day-btn');
    let entryCount = 0;

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

    // Add the first entry automatically
    addPlanEntry();

    addDayBtn.addEventListener('click', addPlanEntry);

    planEntriesContainer.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('delete-btn')) {
        // Prevent deleting the last entry
        if (planEntriesContainer.childElementCount > 1) {
          e.target.closest('.plan-entry').remove();
        } else {
          showModal('Action Denied', 'You cannot delete the last plan entry.', true);
        }
      }
    });

    weeklyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const employeeId = document.getElementById('employeeId').value;
        const planEntries = [];
        const entryDivs = planEntriesContainer.querySelectorAll('.plan-entry');

        entryDivs.forEach(div => {
            const date = div.querySelector('.plan-date').value;
            const plan = div.querySelector('.plan-text').value;
            if (date && plan) { // Basic validation
                planEntries.push({ date, plan });
            }
        });

        if (planEntries.length !== entryDivs.length) {
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

        fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
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
                throw new Error(response.message);
            }
        })
        .catch(error => {
            showModal('Error!', `An error occurred: ${error.message}`, true);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Full Plan';
        });
    });
  }
});

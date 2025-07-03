const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const entries = form.querySelectorAll('.entry-section');

  let hasData = false;
  let formData = new FormData();

  entries.forEach((entry, index) => {
    const empId = entry.querySelector('.emp-id').value.trim();
    const date = entry.querySelector('.entry-date').value;
    const text = entry.querySelector('.entry-text').value.trim();

    if (empId && date && text) {
      hasData = true;
      formData.append(`EmployeeID_${index}`, empId);
      formData.append(`Date_${index}`, date);
      formData.append(`WorkDone_${index}`, text);
    }
  });

  if (!hasData) {
    showModal("Error", "Please fill out at least one complete row. Click OK to return.");
    return;
  }

  formData.append('sheet', sheetName);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(responseText => {
      console.log(responseText);
      showModal("Submitted", "Click OK to return to the reporting page.");
      form.reset();
    })
    .catch(error => {
      console.error('Error!', error.message);
      showModal("Error", "Submission failed. Click OK to return.");
    });
}

// Function to show the modal popup
function showModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.querySelector('#resultModal p').textContent = message;
  document.getElementById('resultModal').style.display = 'flex';
}

// Close modal and reload the current page
function closeModal() {
  document.getElementById('resultModal').style.display = 'none';
  window.location.reload();  // Reloads current page
}

// Used in weekly.html: adds another day/row
function addEntry(formId) {
  const form = document.getElementById(formId);
  const firstEntry = form.querySelector('.entry-section');
  const newEntry = firstEntry.cloneNode(true);

  // Clear previous input values
  newEntry.querySelector('.emp-id').value = '';
  newEntry.querySelector('.entry-date').value = '';
  newEntry.querySelector('.entry-text').value = '';

  // Remove any existing remove button (avoid duplicates)
  const existingRemoveBtn = newEntry.querySelector('.remove-btn');
  if (existingRemoveBtn) existingRemoveBtn.remove();

  // Create and add new remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = '×';
  removeBtn.className = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.onclick = () => newEntry.remove();

  newEntry.appendChild(removeBtn);

  // Insert the new entry before the button row
  const buttonRow = form.querySelector('.button-row');
  form.insertBefore(newEntry, buttonRow);
}

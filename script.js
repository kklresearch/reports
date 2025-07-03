const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const entries = form.querySelectorAll('.entry-section');

  let hasValidRow = false;
  let formData = new FormData();

  entries.forEach((entry, index) => {
    const empId = entry.querySelector('.emp-id').value.trim();
    const date = entry.querySelector('.entry-date').value;
    const text = entry.querySelector('.entry-text').value.trim();

    if (empId && date && text) {
      hasValidRow = true;
      formData.append(`EmployeeID_${index}`, empId);
      formData.append(`Date_${index}`, date);
      formData.append(`WorkDone_${index}`, text);
    }
  });

  if (!hasValidRow) {
    showModal("Error", "Please fill out at least one complete row.");
    return;
  }

  formData.append('sheet', sheetName);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(responseText => {
      showModal("Submitted", "Click OK to return to the reporting page.");
    })
    .catch(error => {
      showModal("Error", "Submission failed. Please try again.");
    });
}

function addEntry(formId) {
  const form = document.getElementById(formId);
  const firstEntry = form.querySelector('.entry-section');
  const newEntry = firstEntry.cloneNode(true);

  newEntry.querySelector('.emp-id').value = '';
  newEntry.querySelector('.entry-date').value = '';
  newEntry.querySelector('.entry-text').value = '';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.onclick = () => newEntry.remove();
  newEntry.appendChild(removeBtn);

  const buttonRow = form.querySelector('.button-row');
  form.insertBefore(newEntry, buttonRow);
}

function showModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.querySelector('#resultModal p').textContent = message;
  document.getElementById('resultModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('resultModal').style.display = 'none';
  window.location.reload();
}

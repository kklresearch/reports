// ✅ Google Apps Script Web App URL (keep this updated if you redeploy)
const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

// ✅ Submit function for Daily and Weekly forms
function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const entries = form.querySelectorAll('.entry-section');

  let hasValidRow = false;
  const formData = new FormData();

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
    alert("Please fill out at least one complete row.");
    return;
  }

  formData.append('sheet', sheetName);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(result => {
      alert("Submitted successfully");
      window.location.href = "index.html"; // ⬅️ Redirects to homepage after success
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("Submission failed. Please try again.");
    });
}

// ✅ Add a new entry row (for Weekly page or Daily if multiple rows are needed)
function addEntry(formId) {
  const form = document.getElementById(formId);
  const firstEntry = form.querySelector('.entry-section');
  const newEntry = firstEntry.cloneNode(true);

  // Clear the values in the cloned row
  newEntry.querySelector('.emp-id').value = '';
  newEntry.querySelector('.entry-date').value = '';
  newEntry.querySelector('.entry-text').value = '';

  // Optional: Add remove button for rows (only for Weekly)
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.type = "button";
  removeButton.style.margin = "5px";
  removeButton.style.backgroundColor = "#e74c3c";
  removeButton.style.color = "#fff";
  removeButton.style.border = "none";
  removeButton.style.borderRadius = "4px";
  removeButton.onclick = () => newEntry.remove();

  newEntry.appendChild(removeButton);

  const buttonRow = form.querySelector('.button-row');
  form.insertBefore(newEntry, buttonRow);
}

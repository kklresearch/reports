// ✅ Replace with your actual Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

// ✅ Handle form submission (supports only one entry at a time)
function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const entry = form.querySelector('.entry-section');

  const empId = entry.querySelector('.emp-id').value.trim();
  const date = entry.querySelector('.entry-date').value;
  const text = entry.querySelector('.entry-text').value.trim();

  if (!empId || !date || !text) {
    alert("Please fill all fields before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append('EmployeeID_0', empId);
  formData.append('Date_0', date);
  formData.append('WorkDone_0', text);
  formData.append('sheet', sheetName);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(result => {
      alert("Submitted successfully.");
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("Submission failed. Please try again.");
    });
}

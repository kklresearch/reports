const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const empId = form.querySelector('.emp-id').value.trim();
  const date = form.querySelector('.entry-date').value;
  const work = form.querySelector('.entry-text').value.trim();

  if (!empId || !date || !work) {
    showModal("Error", "All fields are required. Click OK to return to the form.");
    return;
  }

  const formData = new FormData();
  formData.append('EmployeeID', empId);
  formData.append('Date', date);
  formData.append('WorkDone', work);
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

function showModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.querySelector('#resultModal p').textContent = message;
  document.getElementById('resultModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('resultModal').style.display = 'none';
  window.location.href = 'daily.html';
}

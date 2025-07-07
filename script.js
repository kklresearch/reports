const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const entries = form.querySelectorAll('.entry-section');

  let formData = new FormData();
  let hasValidRow = false;

  entries.forEach((entry, index) => {
    const empId = entry.querySelector('.emp-id').value.trim();
    const date = entry.querySelector('.entry-date').value;
    const work = entry.querySelector('.entry-text').value.trim();

    if (empId && date && work) {
      hasValidRow = true;
      formData.append(`empId_${index}`, empId);
      formData.append(`date_${index}`, date);
      formData.append(`work_${index}`, work);
    }
  });

  if (!hasValidRow) {
    alert("Please fill out at least one complete row.");
    return;
  }

  formData.append('sheet', sheetName);
  formData.append('count', entries.length);

  fetch(scriptURL, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.text())
    .then(responseText => {
      console.log("Server response:", responseText);
      if (responseText.trim() === "Success") {
        alert("Submitted successfully");
        window.location.href = "index.html";
      } else {
        alert("Error from server: " + responseText);
      }
    })
    .catch(error => {
      console.error("Error!", error.message);
      alert("Failed to submit. Please try again.");
    });
}

function addEntry(formId) {
  const form = document.getElementById(formId);
  const firstEntry = form.querySelector('.entry-section');
  const newEntry = firstEntry.cloneNode(true);

  newEntry.querySelector('.emp-id').value = '';
  newEntry.querySelector('.entry-date').value = '';
  newEntry.querySelector('.entry-text').value = '';

  const buttonRow = form.querySelector('.button-row');
  form.insertBefore(newEntry, buttonRow);
}

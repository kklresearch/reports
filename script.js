const scriptURL = 'https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec';

function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const entries = form.querySelectorAll('.entry-section');

  const data = {
    sheet: sheetName,
    entries: []
  };

  let hasValidRow = false;

  entries.forEach(entry => {
    const empId = entry.querySelector('.emp-id').value.trim();
    const date = entry.querySelector('.entry-date').value;
    const work = entry.querySelector('.entry-text').value.trim();

    if (empId && date && work) {
      hasValidRow = true;
      data.entries.push({
        empId,
        date,
        work
      });
    }
  });

  if (!hasValidRow) {
    alert("Please fill out at least one complete row.");
    return;
  }

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.text())
    .then(responseText => {
      console.log("Response Text:", responseText);
      if (responseText.trim() === "Success") {
        alert("Submitted successfully");
        window.location.href = "index.html";
      } else {
        alert("Server Error: " + responseText);
      }
    })
    .catch(error => {
      console.error("Fetch Error:", error);
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

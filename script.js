// ✅ Replace with your actual deployed Apps Script URL
const endpoint = "https://script.google.com/macros/s/AKfycbydf2nWMybXOOpNeyA2ggBZHgCzga5G4L-zH8joRW86ZkMWOWTrpXyogHGH2dHSJNDu/exec";

// ✅ Function to submit form data to Google Sheets
function submitForm(sheetName, formId) {
  const form = document.getElementById(formId);
  const rows = [];

  const sections = form.querySelectorAll(".entry-section");
  sections.forEach(section => {
    const empId = section.querySelector(".emp-id").value.trim();
    const date = section.querySelector(".entry-date").value;
    const text = section.querySelector(".entry-text").value.trim();

    if (empId && date && text) {
      rows.push([empId, date, text]);
    }
  });

  if (rows.length === 0) {
    alert("Please fill out at least one complete row.");
    return;
  }

  fetch(`${endpoint}?sheet=${sheetName}`, {
    method: "POST",
    body: JSON.stringify(rows),
    headers: {
      "Content-Type": "text/plain"  // ✅ Avoids CORS preflight issues
    }
  })
    .then(res => res.text())
    .then(msg => {
      if (msg === "Success") {
        alert("Submitted successfully!");
        form.reset();
      } else {
        alert("Error: " + msg);
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Something went wrong. Details: " + err.message);
    });
}

// ✅ Function to add a new entry row
function addEntry(formId) {
  const form = document.getElementById(formId);
  const section = form.querySelector(".entry-section");
  const clone = section.cloneNode(true);

  // Clear the inputs in the cloned section
  clone.querySelectorAll("input, textarea").forEach(input => (input.value = ""));
  form.insertBefore(clone, form.querySelector("button[type='button']"));
}

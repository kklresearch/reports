// ✅ This is your actual Google Apps Script Web App endpoint
const endpoint = "https://script.google.com/macros/s/AKfycbw7k0VQEZWMP5i3IZlMwlI7QpVClawl7U9mDPvKOaFlA3dpr7IHVnI7J7RhdzZgRDy7/exec";

// ✅ Submit the form to Google Sheets
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
      "Content-Type": "application/json"
    }
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg === "Success" ? "Submitted successfully!" : msg);
      form.reset();
    })
    .catch(err => {
  console.error("Fetch error:", err);
  alert("Something went wrong. Details: " + err.message);
});
}

// ✅ Add a new row to the form dynamically
function addEntry(formId) {
  const form = document.getElementById(formId);
  const section = form.querySelector(".entry-section");
  const clone = section.cloneNode(true);

  // Clear input values in cloned section
  clone.querySelectorAll("input, textarea").forEach(input => (input.value = ""));
  form.insertBefore(clone, form.querySelector("button[type='button']"));
}

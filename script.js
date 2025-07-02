function addEntry(formId) {
  const form = document.getElementById(formId);
  const firstEntry = form.querySelector(".day-entry");
  const newEntry = firstEntry.cloneNode(true);
  form.insertBefore(newEntry, form.children[form.children.length - 2]);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = [];
      const entries = form.querySelectorAll(".day-entry");

      entries.forEach(entry => {
        const empId = entry.querySelector("input[name='employeeId']").value;
        const date = entry.querySelector("input[name='date']").value;
        const work = entry.querySelector("input[name='workDone']")?.value ||
                     entry.querySelector("input[name='plan']")?.value;

        data.push([empId, date, work]);
      });

      // Send to Google Sheets (we'll set this up soon)
      fetch('https://script.google.com/macros/s/PASTE-YOUR-URL-HERE/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
      });

      alert("Submitted!");
      form.reset();
    });
  });
});

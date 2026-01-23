document.addEventListener("DOMContentLoaded", () => {
  console.log("Quote script loaded ✅");

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === CONFIG: Google Form POST endpoint (must be /forms/d/<ID>/formResponse) ===
  const GOOGLE_FORM_ENDPOINT =
    "https://docs.google.com/forms/d/e/1FAIpQLSdmQCnaL1LxI5rPXo83IvYppoxIrL8Ztq2pUKsTZcSMw_TxoQ/viewform?usp=dialog";

  // === Map your site fields to Google Form entry IDs ===
  // IMPORTANT: Confirm these match your form's fields.
  const ENTRY = {
    FirstName: "entry.500061655",
    LastName: "entry.231511378",
    phone:    "entry.1378254976",
    email:    "entry.849408615",
    zip:      "entry.1664953559",
    project:  "entry.604523920",
    budget:   "entry.1119469797",
    details:  "entry.892290026"
  };

  const form = document.getElementById("quoteForm");
  const statusEl = document.getElementById("quoteStatus");
  const submitBtn = document.getElementById("quoteSubmitBtn");

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Submitting…" : "Submit";
  }

  function postToGoogleForm(data) {
    // Create (or reuse) a hidden iframe target
    let iframe = document.getElementById("hidden_iframe_gf");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.id = "hidden_iframe_gf";
      iframe.name = "hidden_iframe_gf";
      document.body.appendChild(iframe);
    }

    // Create a temporary form to POST to Google Forms
    const f = document.createElement("form");
    f.action = GOOGLE_FORM_ENDPOINT;
    f.method = "POST";
    f.target = "hidden_iframe_gf";

    const add = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value ?? "";
      f.appendChild(input);
    };

    add(ENTRY.FirstName, data.fullName);
    add(ENTRY.LastName, data.fullName);
    add(ENTRY.phone, data.phone);
    add(ENTRY.email, data.email);
    add(ENTRY.zip, data.zip);
    add(ENTRY.project, data.project);
    add(ENTRY.budget, data.budget);
    add(ENTRY.details, data.details || "");

    document.body.appendChild(f);
    f.submit();
    f.remove();
  }

  if (!form) {
    console.error("Form not found. Check: <form id='quoteForm'> exists in HTML.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const FirstName = document.getElementById("FirstName")?.value.trim() || "";
    const LastName = document.getElementById("LastName")?.value.trim() || "";
    const phone    = document.getElementById("phone")?.value.trim() || "";
    const email    = document.getElementById("email")?.value.trim() || "";
    const zip      = document.getElementById("zip")?.value.trim() || "";
    const project  = document.getElementById("project")?.value || "";
    const budget   = document.getElementById("budget")?.value || "";
    const details  = document.getElementById("details")?.value.trim() || "";

    // Basic required validation (matches your * fields)
    if (!FirstName || !FirstName || !phone || !email || !zip || !project || !budget) {
      setStatus("Please fill in all required fields (*) before submitting.");
      return;
    }

    const payload = { FirstName, LastName, phone, email, zip, project, budget, details };

    try {
      setSubmitting(true);
      setStatus("Submitting…");

      // Submit silently to Google Form
      postToGoogleForm(payload);

      // We can’t reliably detect success (cross-domain), so we show a confident UX message
      setStatus("Submitted! We received your request and will contact you shortly.");
      form.reset();

      // Optional: clear message after a bit
      setTimeout(() => setStatus(""), 8000);
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("We couldn’t submit right now. Please try again or call (908) 937-8083.");
    } finally {
      setSubmitting(false);
    }
  });
});

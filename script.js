document.addEventListener("DOMContentLoaded", () => {
  console.log("Quote script loaded ✅");

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const GOOGLE_FORM_ENDPOINT =
    "https://docs.google.com/forms/d/e/1FAIpQLSdmQCnaL1LxI5rPXo83IvYppoxIrL8Ztq2pUKsTZcSMw_TxoQ/formResponse";

  const ENTRY = {
    FirstName: "entry.500061655",
    LastName: "entry.231511378",
    PhoneNumber: "entry.1378254976",
    Email: "entry.849408615",
    ZipCode: "entry.1664953559",
    Project: "entry.604523920",
    Budget: "entry.1119469797",
    ProjectDetails: "entry.892290026"
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
    let iframe = document.getElementById("hidden_iframe_gf");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.id = "hidden_iframe_gf";
      iframe.name = "hidden_iframe_gf";
      document.body.appendChild(iframe);
    }

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

    add("fvv", "1");
    add("pageHistory", "0");

    add(ENTRY.FirstName, data.FirstName);
    add(ENTRY.LastName, data.LastName);
    add(ENTRY.PhoneNumber, data.PhoneNumber);
    add(ENTRY.Email, data.Email);
    add(ENTRY.ZipCode, data.ZipCode);
    add(ENTRY.Project, data.Project);
    add(ENTRY.Budget, data.Budget);
    add(ENTRY.ProjectDetails, data.ProjectDetails || "");

    document.body.appendChild(f);

    // 🔒 SAFE SUBMIT — cannot be shadowed
    HTMLFormElement.prototype.submit.call(f);

    f.remove();
  }

  if (!form) {
    console.error("Form not found: #quoteForm");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      FirstName: document.getElementById("FirstName")?.value.trim() || "",
      LastName: document.getElementById("LastName")?.value.trim() || "",
      PhoneNumber: document.getElementById("PhoneNumber")?.value.trim() || "",
      Email: document.getElementById("Email")?.value.trim() || "",
      ZipCode: document.getElementById("ZipCode")?.value.trim() || "",
      Project: document.getElementById("Project")?.value || "",
      Budget: document.getElementById("Budget")?.value || "",
      ProjectDetails: document.getElementById("ProjectDetails")?.value.trim() || ""
    };

    if (
      !payload.FirstName ||
      !payload.LastName ||
      !payload.PhoneNumber ||
      !payload.Email ||
      !payload.ZipCode ||
      !payload.Project ||
      !payload.Budget
    ) {
      setStatus("Please fill in all required fields (*) before submitting.");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting…");

    try {
      postToGoogleForm(payload);
      setStatus("Submitted! We received your request and will contact you shortly.");
      form.reset();
      setTimeout(() => setStatus(""), 8000);
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("We couldn’t submit right now. Please try again or call (908) 937-8083.");
    } finally {
      setSubmitting(false);
    }
  });
});

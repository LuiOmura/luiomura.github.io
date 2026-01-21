document.addEventListener("DOMContentLoaded", () => {
  console.log("Quote script loaded ✅");

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // CONFIG
  const GOOGLE_FORM_ENDPOINT =
    "https://docs.google.com/forms/d/1u8jdamQHqGgSchlyv9S0ZmoJr1-4wRc5Bb9VG4eqriw/formResponse";

  const ENTRY = {
    fullName: "entry.500061655",
    phone:    "entry.1378254976",
    email:    "entry.849408615",
    zip:      "entry.1202126100",
    budget:   "entry.1119469797",
    details:  "entry.892290026"
  };

  const TO_EMAIL = "luiomuracontractor@gmail.com";

  const form = document.getElementById("quoteForm");
  const statusEl = document.getElementById("quoteStatus");

  console.log("quoteForm found:", !!form);

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function buildEmailBody(data) {
    return [
      "Dear Lui Omura, 
      we would like to inquire an estimated quote for the following project.",
      "",
      `Full Name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Zip Code: ${data.zip}`,
      `Budget: ${data.budget}`,
      "",
      "Project Details:",
      data.details ? data.details : "(not provided)"
    ].join("\n");
  }

  function openMailDraft(subject, body) {
    const url =
      `mailto:${encodeURIComponent(TO_EMAIL)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  async function postToGoogleForm(data) {
    const fd = new FormData();
    fd.append(ENTRY.fullName, data.fullName);
    fd.append(ENTRY.phone,    data.phone);
    fd.append(ENTRY.email,    data.email);
    fd.append(ENTRY.zip,      data.zip);
    fd.append(ENTRY.budget,   data.budget);
    fd.append(ENTRY.details,  data.details || "");

    await fetch(GOOGLE_FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: fd
    });
  }

  if (!form) {
    console.error("Form not found. Check: <form id='quoteForm'> exists in HTML.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit clicked ✅");

    const fullName = document.getElementById("fullName")?.value.trim() || "";
    const phone    = document.getElementById("phone")?.value.trim() || "";
    const email    = document.getElementById("email")?.value.trim() || "";
    const zip      = document.getElementById("zip")?.value.trim() || "";
    const budget   = document.getElementById("budget")?.value || "";
    const details  = document.getElementById("details")?.value.trim() || "";

    if (!fullName || !phone || !email || !zip || !budget) {
      setStatus("Please fill in all required fields (*) before submitting.");
      return;
    }

    const payload = { fullName, phone, email, zip, budget, details };

    try {
      setStatus("Submitting…");
      await postToGoogleForm(payload);

      openMailDraft(`Quote Request — ${fullName} (${zip})`, buildEmailBody(payload));

      setStatus("Submitted! Your email draft should open now.");
      form.reset();
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("We couldn’t submit right now. Please try again or call (908) 937-8083.");
    }
  });
});

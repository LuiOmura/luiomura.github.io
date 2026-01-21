document.addEventListener("DOMContentLoaded", () => {
  console.log("Quote script loaded ✅");

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // CONFIG
  const GOOGLE_FORM_ENDPOINT =
    "https://docs.google.com/forms/d/e/1u8jdamQHqGgSchlyv9S0ZmoJr1-4wRc5Bb9VG4eqriw/formResponse";

  const ENTRY = {
    fullName: "entry.500061655",
    phone:    "entry.1378254976",
    email:    "entry.849408615",
    zip:      "entry.1202126100",
    project:  "entry.604523920",
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
      `Project: ${data.project}`,
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

function postToGoogleForm(data) {
  // Create hidden iframe target
  let iframe = document.getElementById("hidden_iframe_gf");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.id = "hidden_iframe_gf";
    iframe.name = "hidden_iframe_gf";
    document.body.appendChild(iframe);
  }

  // Create hidden form
  const f = document.createElement("form");
  f.action = GOOGLE_FORM_ENDPOINT;
  f.method = "POST";
  f.target = "hidden_iframe_gf";

  const add = (name, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value || "";
    f.appendChild(input);
  };

  add(ENTRY.fullName, data.fullName);
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit clicked ✅");

    const fullName = document.getElementById("fullName")?.value.trim() || "";
    const phone    = document.getElementById("phone")?.value.trim() || "";
    const email    = document.getElementById("email")?.value.trim() || "";
    const zip      = document.getElementById("zip")?.value.trim() || "";
    const project  = document.getElementById("project")?.value()  || "";
    const budget   = document.getElementById("budget")?.value || "";
    const details  = document.getElementById("details")?.value.trim() || "";

    if (!fullName || !phone || !email || !zip || !project || !budget) {
      setStatus("Please fill in all required fields (*) before submitting.");
      return;
    }

    const payload = { fullName, phone, email, zip, project, budget, details };

    try {
      setStatus("Submitting…");
      const subject = `Quote Request — ${fullName} (${zip})`;
      openMailDraft(subject, buildEmailBody(payload));
      
      // Send to Google Form in background (don’t await)
      postToGoogleForm(payload);
      openMailDraft(subject, buildEmailBody(payload));


      setStatus("Submitted! Your email draft should open now.");
      form.reset();
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("We couldn’t submit right now. Please try again or call (908) 937-8083.");
    }
  });
});

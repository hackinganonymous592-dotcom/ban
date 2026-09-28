const ACCESS_CODE = "SZDEV2026";

// Recipients used by the prepared email.
const RECIPIENTS = [
  "support@whatsapp.com",
  "smb_web@support.whatsapp.com",
  "android@support.whatsapp.com"
];

const temporaryMessage = (number) => `Dear WhatsApp Support / Meta Trust & Safety,

I am submitting this message as a formal report regarding the following WhatsApp number:

Number: ${number}

This report is submitted in the interest of user safety and compliance with WhatsApp’s Terms of Service.

Summary of concerns

The account associated with this number has been reported for potentially unwanted or disruptive communication. I respectfully request that the activity associated with this account be reviewed.

Request for action

1. A review of the account’s activity.
2. An assessment of its compliance with WhatsApp policies.
3. Temporary restrictions if a violation is confirmed.

This report is submitted in good faith to help maintain a safe and respectful environment for WhatsApp users.

Thank you for your attention.`;

const permanentMessage = (number) => `Dear WhatsApp Support / Meta Trust & Safety,

I am submitting this message as a formal report regarding the following WhatsApp number:

Number: ${number}

This report is submitted in the interest of user safety and compliance with WhatsApp’s Terms of Service.

Summary of concerns

The account associated with this number has been reported for potentially unwanted, persistent, or disruptive communication. I respectfully request a comprehensive review of the account and its activity.

Policy considerations

If the investigation confirms violations of WhatsApp’s policies, I request that the appropriate enforcement measures be applied to the account.

Request for action

1. A comprehensive review of the account’s activity.
2. An assessment of compliance with WhatsApp policies.
3. Appropriate action if violations are confirmed, including permanent restriction where warranted by the applicable policies.

This report is submitted in good faith to help maintain a safe and respectful environment for WhatsApp users.

Thank you for your attention.`;

const accessScreen = document.getElementById("accessScreen");
const banScreen = document.getElementById("banScreen");
const accessCode = document.getElementById("accessCode");
const accessBtn = document.getElementById("accessBtn");
const accessStatus = document.getElementById("accessStatus");
const phone = document.getElementById("phone");
const banBtn = document.getElementById("banBtn");
const banStatus = document.getElementById("banStatus");
const choices = document.querySelectorAll(".choice");

let selectedType = "temporary";

function setMode(type) {
  selectedType = type;

  document.body.classList.remove("mode-temporary", "mode-permanent");
  document.body.classList.add(`mode-${type}`);

  choices.forEach((button) => {
    button.classList.toggle("active", button.dataset.type === type);
  });

  banStatus.textContent = "";
}

function unlock() {
  if (accessCode.value.trim() === ACCESS_CODE) {
    accessScreen.classList.add("hidden");
    banScreen.classList.remove("hidden");
    accessStatus.textContent = "";
    setMode("temporary");
    phone.focus();
  } else {
    accessStatus.textContent = "Invalid access code.";
    accessCode.select();
  }
}

accessBtn.addEventListener("click", unlock);

accessCode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlock();
});

choices.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.type);
  });
});

function normalizeNumber(value) {
  return value.trim().replace(/[^\d+]/g, "");
}

banBtn.addEventListener("click", () => {
  const number = normalizeNumber(phone.value);

  if (!number || number.replace(/\D/g, "").length < 7) {
    banStatus.textContent = "Enter a valid WhatsApp number.";
    phone.focus();
    return;
  }

  const message = selectedType === "temporary"
    ? temporaryMessage(number)
    : permanentMessage(number);

  const subject = selectedType === "temporary"
    ? `WhatsApp Report - Temporary Review - ${number}`
    : `WhatsApp Report - Account Review - ${number}`;

  // mailto opens the device's configured mail handler.
  // On phones where Gmail is the default mail handler, Gmail opens directly.
  const to = RECIPIENTS.join(",");
  const mailto =
    `mailto:${to}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;

  banStatus.textContent = "Opening mail...";
  window.location.href = mailto;
});

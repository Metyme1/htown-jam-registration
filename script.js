function showModal(icon, title, message, callback) {
  document.getElementById("modal-icon").textContent = icon;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("modal-overlay").style.display = "flex";
  window._modalCallback = callback || null;
}

function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
  if (window._modalCallback) {
    window._modalCallback();
    window._modalCallback = null;
  }
}

document
  .querySelector(".submit-btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const teamName = document.querySelector(
      'input[placeholder="Enter your team name"]',
    ).value;
    const players = document.getElementById("players-hidden").value;
    const captainName = document.querySelector(
      'input[placeholder="Full name"]',
    ).value;
    const email = document.querySelector(
      'input[placeholder="captain@email.com"]',
    ).value;
    const phone = document.querySelector(
      'input[placeholder="+1 (000) 000-0000"]',
    ).value;
    const uniform = document.querySelector("select").value;

    const w1 = document.querySelector("#w1").checked;
    const w2 = document.querySelector("#w2").checked;
    const w3 = document.querySelector("#w3").checked;
    const w4 = document.querySelector("#w4").checked;

    if (!teamName || !captainName || !email || !phone) {
      showModal(
        "⚠️",
        "Missing Fields",
        "Please fill in all required fields before submitting.",
      );
      return;
    }

    if (!players) {
      showModal("⚠️", "Missing Fields", "Please select the number of players.");
      return;
    }

    if (uniform === "Select uniform status") {
      showModal("⚠️", "Missing Fields", "Please select your uniform status.");
      return;
    }

    if (!w1 || !w2 || !w3 || !w4) {
      showModal(
        "📋",
        "Agreement Required",
        "Please agree to all terms and waiver before submitting.",
      );
      return;
    }

    const btn = document.querySelector(".submit-btn");
    btn.textContent = "Submitting...";
    btn.disabled = true;

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyZdv3xpfgBowm8HZhWywEhLaCGmf9OdZ9Gr0Y_SDwE_7hwdId0udOMaekZ-dHGNlkTMw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName,
            players,
            captainName,
            email,
            phone,
            uniform,
          }),
        },
      );

      btn.textContent = "Registration Submitted! ✓";
      btn.style.background = "#1D9E75";

      showModal(
        "🎉",
        "Registration Successful!",
        "You have successfully registered for H-Town Jam Vol. 2! You will now be redirected to PayPal to complete your $350 payment.",
        function () {
          window.location.href =
            "https://www.paypal.com/ncp/payment/RQDP9DTVHMU8E";
        },
      );
    } catch (error) {
      btn.textContent = "Complete Registration & Pay $350";
      btn.disabled = false;
      showModal(
        "❌",
        "Something Went Wrong",
        "We could not submit your registration. Please try again.",
      );
    }
  });

// Auto close registration on May 24, 2026
const deadline = new Date("2026-05-24T23:59:59");
const now = new Date();

if (now > deadline) {
  document.querySelector(".page").innerHTML = `
    <div style="text-align:center; padding:3rem 1rem;">
      <div style="font-size:60px; margin-bottom:1rem;">🏀</div>
      <h2 style="font-size:24px; font-weight:600; color:#1a1a2e; margin-bottom:12px;">Registration Closed</h2>
      <p style="font-size:15px; color:#666; line-height:1.8;">
        Registration for <strong>H-Town Jam Vol. 2</strong> closed on <strong style="color:#a32d2d;">May 24, 2026</strong>.<br/>
        Thank you to all teams who registered!
      </p>
      <div style="margin-top:2rem; padding:16px; background:#fff8f0; border:1px solid #ff8c00; border-radius:12px; font-size:13px; color:#633806;">
        For more information, please contact the tournament organizer.
      </div>
    </div>
  `;
}

// Countdown Timer
function updateCountdown() {
  const deadline = new Date("2026-05-24T23:59:59");
  const now = new Date();
  const diff = deadline - now;

  if (diff <= 0) {
    document.querySelector(".countdown-wrap").innerHTML = `
      <div style="color:#a32d2d; font-weight:600; font-size:15px;">
        🔴 Registration is now closed
      </div>`;
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("cd-days").textContent = String(days).padStart(
    2,
    "0",
  );
  document.getElementById("cd-hours").textContent = String(hours).padStart(
    2,
    "0",
  );
  document.getElementById("cd-mins").textContent = String(mins).padStart(
    2,
    "0",
  );
  document.getElementById("cd-secs").textContent = String(secs).padStart(
    2,
    "0",
  );
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Custom dropdown
const selectEl = document.getElementById("players-select");
const trigger = selectEl.querySelector(".custom-select-trigger");
const playerOptions = selectEl.querySelectorAll(
  ".custom-option:not(.placeholder-opt)",
);
const valueEl = document.getElementById("players-value");
const hiddenInput = document.getElementById("players-hidden");

trigger.addEventListener("click", function (e) {
  e.stopPropagation();
  selectEl.classList.toggle("open");
});

playerOptions.forEach(function (option) {
  option.addEventListener("click", function (e) {
    e.stopPropagation();
    valueEl.textContent = option.dataset.value + " Players";
    hiddenInput.value = option.dataset.value;
    trigger.classList.add("selected");
    playerOptions.forEach(function (o) {
      o.classList.remove("selected-opt");
    });
    option.classList.add("selected-opt");
    selectEl.classList.remove("open");
  });
});

document.addEventListener("click", function (e) {
  if (!selectEl.contains(e.target)) {
    selectEl.classList.remove("open");
  }
});

export function contactSupport() {
  window.location.href = "mailto:support@octavium.app?subject=Octavium%20login%20help";
}

export function requestWhatsAppOtp() {
  window.open(
    "https://wa.me/?text=" + encodeURIComponent("Please send my Octavium OTP."),
    "_blank",
    "noopener"
  );
}

export function requestPasswordReset() {
  window.location.href =
    "mailto:support@octavium.app?subject=Octavium%20password%20reset&body=Please%20reset%20my%20Octavium%20password.";
}

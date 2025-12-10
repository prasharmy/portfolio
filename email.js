(function () {
  emailjs.init("KraLvq25mSlk192vx");
})();

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submitted");

  emailjs
    .sendForm("service_hjtof47", "template_jnpehkr", this)
    .then(() => {
      console.log("Email sent successfully");
      document.getElementById("status-message").textContent =
        "Message sent successfully!";
      this.reset();
    })
    .catch((error) => {
      console.log("Email send failed");
      document.getElementById("status-message").textContent =
        "Failed to send. Try again.";
      console.error("EmailJS Error:", error);
    });
});

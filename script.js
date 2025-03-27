// Add this at the beginning of your script.js file
document.addEventListener("DOMContentLoaded", function () {
    // Navbar Toggle Functionality
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // File Upload Preview
    const fileInput = document.querySelector(".upload-box input[type='file']");
    const uploadBox = document.querySelector(".upload-box");

    if (fileInput) {
        fileInput.addEventListener("change", function () {
            if (fileInput.files.length > 0) {
                // Remove any existing upload message
                const existingMessage = uploadBox.querySelector('.upload-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // Add new upload message
                const message = document.createElement('p');
                message.className = 'upload-message';
                message.textContent = `${fileInput.files[0].name} uploaded successfully!`;
                uploadBox.appendChild(message);
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll(".nav-links a").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: "smooth"
                });
            }
        });
    });

    // ... rest of your existing script.js code ...
});
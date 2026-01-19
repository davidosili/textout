window.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const userDisplay = document.getElementById('user-display');
    const popup = document.getElementById("success-popup");

    let currentUsername = "";

    // --- Step 1: Go to Step 2 ---
    const nextEmailBtn = step1.querySelector('button.btn-primary');
    nextEmailBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        const emailValue = emailInput.value.trim();
        if (!emailValue) return alert("Please enter your username/email");

        currentUsername = emailValue;
        userDisplay.textContent = currentUsername;

        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        passwordInput.focus();
    });

    // --- Password toggle ---
    window.togglePassword = function() {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    }

    // --- Step 2: Login ---
    const nextPasswordBtn = step2.querySelector('button.btn-primary');
    nextPasswordBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent form submission
        const passwordValue = passwordInput.value.trim();
        if (!passwordValue) return alert("Please enter your password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: currentUsername, password: passwordValue }),
                credentials: "include"
            });

            let result;
            try { result = await res.json(); } 
            catch { result = { message: "Invalid server response" }; }

            if (res.ok) {
                showPopup();
                // Reset form
                emailInput.value = "";
                passwordInput.value = "";
                step2.classList.add("hidden");
                step1.classList.remove("hidden");
            } else {
                alert(result.message || "Login failed");
            }
        } catch(err) {
            console.error(err);
            alert("Could not connect to server!");
        }
    });

    // --- Popup functions ---
    function showPopup() { popup.classList.remove("hidden"); }
    window.closePopup = function() { popup.classList.add("hidden"); }
});

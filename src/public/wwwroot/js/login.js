document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const userName = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("/login", {  // same origin, no port change
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // important for session cookies
            body: JSON.stringify({ userName, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            //Redirect to index page after login
            window.location.href = "index.html";
        } else {
            alert(data.message || "Invalid email or password");
        }
    } catch (error) {
        console.error("Login request failed:", error);
        alert("Login failed. Please try again.");
    }
});

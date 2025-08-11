document.getElementById("registrationForm").addEventListener("submit",async function (e) {
            e.preventDefault();
            const data = {
                firstName:document.getElementById("firstName").value,
                lastName:document.getElementById("lastName").value,
                userName:document.getElementById("username").value,
                password:document.getElementById("password").value,
                confirmPassword:document.getElementById("confirmPassword").value
            };
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if(response.ok)
            {
                alert("Registration successful! You can now log in.");
                window.location.href = "login.html";
            }else{
                alert("Registration failed. Please try again.");
            }
        });
const user = JSON.parse(localStorage.getItem('loggedUser'));

        if (user) {
            document.getElementById('userId').textContent = user.id;
            document.getElementById('firstName').textContent = user.firstName;
            document.getElementById('lastName').textContent = user.lastName;
            document.getElementById('userName').textContent = user.userName;
        } else {
            document.body.innerHTML = '<h1>No user data found</h1>';
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        }

        function logout() {
            localStorage.removeItem('loggedUser');
            window.location.href = "login.html";
        }
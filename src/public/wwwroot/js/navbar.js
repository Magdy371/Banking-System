// Check session on page load
fetch('/session-user', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn) {
            document.getElementById('authLink').style.display = 'none';
            document.getElementById('registerLink').style.display = 'none';
            document.getElementById('welcomeUser').style.display = 'inline';
            document.getElementById('welcomeUser').textContent = `Welcome, ${data.user.firstName}`;
            document.getElementById('signOutBtn').style.display = 'inline';
        }
    });

// Sign out
document.getElementById('signOutBtn').addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    }).then(() => {
        location.reload();
    });
});

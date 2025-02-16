document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(signupForm);
            formData.append('action', 'signup');
            fetch('auth.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            formData.append('action', 'login');
            fetch('auth.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    window.location.href = 'admin-panel.html';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            fetch('auth.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'logout' })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = 'index.html';
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

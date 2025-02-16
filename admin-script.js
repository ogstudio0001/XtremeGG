document.addEventListener('DOMContentLoaded', function () {
    const userList = document.getElementById('user-list');
    const logoutBtn = document.getElementById('logout-btn');
    
    function fetchUsers() {
        fetch('auth.php?action=get_users')
            .then(response => response.json())
            .then(users => {
                userList.innerHTML = '';
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="delete-btn" data-username="${user.username}">Delete</button>
                        </td>
                    `;
                    userList.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }
    
    userList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const username = e.target.getAttribute('data-username');
            if (confirm(`Are you sure you want to delete ${username}?`)) {
                fetch('auth.php', {
                    method: 'POST',
                    body: new URLSearchParams({ action: 'delete_user', username })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    fetchUsers();
                })
                .catch(error => console.error('Error deleting user:', error));
            }
        }
    });
    
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
    
    fetchUsers();
});

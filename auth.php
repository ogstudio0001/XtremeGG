<?php
session_start();
header('Content-Type: application/json');
$usersFile = 'users.json';

if (!file_exists($usersFile)) {
    file_put_contents($usersFile, json_encode([]));
}
$users = json_decode(file_get_contents($usersFile), true);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

function saveUsers($users) {
    global $usersFile;
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
}

if ($action === 'signup') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    if (!$username || !$password) {
        echo json_encode(['status' => 'error', 'message' => 'All fields required']);
        exit;
    }
    foreach ($users as $user) {
        if ($user['username'] === $username) {
            echo json_encode(['status' => 'error', 'message' => 'User already exists']);
            exit;
        }
    }
    $users[] = ['username' => $username, 'password' => password_hash($password, PASSWORD_DEFAULT), 'role' => 'user'];
    saveUsers($users);
    echo json_encode(['status' => 'success', 'message' => 'Signup successful']);
    exit;
}

if ($action === 'login') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    foreach ($users as $user) {
        if ($user['username'] === $username && password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $user['role'];
            echo json_encode(['status' => 'success', 'message' => 'Login successful', 'role' => $user['role']]);
            exit;
        }
    }
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    exit;
}

if ($action === 'get_users') {
    if ($_SESSION['role'] !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Access denied']);
        exit;
    }
    echo json_encode($users);
    exit;
}

if ($action === 'delete_user') {
    if ($_SESSION['role'] !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Access denied']);
        exit;
    }
    $username = $_POST['username'] ?? '';
    $users = array_filter($users, fn($user) => $user['username'] !== $username);
    saveUsers($users);
    echo json_encode(['status' => 'success', 'message' => 'User deleted']);
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
exit;
?>

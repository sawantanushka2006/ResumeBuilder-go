<?php
session_start();

function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['access_token']);
}

function requireAuth() {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit();
    }
}

function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    return [
        'id' => $_SESSION['user_id'],
        'email' => $_SESSION['user_email'],
        'access_token' => $_SESSION['access_token']
    ];
}

function login($user_data) {
    $_SESSION['user_id'] = $user_data['user']['id'];
    $_SESSION['user_email'] = $user_data['user']['email'];
    $_SESSION['access_token'] = $user_data['access_token'];
}

function logout() {
    session_destroy();
}
?>

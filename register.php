<?php
require_once 'config/auth.php';
require_once 'config/database.php';

if (isLoggedIn()) {
    header('Location: /dashboard.php');
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    if (empty($email) || empty($password)) {
        $error = 'Email and password are required.';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters long.';
    } else {
        $db = new Database();
        $response = $db->authRequest('signup', [
            'email' => $email,
            'password' => $password
        ]);
        
        if ($response['status'] === 200) {
            $success = 'Registration successful! Please check your email to confirm your account.';
        } else {
            $error = $response['data']['error_description'] ?? 'Registration failed. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Resume Builder</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">Resume Builder</a>
            <ul class="nav-links">
                <li><a href="/login.php">Login</a></li>
            </ul>
        </nav>
    </header>

    <main class="container" style="padding: 4rem 20px;">
        <div style="max-width: 400px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title">Create Your Account</h1>
                </div>
                
                <?php if ($error): ?>
                    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
                <?php endif; ?>
                
                <form method="POST">
                    <div class="form-group">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" id="email" name="email" class="form-input" required 
                               value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" id="password" name="password" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm_password" class="form-label">Confirm Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" class="form-input" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Create Account
                    </button>
                </form>
                
                <p style="text-align: center; margin-top: 1.5rem; color: #6b7280;">
                    Already have an account? <a href="/login.php" style="color: #2563eb;">Sign in</a>
                </p>
            </div>
        </div>
    </main>
</body>
</html>

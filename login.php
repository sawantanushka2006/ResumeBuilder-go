<?php
require_once 'config/auth.php';
require_once 'config/database.php';

if (isLoggedIn()) {
    header('Location: /dashboard.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    if (empty($email) || empty($password)) {
        $error = 'Email and password are required.';
    } else {
        $db = new Database();
        $response = $db->authRequest('token?grant_type=password', [
            'email' => $email,
            'password' => $password
        ]);
        
        if ($response['status'] === 200 && isset($response['data']['access_token'])) {
            login($response['data']);
            header('Location: /dashboard.php');
            exit();
        } else {
            $error = 'Invalid email or password.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - Resume Builder</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">Resume Builder</a>
            <ul class="nav-links">
                <li><a href="/register.php">Sign Up</a></li>
            </ul>
        </nav>
    </header>

    <main class="container" style="padding: 4rem 20px;">
        <div style="max-width: 400px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title">Sign In</h1>
                </div>
                
                <?php if ($error): ?>
                    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
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
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Sign In
                    </button>
                </form>
                
                <p style="text-align: center; margin-top: 1.5rem; color: #6b7280;">
                    Don't have an account? <a href="/register.php" style="color: #2563eb;">Sign up</a>
                </p>
            </div>
        </div>
    </main>
</body>
</html>

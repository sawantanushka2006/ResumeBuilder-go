<?php
require_once '../config/auth.php';
require_once '../config/database.php';

requireAuth();

$user = getCurrentUser();
$db = new Database();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    
    if (!empty($title)) {
        $response = $db->makeRequest('resumes', 'POST', [
            'user_id' => $user['id'],
            'title' => $title
        ], $user['access_token']);
        
        if ($response['status'] === 201) {
            $resume_id = $response['data'][0]['id'];
            header('Location: /resume/edit.php?id=' . $resume_id);
            exit();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Resume - Resume Builder</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">Resume Builder</a>
            <ul class="nav-links">
                <li><a href="/dashboard.php">Dashboard</a></li>
                <li><a href="/logout.php">Logout</a></li>
            </ul>
        </nav>
    </header>

    <main class="container" style="padding: 2rem 20px;">
        <div style="max-width: 500px; margin: 0 auto;">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title">Create New Resume</h1>
                </div>
                
                <form method="POST">
                    <div class="form-group">
                        <label for="title" class="form-label">Resume Title</label>
                        <input type="text" id="title" name="title" class="form-input" 
                               placeholder="e.g., Software Developer Resume" required>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary">Create Resume</button>
                        <a href="/dashboard.php" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </main>
</body>
</html>

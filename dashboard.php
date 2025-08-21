<?php
require_once 'config/auth.php';
require_once 'config/database.php';

requireAuth();

$user = getCurrentUser();
$db = new Database();

// Fetch user's resumes
$response = $db->makeRequest('resumes?select=*&user_id=eq.' . $user['id'], 'GET', null, $user['access_token']);
$resumes = $response['data'] ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Resume Builder</title>
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h1 style="font-size: 2rem; font-weight: bold; color: #111827;">My Resumes</h1>
            <a href="/resume/create.php" class="btn btn-primary">Create New Resume</a>
        </div>

        <?php if (empty($resumes)): ?>
            <div class="card" style="text-align: center; padding: 3rem;">
                <h2 style="font-size: 1.5rem; color: #6b7280; margin-bottom: 1rem;">No resumes yet</h2>
                <p style="color: #9ca3af; margin-bottom: 2rem;">Create your first resume to get started.</p>
                <a href="/resume/create.php" class="btn btn-primary">Create Your First Resume</a>
            </div>
        <?php else: ?>
            <div class="grid grid-3">
                <?php foreach ($resumes as $resume): ?>
                    <div class="card">
                        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #111827;">
                            <?php echo htmlspecialchars($resume['title']); ?>
                        </h3>
                        <p style="color: #6b7280; margin-bottom: 1.5rem;">
                            Updated: <?php echo date('M j, Y', strtotime($resume['updated_at'])); ?>
                        </p>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <a href="/resume/edit.php?id=<?php echo $resume['id']; ?>" class="btn btn-secondary">Edit</a>
                            <a href="/resume/preview.php?id=<?php echo $resume['id']; ?>" class="btn btn-secondary">Preview</a>
                            <a href="/resume/pdf.php?id=<?php echo $resume['id']; ?>" class="btn btn-primary">Download PDF</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>
</body>
</html>

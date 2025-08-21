<?php
require_once 'config/auth.php';

if (isLoggedIn()) {
    header('Location: /dashboard.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Builder - Create Professional Resumes</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">Resume Builder</a>
            <ul class="nav-links">
                <li><a href="/login.php">Login</a></li>
                <li><a href="/register.php" class="btn btn-primary">Get Started</a></li>
            </ul>
        </nav>
    </header>

    <main class="container" style="padding: 4rem 20px;">
        <div style="text-align: center; max-width: 800px; margin: 0 auto;">
            <h1 style="font-size: 3rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem;">
                Build Your Professional Resume
            </h1>
            <p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 3rem; line-height: 1.6;">
                Create stunning, professional resumes with our easy-to-use builder. 
                Choose from templates, customize your content, and download as PDF.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="/register.php" class="btn btn-primary" style="font-size: 1.125rem; padding: 1rem 2rem;">
                    Get Started
                </a>
                <a href="/login.php" class="btn btn-secondary" style="font-size: 1.125rem; padding: 1rem 2rem;">
                    Sign In
                </a>
            </div>
        </div>

        <div style="margin-top: 6rem;">
            <h2 style="text-align: center; font-size: 2rem; margin-bottom: 3rem; color: #111827;">Features</h2>
            <div class="grid grid-3">
                <div class="card" style="text-align: center;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #111827;">
                        Easy Form Builder
                    </h3>
                    <p style="color: #6b7280;">
                        Simple forms to input your personal information, education, experience, and skills.
                    </p>
                </div>
                <div class="card" style="text-align: center;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #111827;">
                        Professional Templates
                    </h3>
                    <p style="color: #6b7280;">
                        Clean, modern resume templates designed to impress employers.
                    </p>
                </div>
                <div class="card" style="text-align: center;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #111827;">
                        PDF Download
                    </h3>
                    <p style="color: #6b7280;">
                        Download your resume as a high-quality PDF ready for job applications.
                    </p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>

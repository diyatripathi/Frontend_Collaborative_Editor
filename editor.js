<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Text Editor</title>
    <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
    <link rel="stylesheet" href="static/css/styles.css">
</head>
<body>
    <header>
        <div class="navbar-brand">Collaborative Text Editor</div>
    </header>
    <main>
        <div id="editor-container"></div>
        <div id="active-users">
            <h3>Active Users</h3>
            <div id="active-users-list"></div>
        </div>
    </main>
    <footer>
        &copy; 2024 Collaborative Text Editor
    </footer>
    <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
    <script src="static/js/editor.js"></script>
</body>
</html>

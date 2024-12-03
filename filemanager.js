async selectFile(file) {
    this.currentFile = file;
    this.currentFileNameElement.textContent = file.title;
    this.renderFileList();

    try {
        const response = await fetch(`/api/files/${file.id}/content`);
        if (response.ok) {
            const content = await response.json();
            quill.setText(this.formatContent(content));
            this.updateLineNumbers(content);
        }
    } catch (error) {
        console.error('Failed to load file content:', error);
    }
}

async createNewFile() {
    const title = prompt('Enter file name:');
    if (!title) return;

    try {
        const response = await fetch('/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                isPublic: true,
            }),
        });

        if (response.ok) {
            const newFile = await response.json();
            this.files.push(newFile);
            this.renderFileList();
            this.selectFile(newFile);
        }
    } catch (error) {
        console.error('Failed to create file:', error);
    }
}

// Sync editor content with line numbers on text change
quill.on('text-change', () => {
    const lines = quill.getText().split('\n');
    fileManager.updateLineNumbers(lines.map((text, idx) => ({ text, idx })));
});

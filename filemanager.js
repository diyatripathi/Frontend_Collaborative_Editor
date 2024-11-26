class FileManager {
    constructor() {
        this.files = [];
        this.currentFile = null;
        this.fileListElement = document.getElementById('fileList');
        this.newFileBtn = document.getElementById('newFileBtn');
        this.currentFileNameElement = document.getElementById('currentFileName');
        
        this.setupEventListeners();
        this.loadFiles();
    }

    setupEventListeners() {
        this.newFileBtn.addEventListener('click', () => this.createNewFile());
    }


    async loadFiles() {
        try {
            const response = await fetch('/api/files');
            if (response.ok) {
                this.files = await response.json();
                this.renderFileList();
            }
        } catch (error) {
            console.error('Failed to load files:', error);
        }
    }

    renderFileList() {
        this.fileListElement.innerHTML = '';
        this.files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            if (this.currentFile && this.currentFile.id === file.id) {
                fileElement.className += ' active';
            }
            
            fileElement.innerHTML = `
                <div class="file-name">${file.title}</div>
                <div class="file-meta">
                    ${file.isPublic ? 'Public' : 'Private'} · 
                    ${new Date(file.createdAt).toLocaleDateString()}
                </div>
            `;
            
            fileElement.addEventListener('click', () => this.selectFile(file));
            this.fileListElement.appendChild(fileElement);
        });
    }

    async selectFile(file) {
        this.currentFile = file;
        this.currentFileNameElement.textContent = file.title;
        this.renderFileList();

        try {
            const response = await fetch(`/api/files/${file.id}/content`);
            if (response.ok) {
                const content = await response.json();
                document.getElementById('editor').innerHTML = this.formatContent(content);
                this.updateLineNumbers(content);
            }
        } catch (error) {
            console.error('Failed to load file content:', error);
        }
    }

    formatContent(content) {
        return content.map(line => line.text).join('\n');
    }

    updateLineNumbers(content) {
        const lineNumbers = document.getElementById('lineNumbers');
        lineNumbers.innerHTML = content
            .map((_, index) => `<div>${index + 1}</div>`)
            .join('');
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
                    isPublic: true
                })
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
}

// Initialize file manager
const fileManager = new FileManager();

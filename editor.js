class Editor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle text input
        this.editor.addEventListener('input', (e) => {
            const selection = window.getSelection();
            const position = selection.anchorOffset;
            
            // Send edit to WebSocket
            wsHandler.sendEdit(position, e.data);
        });

        // Handle cursor movement
        this.editor.addEventListener('mouseup', this.updateCursorPosition.bind(this));
        this.editor.addEventListener('keyup', this.updateCursorPosition.bind(this));

        // Handle line numbers
        this.editor.addEventListener('input', this.updateLineNumbers.bind(this));
        this.editor.addEventListener('scroll', this.synchronizeScroll.bind(this));
    }

    updateCursorPosition() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = this.editor.getBoundingClientRect();

        const position = {
            x: rect.left - editorRect.left,
            y: rect.top - editorRect.top
        };

        wsHandler.sendCursorUpdate(position);
    }

    updateLineNumbers() {
        const content = this.editor.innerText;
        const lines = content.split('\n');
        const lineNumbers = document.getElementById('lineNumbers');
        
        lineNumbers.innerHTML = lines
            .map((_, index) => `<div>${index + 1}</div>`)
            .join('');
    }

    synchronizeScroll() {
        const lineNumbers = document.getElementById('lineNumbers');
        lineNumbers.scrollTop = this.editor.scrollTop;
    }
}

// Initialize editor
const editor = new Editor();

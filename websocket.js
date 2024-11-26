class WebSocketHandler {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.statusElement = document.getElementById('connectionStatus');
        this.cursorsContainer = document.getElementById('cursorsContainer');
        this.cursors = {};
    }

    connect(fileId) {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(`ws://your-backend-url/file/${fileId}`);
        
        this.ws.onopen = () => {
            this.connected = true;
            this.updateStatus();
        };

        this.ws.onclose = () => {
            this.connected = false;
            this.updateStatus();
            // Attempt to reconnect after 5 seconds
            setTimeout(() => this.connect(fileId), 5000);
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
    }

    updateStatus() {
        this.statusElement.textContent = this.connected ? 'Connected' : 'Disconnected';
        this.statusElement.className = 'connection-status ' + 
            (this.connected ? 'connected' : 'disconnected');
    }

    handleMessage(data) {
        switch (data.type) {
            case 'file_update':
                this.handleFileUpdate(data);
                break;
            case 'cursor_update':
                this.handleCursorUpdate(data);
                break;
        }
    }

    handleFileUpdate(data) {
        const editor = document.getElementById('editor');
        const content = editor.innerHTML;
        
        if (data.action === 'insert') {
            const before = content.substring(0, data.position);
            const after = content.substring(data.position);
            editor.innerHTML = before + data.text + after;
        } else if (data.action === 'delete') {
            const before = content.substring(0, data.position);
            const after = content.substring(data.position + data.length);
            editor.innerHTML = before + after;
        }
    }

    handleCursorUpdate(data) {
        const { userId, position } = data;
        
        if (!this.cursors[userId]) {
            this.cursors[userId] = document.createElement('div');
            this.cursors[userId].className = 'cursor';
            this.cursors[userId].setAttribute('data-user', `User ${userId}`);
            this.cursorsContainer.appendChild(this.cursors[userId]);
        }

        this.cursors[userId].style.left = position.x + 'px';
        this.cursors[userId].style.top = position.y + 'px';
    }

    sendEdit(position, text, action = 'insert') {
        if (!this.connected) return;

        const message = {
            type: 'file_update',
            action,
            position,
            text,
            timestamp: Date.now()
        };

        this.ws.send(JSON.stringify(message));
    }

    sendCursorUpdate(position) {
        if (!this.connected) return;

        const message = {
            type: 'cursor_update',
            position,
            timestamp: Date.now()
        };

        this.ws.send(JSON.stringify(message));
    }
}

// Initialize WebSocket handler
const wsHandler = new WebSocketHandler();

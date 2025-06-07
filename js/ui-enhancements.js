// UI Enhancements for Git Visualizer

class GitVisualizerUI {
    constructor() {
        this.svgContainer = document.querySelector('.svg-container');
        this.minimap = document.querySelector('.minimap');
        this.commandLog = document.querySelector('.command-log');
        this.zoomLevel = 1;
        this.isDarkMode = false;
        this.showRemotes = true;
        
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupZoomControls();
        this.setupMinimap();
        this.setupCommandLog();
        this.setupRemoteToggle();
        this.setupTooltips();
    }

    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<svg class="theme-icon" viewBox="0 0 24 24" width="24" height="24"><path class="moon" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/><path class="sun" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        
        themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
            themeToggle.querySelector('.moon').style.display = this.isDarkMode ? 'none' : 'block';
            themeToggle.querySelector('.sun').style.display = this.isDarkMode ? 'block' : 'none';
        });

        document.body.appendChild(themeToggle);
    }

    setupZoomControls() {
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-out" aria-label="Zoom out">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M19 13H5v-2h14v2z"/>
                </svg>
            </button>
            <button class="zoom-reset" aria-label="Reset zoom">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z"/>
                </svg>
            </button>
            <button class="zoom-in" aria-label="Zoom in">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
            </button>
        `;

        const zoomIn = zoomControls.querySelector('.zoom-in');
        const zoomOut = zoomControls.querySelector('.zoom-out');
        const zoomReset = zoomControls.querySelector('.zoom-reset');

        zoomIn.addEventListener('click', () => {
            this.zoom(1.2);
            this.updateZoomButtons();
        });

        zoomOut.addEventListener('click', () => {
            this.zoom(0.8);
            this.updateZoomButtons();
        });

        zoomReset.addEventListener('click', () => {
            this.zoom(1);
            this.updateZoomButtons();
        });

        document.body.appendChild(zoomControls);
    }

    updateZoomButtons() {
        const zoomIn = document.querySelector('.zoom-in');
        const zoomOut = document.querySelector('.zoom-out');
        const zoomReset = document.querySelector('.zoom-reset');

        // Enable/disable buttons based on zoom level
        zoomIn.style.opacity = this.zoomLevel < 2 ? '1' : '0.5';
        zoomOut.style.opacity = this.zoomLevel > 0.5 ? '1' : '0.5';
        zoomReset.style.opacity = this.zoomLevel !== 1 ? '1' : '0.5';

        // Add/remove disabled attribute
        zoomIn.style.pointerEvents = this.zoomLevel < 2 ? 'auto' : 'none';
        zoomOut.style.pointerEvents = this.zoomLevel > 0.5 ? 'auto' : 'none';
        zoomReset.style.pointerEvents = this.zoomLevel !== 1 ? 'auto' : 'none';
    }

    setupMinimap() {
        if (!this.minimap) {
            this.minimap = document.createElement('div');
            this.minimap.className = 'minimap';
            document.body.appendChild(this.minimap);
        }

        // Create minimap content
        const minimapContent = document.createElement('div');
        minimapContent.className = 'minimap-content';
        this.minimap.appendChild(minimapContent);

        // Update minimap on scroll
        this.svgContainer.addEventListener('scroll', () => this.updateMinimap());
    }

    setupCommandLog() {
        if (!this.commandLog) {
            this.commandLog = document.createElement('div');
            this.commandLog.className = 'command-log';
            document.body.appendChild(this.commandLog);
        }

        // Subscribe to Git command events
        window.addEventListener('gitCommand', (e) => {
            this.addCommandToLog(e.detail);
        });
    }

    setupRemoteToggle() {
        const remoteToggle = document.createElement('button');
        remoteToggle.className = 'remote-toggle';
        remoteToggle.innerHTML = '🌐 Toggle Remotes';
        remoteToggle.setAttribute('aria-label', 'Toggle remote branches');
        
        remoteToggle.addEventListener('click', () => {
            this.showRemotes = !this.showRemotes;
            this.toggleRemoteBranches();
        });

        document.body.appendChild(remoteToggle);
    }

    setupTooltips() {
        // Add tooltips to commit nodes
        document.querySelectorAll('circle.commit').forEach(commit => {
            const commitData = this.getCommitData(commit);
            commit.setAttribute('data-tooltip', this.formatCommitTooltip(commitData));
        });
    }

    // Utility Methods
    zoom(factor) {
        const oldZoom = this.zoomLevel;
        this.zoomLevel *= factor;
        this.zoomLevel = Math.min(Math.max(0.5, this.zoomLevel), 2);
        
        if (oldZoom !== this.zoomLevel) {
            this.svgContainer.style.transform = `scale(${this.zoomLevel})`;
            this.svgContainer.style.transformOrigin = 'center center';
            this.updateMinimap();
        }
    }

    updateMinimap() {
        const minimapContent = this.minimap.querySelector('.minimap-content');
        if (!minimapContent) return;

        const scale = this.minimap.offsetWidth / this.svgContainer.scrollWidth;
        minimapContent.style.transform = `scale(${scale})`;
        minimapContent.style.transformOrigin = 'top left';
    }

    addCommandToLog(command) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.textContent = command;
        this.commandLog.insertBefore(entry, this.commandLog.firstChild);
    }

    toggleRemoteBranches() {
        document.querySelectorAll('.remote-branch').forEach(branch => {
            branch.style.display = this.showRemotes ? 'block' : 'none';
        });
    }

    getCommitData(commit) {
        // Extract commit data from the DOM
        const id = commit.getAttribute('data-id');
        const message = commit.getAttribute('data-message');
        const author = commit.getAttribute('data-author');
        const date = commit.getAttribute('data-date');
        
        return { id, message, author, date };
    }

    formatCommitTooltip(commitData) {
        return `
            Commit: ${commitData.id}
            Message: ${commitData.message}
            Author: ${commitData.author}
            Date: ${commitData.date}
        `.trim();
    }
}

// Initialize UI enhancements when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gitVisualizerUI = new GitVisualizerUI();
}); 
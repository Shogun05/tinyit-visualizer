// UI Enhancements for Git Visualizer

define(['d3'], function(d3) {
  "use strict";

  function GitVisualizerUI() {
    this.zoomLevel = 1;
    this.minZoom = 0.5;
    this.maxZoom = 2;
    this.zoomStep = 0.1;
    this.isDarkMode = false;
    this.showRemotes = true;
  }

  GitVisualizerUI.prototype.init = function() {
    this.setupThemeToggle();
    this.setupZoomControls();
    // Only call setupMinimap if it's enabled in config
    if (this.config && this.config.enableMinimap) {
      this.setupMinimap();
    }
    this.setupCommandLog();
    return this;
  };

  GitVisualizerUI.prototype.setupThemeToggle = function() {
    var body = d3.select('body');
    var themeToggle = d3.select('body')
      .append('button')
      .attr('class', 'theme-toggle')
      .attr('title', 'Toggle dark/light theme')
      .html('<svg class="theme-icon moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>' +
            '<svg class="theme-icon sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>');

    themeToggle.on('click', function() {
      var theme = body.attr('data-theme') === 'dark' ? 'light' : 'dark';
      body.attr('data-theme', theme);
      
      // Save preference
      try {
        localStorage.setItem('gitVisTheme', theme);
      } catch (e) {
        console.warn('Could not save theme preference:', e);
      }
    });

    // Check saved preference
    try {
      var savedTheme = localStorage.getItem('gitVisTheme');
      if (savedTheme) {
        body.attr('data-theme', savedTheme);
      }
    } catch (e) {
      console.warn('Could not read theme preference:', e);
    }
  };

  GitVisualizerUI.prototype.setupZoomControls = function() {
    var ui = this;
    var zoomControls = d3.select('body')
      .append('div')
      .attr('class', 'zoom-controls');

    var zoomIn = zoomControls.append('button')
      .attr('class', 'zoom-in')
      .attr('title', 'Zoom in')
      .html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>');

    var zoomOut = zoomControls.append('button')
      .attr('class', 'zoom-out')
      .attr('title', 'Zoom out')
      .html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13H5v-2h14z"/></svg>');

    var zoomReset = zoomControls.append('button')
      .attr('class', 'zoom-reset')
      .attr('title', 'Reset zoom')
      .html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 12l-4.5 4.5 1.41 1.41L9 14.83V21h2v-6.17l3.09 3.09 1.41-1.41L11 12l4.5-4.5-1.41-1.41L11 9.17V3H9v6.17L5.91 6.08 4.5 7.5 9 12z"/></svg>');

    zoomIn.on('click', function() {
      if (ui.zoomLevel < ui.maxZoom) {
        ui.zoomLevel += ui.zoomStep;
        ui.applyZoom();
      }
    });

    zoomOut.on('click', function() {
      if (ui.zoomLevel > ui.minZoom) {
        ui.zoomLevel -= ui.zoomStep;
        ui.applyZoom();
      }
    });

    zoomReset.on('click', function() {
      ui.zoomLevel = 1;
      ui.applyZoom();
    });
  };

  GitVisualizerUI.prototype.applyZoom = function() {
    var svgContainer = document.querySelector('.svg-container');
    if (!svgContainer) return;
    
    svgContainer.style.transform = 'scale(' + this.zoomLevel + ')';
    svgContainer.style.transformOrigin = 'top left';
  };

  GitVisualizerUI.prototype.setupMinimap = function() {
    // Safely select the element before adding event listeners
    var svgContainer = document.querySelector('.svg-container');
    if (!svgContainer) {
      console.warn('SVG Container not found for minimap');
      return;
    }

    var minimapContainer = d3.select('body')
      .append('div')
      .attr('class', 'minimap')
      .style('display', 'none'); // Hide initially until content is ready

    // Safe event listener addition
    try {
      svgContainer.addEventListener('scroll', function() {
        // Update minimap view position
        if (minimapContainer && minimapContainer.node()) {
          // Minimap logic here
        }
      });
    } catch (e) {
      console.warn('Error setting up minimap:', e);
    }
  };

  GitVisualizerUI.prototype.setupCommandLog = function() {
    var commandLog = d3.select('body')
      .append('div')
      .attr('class', 'command-log');

    window.addEventListener('gitCommand', function(e) {
      if (e.detail) {
        var timestamp = new Date().toLocaleTimeString();
        commandLog.append('div')
          .attr('class', 'entry')
          .html('<span class="timestamp">' + timestamp + '</span> ' +
                '<span class="command">' + e.detail + '</span>');
        
        // Limit entries
        var entries = commandLog.selectAll('.entry').nodes();
        if (entries.length > 10) {
          d3.select(entries[0]).remove();
        }
      }
    });
  };

  // Initialize UI when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    try {
      window.gitUI = new GitVisualizerUI();
      window.gitUI.init();
    } catch (e) {
      console.error('Error initializing UI:', e);
    }
  });

  return GitVisualizerUI;
});
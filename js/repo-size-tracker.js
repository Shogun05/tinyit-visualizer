define(['d3'], function(d3) {
  "use strict";

  // Repository size tracker
  function RepoSizeTracker() {
    this.visualizerSize = 0;
    this.gitRepoSize = 0;
    this.container = null;
  }

  RepoSizeTracker.prototype = {
    // Initialize the tracker UI
    init: function(parentContainer) {
      this.container = d3.select(parentContainer)
        .append('div')
        .attr('class', 'repo-size-tracker');

      this.container.append('h3')
        .text('Repository Size Comparison');

      this.container.append('div')
        .attr('class', 'size-comparison-container')
        .html('<div class="size-box tinyit-size"><h4>Tinyit Visualizer</h4><span class="size-value">0 bytes</span></div>' + 
              '<div class="size-box git-size"><h4>Real Git Repository</h4><span class="size-value">0 bytes</span></div>');

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .repo-size-tracker {
          position: fixed;
          top: 60px;
          right: 20px;
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1rem;
          box-shadow: var(--shadow-md);
          z-index: 1000;
          width: 300px;
        }
        .repo-size-tracker h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          text-align: center;
        }
        .size-comparison-container {
          display: flex;
          justify-content: space-between;
        }
        .size-box {
          flex: 1;
          padding: 0.5rem;
          text-align: center;
          border-radius: 0.25rem;
        }
        .size-box h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }
        .tinyit-size {
          background-color: var(--primary-light);
          margin-right: 0.5rem;
        }
        .git-size {
          background-color: var(--secondary-light);
        }
        .size-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);

      return this;
    },

    // Update the visualizer repo size
    updateVisualizerSize: function(commitData) {
      // Calculate approximate size based on number of commits and complexity
      let size = 0;
      
      if (commitData) {
        // Estimate size similar to how Git stores objects
        // Each commit is roughly 200 bytes
        const commitCount = commitData.length;
        size = commitCount * 200;
        
        // Add size for branches and tags
        const tagCount = commitData.reduce((count, commit) => count + (commit.tags ? commit.tags.length : 0), 0);
        size += tagCount * 50;
      }
      
      this.visualizerSize = size;
      this.updateDisplay();
      return this;
    },

    // Update the Git repo size (would normally come from a real Git repo)
    updateGitRepoSize: function(size) {
      this.gitRepoSize = size;
      this.updateDisplay();
      return this;
    },

    // Update the display with current sizes
    updateDisplay: function() {
      if (!this.container) return this;
      
      const formatSize = function(bytes) {
        if (bytes === 0) return '0 bytes';
        const k = 1024;
        const sizes = ['bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      this.container.select('.tinyit-size .size-value')
        .text(formatSize(this.visualizerSize));
      
      this.container.select('.git-size .size-value')
        .text(formatSize(this.gitRepoSize));
        
      return this;
    },
    
    // Track Git operations to simulate size impact
    trackOperation: function(operation, data) {
      const sizeImpact = this.calculateOperationSizeImpact(operation, data);
      this.gitRepoSize += sizeImpact;
      this.updateDisplay();
      
      // Log simulated git command execution
      this.logGitCommand(operation, data, sizeImpact);
      
      return this;
    },
    
    // Calculate how much a Git operation would impact repo size
    calculateOperationSizeImpact: function(operation, data) {
      let impact = 0;
      
      switch(operation) {
        case 'commit':
          // A new commit with message, author info, timestamps
          impact = 250; // Base size
          if (data && data.message) {
            impact += data.message.length; // Message adds to size
          }
          break;
          
        case 'branch':
          // New branch reference is small
          impact = 40;
          break;
          
        case 'tag':
          // Tags are similar to branches but can contain messages
          impact = 60;
          if (data && data.annotated) {
            impact += 100; // Annotated tags are larger
          }
          break;
          
        case 'merge':
          // Merges create a new commit
          impact = 300;
          break;
          
        case 'rebase':
          // Rebases rewrite commits, can temporarily increase size
          impact = data && data.commits ? data.commits * 300 : 500;
          break;
          
        case 'gc':
          // Git garbage collection compresses and optimizes
          impact = -1 * (this.gitRepoSize * 0.2); // Reduce by 20%
          break;
          
        default:
          impact = 0;
      }
      
      return impact;
    },
    
    // Log simulated Git command execution
    logGitCommand: function(operation, data, sizeImpact) {
      const timestamp = new Date().toISOString();
      const sizeChange = sizeImpact >= 0 ? `+${sizeImpact}` : sizeImpact;
      const command = this.formatGitCommand(operation, data);
      
      console.log(`[${timestamp}] Simulated: ${command} (size impact: ${sizeChange} bytes)`);
      
      return this;
    },
    
    // Format a git command string based on the operation
    formatGitCommand: function(operation, data) {
      switch(operation) {
        case 'commit':
          return `git commit -m "${data && data.message ? data.message : 'commit'}"`;
        case 'branch':
          return `git branch ${data && data.name ? data.name : 'new-branch'}`;
        case 'tag':
          return `git tag ${data && data.annotated ? '-a' : ''} ${data && data.name ? data.name : 'v1.0.0'}`;
        case 'merge':
          return `git merge ${data && data.branch ? data.branch : 'feature-branch'}`;
        case 'rebase':
          return `git rebase ${data && data.target ? data.target : 'master'}`;
        case 'gc':
          return 'git gc';
        default:
          return `git ${operation}`;
      }
    },
    
    // Method to get actual Git repo size via a backend API
    fetchActualRepoSize: function() {
      // In a real implementation, this would make an API call to a backend service
      // that executes `git count-objects -v` and returns the size
      
      // Simulate an API call with a timeout
      const self = this;
      console.log("Fetching actual Git repository size...");
      
      setTimeout(function() {
        // Simulate response from backend
        const mockResponse = {
          success: true,
          size_in_bytes: self.gitRepoSize + Math.floor(Math.random() * 1024),
          objects: {
            count: Math.floor(self.gitRepoSize / 200),
            size: self.gitRepoSize,
            in_pack: Math.floor(self.gitRepoSize / 300),
            packs: Math.floor(self.gitRepoSize / 10000) + 1,
            size_pack: Math.floor(self.gitRepoSize * 0.8)
          },
          command_output: `count: ${Math.floor(self.gitRepoSize / 200)}\nsize: ${Math.floor(self.gitRepoSize / 1024)} KiB\nin-pack: ${Math.floor(self.gitRepoSize / 300)}\nsize-pack: ${Math.floor(self.gitRepoSize * 0.8 / 1024)} KiB`
        };
        
        console.log("Git repository statistics:", mockResponse.command_output);
        self.updateGitRepoSize(mockResponse.size_in_bytes);
      }, 500);
      
      return this;
    },

    // Simulate updating the Git repo size based on the visualizer
    simulateGitRepoSize: function(commitData) {
      // Real Git repos have more overhead and compression
      let gitSize = 0;
      
      if (commitData) {
        const commitCount = commitData.length;
        
        // Git objects (commits, trees, blobs)
        const blobSize = 200; // Average file size
        const commitSize = 250; // Average commit metadata size
        const treeSize = 100; // Average tree object size
        
        // Estimate number of files per commit (more realistic)
        const filesPerCommit = 5;
        
        // Calculate base size
        gitSize = commitCount * commitSize; // Commits
        gitSize += commitCount * treeSize; // Trees
        gitSize += commitCount * filesPerCommit * blobSize; // Blobs
        
        // Add size for refs and tags
        const tagCount = commitData.reduce((count, commit) => count + (commit.tags ? commit.tags.length : 0), 0);
        gitSize += tagCount * 40;
        
        // Pack compression (Git is efficient with storage)
        const compressionRatio = 0.6; // 40% compression
        gitSize = Math.round(gitSize * compressionRatio);
        
        // Add overhead for Git internals
        gitSize += 1024; // ~1KB for basic Git structure (refs, HEAD, config)
        
        // Execute simulated git command to show what would be run
        console.log("Simulated: git count-objects -v");
        console.log(`count: ${commitCount * (1 + filesPerCommit)}`);
        console.log(`size: ${Math.round(gitSize / 1024)} KiB`);
        console.log(`in-pack: ${commitCount * filesPerCommit}`);
        console.log(`size-pack: ${Math.round(gitSize * 0.8 / 1024)} KiB`);
      }
      
      // Update the size
      this.updateGitRepoSize(gitSize);
      
      // Optionally, fetch actual size from backend
      // Uncomment to enable when backend is available
      // this.fetchActualRepoSize();
      
      return this;
    }
  };

  return RepoSizeTracker;
});

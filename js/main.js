if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

if (!Array.isArray) {
  Array.isArray = function(vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}

require.config({
  paths: {
    'd3': 'vendor/d3',
    'explaingit': 'explaingit',
    'demos': 'demos',
    'ui-enhancements': 'ui-enhancements',
    'md5': 'md5',
    'repo-size-tracker': 'repo-size-tracker'
  },
  shim: {
    'd3': {
      exports: 'd3'
    }
  }
});

require(['explaingit', 'demos', 'ui-enhancements', 'md5', 'repo-size-tracker'], 
function (explainGit, demos, ui, md5, RepoSizeTracker) {
    // Create instance of the repo size tracker
    var repoSizeTracker = new RepoSizeTracker();
    
    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function clearSavedState() {
        if (window.localStorage) {
            window.localStorage.removeItem('git-viz-snapshot');
        }
    }

    function cleanupDom() {
        $('.svg-container.remote-container').remove();
        // Also remove any existing heading when cleaning up
        document.querySelector('.visualizer-heading')?.remove();
        // Remove size tracker if it exists
        document.querySelector('.repo-size-tracker')?.remove();
    }

    function clean() {
        clearSavedState();
        cleanupDom();
    }

    function cleanHash(hash) {
        return hash.replace(/^#/, '');
    }

    function findDemo(demos, name) {
        return demos.filter(function (d) {
            return d.key === name;
        })[0];
    }

    function copyDemo(demo) {
        return JSON.parse(JSON.stringify(demo));
    }

    var lastDemo = findDemo(demos, cleanHash(window.location.hash)) || demos[0];

    ready(function () {
        window.onhashchange = function () {
            var demo = findDemo(demos, cleanHash(window.location.hash)) || lastDemo;
            if (demo) {
                lastDemo = demo;
                document.getElementById('last-command').textContent = "";
                clean();
                open();
            }
        };

        open();
    });

    function open() {
        explainGit.reset();

        // Add the heading
        const heading = document.createElement('h1');
        heading.className = 'visualizer-heading';
        heading.textContent = 'Tinyit Visualizer';
        document.body.appendChild(heading);
        
        // Initialize the repo size tracker
        setTimeout(function() {
            repoSizeTracker.init(document.body);
        }, 500);

        var savedState = null;
        if (window.localStorage) {
            savedState = JSON.parse(window.localStorage.getItem('git-viz-snapshot') || 'null');
        }

        var initial = Object.assign(copyDemo(lastDemo), {
            name: 'Zen',
            height: '100%',
            initialMessage: lastDemo.message,
            undoHistory: savedState,
            hvSavedState: savedState && savedState.stack[savedState.pointer].hv,
            ovSavedState: savedState && savedState.stack[savedState.pointer].ov,
            md5: md5 // Pass MD5 module to explainGit
        });

        explainGit.open(initial);

        // Update repo sizes after a short delay to ensure commits are loaded
        setTimeout(function() {
            const historyView = explainGit.historyView;
            if (historyView && historyView.commitData) {
                repoSizeTracker.updateVisualizerSize(historyView.commitData);
                repoSizeTracker.simulateGitRepoSize(historyView.commitData);
            }
        }, 1000);

        // Listen for commit data changes
        window.addEventListener('commitDataChanged', function(e) {
            if (e.detail && e.detail.commitData) {
                repoSizeTracker.updateVisualizerSize(e.detail.commitData);
                repoSizeTracker.simulateGitRepoSize(e.detail.commitData);
            }
        });

        // Dispatch git command event for command log
        window.dispatchEvent(new CustomEvent('gitCommand', {
            detail: `git ${initial.name.toLowerCase()}`
        }));
    }

    window.resetVis = function () {
        if (confirm('This will reset your visualization. Are you sure?')) {
            clean();
            open();
        }
    };

    window.pres = function () {
        document.getElementById('last-command').style.display = 'block';
    };
});

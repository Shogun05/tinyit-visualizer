define([], function () {

  var free = {
    title: 'Free Explore',
    key: 'free',
    message: 'Have fun!',
    gitSize: 2048, // Basic repo with one commit
    visualizerSize: 256, // Simple visualization data
    commitData: [
        {id: 'e137e9b', tags: ['master'], message: 'first commit'},
    ]
  }

  var upstreamChanges = {
    title: 'Upstream Changes',
    key: 'upstream-changes',
    message: 'Someone else has been working here!',
    gitSize: 8192, // Multiple branches and remote tracking
    visualizerSize: 1024, // More complex visualization
    currentBranch: "feature",
    commitData: [
      {
        "id": "e137e9b",
        "tags": [],
        "message": "first commit",
        "parent": "initial",
      },
      {
        "id": "84c98fe",
        "parent": "e137e9b",
        "tags": [ "master", "origin/master" ],
      },
      {
        "id": "1c016b6",
        "parent": "e137e9b",
        "tags": [ "feature", "origin/feature", "HEAD" ],
      }
    ],
    originData: [
      {
        "id": "e137e9b",
        "tags": [],
        "message": "first commit",
        "parent": "initial",
      },
      {
        "id": "84c98fe",
        "parent": "e137e9b",
        "tags": [ "master", "HEAD" ],
      },
      {
        "id": "1c016b6",
        "parent": "e137e9b",
        "tags": [],
      },
      {
        "id": "fd0af32",
        "tags": [ "feature" ],
        "parent": "1c016b6",
      }
    ]
  }

  var rewrittenHistory = {
    title: 'Rewritten Remote History',
    key: 'rewritten-history',
    message: 'Someone force-pushed and re-wrote history on the remote!',
    gitSize: 15360, // Complex history with rewrites and orphaned commits
    visualizerSize: 2048, // Heavy visualization data
    currentBranch: "feature",
    commitData: [
      {
        "id": "e137e9b",
        "tags": [],
        "message": "first commit",
        "parent": "initial",
        "cx": 50,
        "cy": 330,
        "branchless": false
      },
      {
        "id": "84c98fe",
        "parent": "e137e9b",
        "tags": [
          "master",
          "origin/master"
        ],
        "cx": 140,
        "cy": 330,
        "branchless": false
      },
      {
        "id": "1c016b6",
        "parent": "e137e9b",
        "tags": [],
        "cx": 140,
        "cy": 240,
        "branchless": false
      },
      {
        "id": "fd0af32",
        "parent": "1c016b6",
        "tags": [],
        "cx": 230,
        "cy": 240,
        "branchless": false
      },
      {
        "id": "5041e4c",
        "tags": [
          "feature",
          "origin/feature",
          "HEAD"
        ],
        "parent": "fd0af32",
        "cx": 320,
        "cy": 240,
        "branchless": false
      }
    ],
    originData: [
      {
        "id": "e137e9b",
        "tags": [],
        "message": "first commit",
        "parent": "initial",
        "cx": 50,
        "cy": 360,
        "branchless": false
      },
      {
        "id": "84c98fe",
        "parent": "e137e9b",
        "tags": [
          "master"
        ],
        "cx": 140,
        "cy": 360,
        "branchless": false
      },
      {
        "id": "1c016b6",
        "parent": "e137e9b",
        "tags": [],
        "cx": 140,
        "cy": 270,
        "branchless": false
      },
      {
        "id": "fd0af32",
        "tags": [
          "feature",
          "HEAD"
        ],
        "parent": "1c016b6",
        "cx": 230,
        "cy": 270,
        "branchless": false
      },
      {
        "id": "5041e4c",
        "tags": [],
        "parent": "fd0af32",
        "cx": 320,
        "cy": 270,
        "branchless": true
      }
    ]

  }

  var cherryPick = {
    title: 'Cherry Pick',
    key: 'cherry-pick',
    message: 'Let\'s pick some commits',
    gitSize: 12288, // Multiple branches with selective commits
    visualizerSize: 1792, // Complex branching visualization
    commitData: [
      {
        "id": "e137e9b",
        "tags": [],
        "message": "first commit",
        "parent": "initial",
        "cx": 50,
        "cy": 318,
        "branchless": false
      },
      {
        "id": "790dd94",
        "tags": [],
        "parent": "e137e9b",
        "cx": 140,
        "cy": 318,
        "branchless": false
      },
      {
        "id": "96e9ce7",
        "tags": [
          "[bugfix1]"
        ],
        "parent": "790dd94",
        "cx": 230,
        "cy": 318,
        "branchless": false
      },
      {
        "id": "44db644",
        "tags": [],
        "parent": "96e9ce7",
        "cx": 320,
        "cy": 318,
        "branchless": false
      },
      {
        "id": "06127d7",
        "tags": [],
        "parent": "44db644",
        "cx": 410,
        "cy": 318,
        "branchless": false
      },
      {
        "id": "60c6c2c",
        "tags": [],
        "parent": "790dd94",
        "cx": 230,
        "cy": 228,
        "branchless": false
      },
      {
        "id": "8f7c801",
        "tags": [
          "release",
          "HEAD"
        ],
        "parent": "60c6c2c",
        "cx": 320,
        "cy": 228,
        "branchless": false
      },
      {
        "id": "78ecb32",
        "tags": [],
        "parent": "44db644",
        "cx": 410,
        "cy": 228,
        "branchless": false
      },
      {
        "id": "12e9bbb",
        "tags": [
          "bugfix2"
        ],
        "parent": "78ecb32",
        "cx": 500,
        "cy": 228,
        "branchless": false
      },
      {
        "id": "e8ce346",
        "tags": [],
        "parent": "06127d7",
        "cx": 500,
        "cy": 318,
        "branchless": false
      },
      {
        "parent2": "12e9bbb",
        "id": "5749661",
        "tags": [
          "master"
        ],
        "message": "Merge",
        "parent": "e8ce346",
        "cx": 590,
        "cy": 318,
        "branchless": false
      }
    ]
  }

  var rebase = {
    title: 'Rebasing',
    key: 'rebase',
    message: 'Try rebasing the `feature` branch',
    gitSize: 4096, // Medium repo for rebase demonstration
    visualizerSize: 512, // Moderate visualization complexity
    commitData: [
        {id: 'e137e9b', tags: ['master'], message: 'first commit'}
    ]
  }

  return [
    free, upstreamChanges, rewrittenHistory, cherryPick
  ]
})

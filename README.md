# Veera

An entirely new and rewritten Granblue companion based on the Ancheera concept.
Keep track of supplies, plan weapon crafts, analyze battle & GW data, and more.

# About

Veera is a QoL extension. It does not modify anything about the game, its data, browser page, UI, requests, nor overlays anything.
All it does is read and display game traffic for ease of use, or loads it from its own local storage.
Some of this data, or Veera's funtionality based on it, is not readily available through the game UI (obviously, this is kind of the point) but this does not change the above.

It tries to be as passive as possible, minimizing out of order requests and server load.
For some features, this may not be possible. In such cases the feature is determined to be useful enough and the load/risk minimal, and/or initiated explicitly by the user.
Even so Veera will usually not behave much different from bookmarks, for example.

__WARNING: Regardless of how low the risk is, it is still an unofficial tool and thus technically against TOS.__

# Development

* Still a WIP so parts don't work, features are missing. Help is appreciated.
  * It will eventually be a normal, updatable extension. Probably. Maybe.
* Check Issues page for things to work on, file bug reports, etc.
* Feature requests are alright but they'll take a while as core functionality is the current priority.
* ~~Also I'm lazy so updates are slow.~~

# Installation & Usage

1. Download or clone the repo into a folder.
   * Cloning allows easy updating during dev phase.
2. In your Chrome extensions page, click "Load unpacked extension..." and point to the repo folder.
   * Make sure developer mode is enabled if you don't see the button.
   * To recompile after changes, hit the reload button beneath the extension.
1. Load granblue and hit F12 to bring up the Chrome devtools.
2. Navigate to the Veera tab.

# About

An entirely new and rewritten Granblue companion based on the Ancheera concept.

**Current features:**

- JST and countdown timers.
- Track and filter supplies and raids, with quick-hosting.
- Plan & follow up on weapon crafts.
- Real-time battle statistics for team and characters.
- Analyze GW area honors for betting. (RIP)
- Show immediate quest/raid drops and nightmare triggers.
- Display and track currencies, tickets, pendants, etc.
- Tooltips with farm locations for commonly used craft items.

# Disclaimer

Veera is a QoL extension. It does not modify anything about the game, its data, browser page, UI, requests, nor overlays anything.  
All it does is read and display game traffic for ease of use, or loads it from its own local storage.  

It tries to be as passive as possible, minimizing requests to the server, or anything out of the ordinary.  
For some features, this may not be possible. In such cases the feature is determined to be useful enough and the load/risk minimal, and/or initiated explicitly by the user.  
Even so Veera will usually not behave much different from bookmarks, for example.

The UI tries to be modular and adaptive. This can cause some weird behaviour at times.  
It also hasn't been a priority, excuse the mess.

Note that Veera is currently a WIP.

__WARNING: Regardless of how low the risk is, it is still an unofficial tool and thus technically against TOS.__

# Development

I am doing this in large part as an educational experience, please don't expect too much.

* Still a WIP so parts don't work, features are missing. Help is appreciated.
  * It will eventually be a normal, updatable extension. Probably. Maybe.
* Check the Issues page for things to work on, file bug reports, PRs, etc.
  * Feature requests are alright but they'll take a while as core functionality is the current priority.
* The wiki is (should be) open for anyone to edit. Feel free to document usage, code, or whatever there.
* ~~Also I'm lazy so updates are slow.~~
* It's not forked from Ancheera or Orcheed because I wasn't aware of their github back then. My bad.
  * I guess it doesn't really matter, especially now that Veera is its own thing but I wanted to clarify anyway.
  
Data is initialized from specific pages and afterwards updated whenever a change is detected.  
File an issue if a change to something that is tracked is not detected.

If you have any issues, the background page (accessible through chrome's extension page) is the first place to look.  
If this doesn't help you solve it yourself, please include (at least) any errors and warnings there in your issue submission.

# Installation & Usage

1. Download or clone the repo into a folder.
   * Cloning allows easy updating during this early phase.
2. In your Chrome extensions page, click "Load unpacked extension..." and point to the repo folder.
   * Make sure developer mode is enabled if you don't see the button.
   * To recompile after changes, hit the reload button beneath the extension.
1. Load granblue and hit F12 to bring up the Chrome devtools.
2. Navigate to the Veera tab.
3. On first install it is recommended to visit the supplies page in-game once to load its data.
   * As Veera is passive this is true for any used page but supplies are common and things will get funky with them missing.

Note that Veera can't track things if it is not active (the UI must be loaded).
If any desync happens it can be fixed by visiting the relevant in-game page in most cases.

# Thanks to

- @Thessiah for the original Ancheera, which has seen much use.
- The Orcheed author for extending Ancheera's lifetime and inciting my attempt.
- My crew and github contributors for their assistance.

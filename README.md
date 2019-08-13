# About

An entirely new and rewritten Granblue companion based on the Ancheera concept.

**Current features:**

- JST and countdown timers with ST notifications.
- Track and filter supplies and raids, with quick-hosting and easy requirement checking.
- Plan & follow up on weapon, summon and other crafts.
- Real-time battle statistics for team and characters, with log.
- Real-time-ish boss information. (turn-based because of current technical limitations)
- ~~Analyze GW area honors for betting. (RIP)~~
- Show immediate quest/raid drops and nightmare triggers for farming.
- Quickly repeat last quest or play triggered ones.
- Display and track currencies, tickets, pendants, etc.
- Tooltips with farm locations for commonly used craft items.
- Quick navigation to common screens.
- Check last used support summon and go to user's profile.
- More features & tools coming...

# Disclaimer

__WARNING: Regardless of how low the risk is, Veera is still an unofficial tool and thus against TOS.__

Veera is a WIP which means bugs, inefficiencies, regular changes, and the occasional DIY.

Veera is a QoL extension. It does not modify anything about the game, its data, browser page, UI, requests, nor overlays anything.  
It only reads and displays game traffic for ease of use, or loads it from its own local storage.

Veera tries to be passive, minimizing traffic and odd behaviour.  
Where not possible, the load/risk is minimal and/or initiated explicitly by the user.  
Even then Veera will usually not behave much different from bookmarks, for example.

The UI tries to be modular and adaptive. Excuse the occasional weird behaviour as it hasn't been a priority.

# Installation & Usage

1. Download or clone the repo into a folder.
   * If using ZIP download, extract and overwrite your current folder to update.
   * Since v1.3.2 Veera will notify about updates; once for commits, every startup for releases.
2. In your Chrome extensions page, click "Load unpacked" and point to the repo folder.
   * Make sure developer mode is enabled if you don't see the button.
   * To recompile after changes, hit the reload button beneath the extension.
   * If you don't want the developer notification when you start Chrome, use the "pack extension" button on said page and use the result. You will have to repeat this for every update.
1. Load Granblue and hit F12 to bring up the Chrome devtools.
2. Navigate to the Veera tab.
   * You can re-order the tabs here if you wish.
3. NEW USERS: On first install it is recommended to visit the supplies page in-game once to load its data and restart Veera.

Note that Veera can't track things if it is not active (the UI must be loaded).
If any desync happens it can be fixed by visiting the relevant in-game page in most cases.
Feel free to ask questions on the Issues page. They could even lead to bug fixes or improved functionality.

# Development & Contributing

I am doing this in large part as an educational experience, please don't expect too much.

* The dev side is always in flux and rather unstable.
* Pull Requests for bug fixes, improvements or new features are very welcome.
  * Open one straight up or inquire on the Issues page first.
* File bug reports if you run into trouble.
  * Feature requests will tend to be low priority as I focus on other things for the moment.
* The wiki should be open for anyone to edit. Feel free to document usage, code, or whatever there.
  
Data is initialized from specific pages and afterwards updated whenever a change is detected.  
File an issue if a change to something that is tracked is not detected.

If you have any problems, the background page (accessible through chrome's extension page) is the first place to look.  
If this doesn't help you solve it yourself, `right-click, save as` and attach the log to your issue submission.

# Thanks to

- @Thessiah for the original Ancheera, which has seen much use.
- The Orcheed author for extending Ancheera's lifetime and inciting my attempt.
- My crew and github contributors for their assistance.

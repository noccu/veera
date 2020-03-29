# About

An entirely new and rewritten Granblue companion based on the Ancheera concept.

**Current features:**

- JST, reset, ST, buff timers with notifications.
- Raids tracker, with quick-hosting and requirement checking.
- Various displays for AP/BP, currencies, tickets, pendants, etc.
- Searchable & filterable supplies overview.
- Crafting tracker.
- Battle statistics for team and characters.
- Enemy information. (turn-based because of current technical limitations)
- ~~Analyze GW area honors for betting.~~
- Fast loot/drops display.
- Quick quest repeat or play triggered ones.
- Optional notifications for various events like SSR drops, NM triggers, craft item goals.
- Farm location tooltips. (wip)
- Quick navigation to common screens.
- Link user profile for last used support summon.
- Automatic spark progress calculation.
- More features & tools coming...

# Disclaimer

__WARNING: Regardless of how low the risk is, Veera is still an unofficial tool and thus against TOS.__

Veera is a WIP which means bugs, inefficiencies, regular changes, and the occasional DIY.

Veera is a passive QoL extension. It does not modify anything about the game, its data, browser page, UI, requests, nor overlays anything.  
It only reads and displays game traffic for ease of use, or loads it from its own local storage.  
No requests are made by Veera itself. Chrome loads thumbnails like for a normal page. Raid hosting works with URLs like bookmarks.

# Installation & Usage

1. Download or clone the repo into a folder.
   * Check out the develop branch if you want the absolute latest but possibly buggy updates.
   * If using ZIP download, extract and overwrite your current folder to update.
   * Since v1.3.2 Veera will notify about updates; once for commits, every startup for releases.
2. In your Chrome extensions page, click "Load unpacked" and point to the repo folder.
   * Make sure developer mode is enabled if you don't see the button.
   * To recompile after changes, hit the reload button beneath the extension.
   * To remove the developer notification when you start Chrome, use the "pack extension" button and use its output instead of the folder. That should work, probably. You will have to repeat this for every update.
1. Load Granblue and hit F12 to bring up the Chrome devtools.
2. Navigate to the Veera tab.
   * You can re-order the tabs here if you wish.
3. NEW USERS: On first install it is recommended to visit the supplies page in-game (all tabs) once to load its data and restart Veera.

Note that Veera can't track things if it is not active (the UI must be loaded).
If any desync happens it can be fixed by visiting the relevant in-game page in most cases.
Feel free to ask questions on the Issues page. They could even lead to bug fixes or improved functionality.

# Development & Contributing

I am doing this in large part as an educational experience, please don't expect too much.

* Pull Requests for bug fixes, improvements or new features are very welcome.
* File bug reports if you run into trouble.
* The wiki should be open for anyone to edit. Feel free to do so.
  
Please make all pull requests against the master branch.  
The dev branch is just my personal working branch pushed for preview. It is not intended to be used for anything else.  
If you want to provide feedback another way you can find me on the GBFI discord or Twitter.

If you have any problems, the background page (accessible through chrome's extension page) is the first place to look.  
If this doesn't help you solve it yourself; enable the verbose level, repeat the faulting action, `right-click, save as` and attach the log to your issue submission.

# Thanks to

- @Thessiah for the original Ancheera, which has seen much use.
- The Orcheed author for extending Ancheera's lifetime and inciting my attempt.
- My crew and github contributors for their assistance.

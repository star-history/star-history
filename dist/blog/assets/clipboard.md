_This is the seventh issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project)._

---

# The Clipboard Project – Remember Anything, Anytime, Anywhere at Breakneck Speed

The [Clipboard Project](https://github.com/Slackadays/Clipboard) is a new and upcoming open source tool designed to supercharge your productivity by making it easy to remember anything, anytime, anywhere – as if you had a second brain.😎🏖️🐬

## Motivation

The core idea behind the Clipboard Project is by no means a new one. In fact, there have been many such “clipboard managers” ever since copying and pasting was invented back in the 1970s. However, all of these clipboard managers have had at least one huge gotcha. For example, CopyQ doesn’t allow you to copy more than 10 thousand items. Maccy, another popular one, doesn’t let you copy more than 1000. If you’re using the terminal, then the xclip and wl-clipboard utilities are opaque to use and don’t offer any copy history at all.

## The Solution

### Unlimited History

The Clipboard Project has an unlimited clipboard history. Actually, it offers up to 4 billion entries – likely more than a mortal human could fill in a lifetime – so it may as well be unlimited. Many power users have gotten stuck here with other managers, but not so with Clipboard.

### User Friendly Design

Ever wonder why some things like the iPhone take over the world? One of the most crucial aspects of product design is ease-of-use. If something is hard to use, then no matter how incredible it may be otherwise, its worth to the world is that much lower.

For that reason, the Clipboard Project is carefully made to be user friendly to new users while providing the tools that power users need. All the documentation can be found in one place, everything is atomically done as a single action, and the fine details are handled transparently behind the scenes.

### Advanced Features

The Clipboard Project offers some advanced features such as regex pattern matching and fuzzy search. One likely scenario where you can use these is if you want to not copy passwords. If you can make a regex pattern out of the passwords, then you can use the Ignore action to not copy anything following that pattern.

### Optimized Speed

One of the reasons the Clipboard Project can offer an unlimited history is because it’s been optimized to the moon and back with techniques like multithreading and asynchronous IO. Testing has shown that on a modern system, it only starts getting “slow” (i.e., actions take a second to complete) after copying gigabytes of content with a history hundreds of thousands of entries old. In comparison to some other clipboard managers, which take seconds to process a mere thousand entries, this is a huge improvement.

### Scriptable Actions

Unlike all other non-trivial clipboard managers out there, the Clipboard Project works entirely in the terminal. You can run a “cb copy” command just as if you were clicking “copy” in a web browser. However, you don’t actually have to use it in the terminal. If you’re into writing scripts, then you can instantly copy the output of something for use later, or use it like a buffer. And if you’re more into the traditional graphical manager, then the Clipboard Project offers a JSON API that you can use to serve up the same content as before – to anything that can speak JSON.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Slackadays/Clipboard&type=Date)](https://star-history.com/#Slackadays/Clipboard&Date)

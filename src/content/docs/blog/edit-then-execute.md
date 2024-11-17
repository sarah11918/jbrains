---
title: "Edit, Then Execute"
date: 2021-07-16
tags:
    - Microtechniques
# summary: >
#     If you want the full power of your trusted text editor to
#     compose and edit long shell commands, then you can have it!
---

I used to waste significant energy trying to edit shell commands at the shell command prompt. Yes, [I could use `vi` mode on `readline`](https://www.gnu.org/software/bash/manual/html_node/Readline-vi-Mode.html), but that never quite gave me the same, rich experience. I found it helpful for minor edits, but when someone introduced me to the `edit-and-execute` command, my entire relationship with command-line tools changed. Once I had the full power of my trusted text editor to compose and edit commands, I stopped valuing GUI clients as highly and I started valuing the scriptability of command-line UIs much more.

## Quick Start

If you run `bash` or `zsh` or something similar, then you can probably already do this:

1. Search your history for a command. `$ history`
2. Make a note of the command number---I'm using 1892 as an arbitrary example---then edit that command. `$fc 1892`

This opens a text editor and lets you edit the command. When you save your changes and exit the editor, then the shell executes that edited command. **Be careful!** Whatever you do, `fc` will *automatically* execute your command immediately after you exit the editor. If you saved your changes, then you'd execute the edited command; if you didn't save your changes, then you'd execute the original command. More precisely, you'd execute whichever version of the command you most-recently saved before you exited the editor.

Now that you've seen how `fc` runs, you can see a weakness: you need to execute the original command at least once in order to be able to find it in your history in order to be able to edit it with `fc`. What if you just want to change the command that's currently drafted on your command prompt? What if you just pressed `up` a few times to retrieve a recent command and you want to execute something similar, but not quite the same?

Try this.

1. Draft a command on your prompt. Enter the command, but don't execute it.
2. Press these two keystrokes, one after the other: `ctrl+x` then `ctrl+e`. If you want, hold down the control key while you press first `x`, then `e`. If this does nothing, then try `esc` followed by `v` . (I'll explain below.)

This opens a text editor and lets you edit the command. When you save your changes and exit the editor, then you'll see the edited command in your prompt, waiting for you to execute it. Nice!

## Tweaks

**Which editor does the `edit-and-execute` command open?** You control this by setting the `EDITOR` environment variable. [I have set this to `kak`](https://www.kakoune.org), because I love that editor. If you set nothing, you probably get nano.

**If you have already [set readline to `vi` mode](https://www.gnu.org/software/bash/manual/html_node/Readline-vi-Mode.html)**, then you need to press `esc` followed by `v` . This is the vi command that corresponds to the emacs command `ctrl+x ctrl+e`.

[Moreover, **if you install the `oh-my-zsh` plugin `vi-mode`**](https://github.com/Nyquase/), then you need to press `esc` followed by `v` followed by `v` again. This avoids collision with `esc v`, which enters the familiar `vi` Visual Mode at your command prompt. It took me about a day to get used to typing `esc v v` to edit commands. Fortunately, I do it so often that training myself to remember the new keystrokes didn't take long.

<aside>
Did you find this helpful? I like to teach microtechniques, because of their power to increase our capacity to think about bigger things than merely how to get things done using our fundamental tools. I intend to write more about microtechniques in the coming months, so if you're interested, [read other articles tagged with "microtechniques"](https://blog.thecodewhisperer.com/series#microtechniques) and [subscribe to the RSS feed](/feed) of this blog.
    
</aside>


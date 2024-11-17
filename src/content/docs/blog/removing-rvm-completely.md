---
title: "Removing RVM Completely"
date: 2018-07-14
tags:
  - "The Little Things"
excerpt: >
 I got myself into trouble by installing `rvm` incorrectly. Reading a single article
 did not suffice to get myself out of trouble, so let this become the single article
 that you can use to get yourself out of trouble.
---
I made a silly mistake installing `rvm` on my new Linux laptop. I should mention that I don't really know Linux yet, so that makes me susceptible to making this kind of silly mistake. I accidentally installed `rvm` as a multi-user/system-wide tool, rather than in single-user mode. Since I like the _use the narrowest scope possible_, I wanted to fix this. Of course I also had the problem that `rvm` wouldn't work without `sudo` and that seemed really weird to me. I figured that I should uninstall `rvm` completely and then start again. No problem, right?

# Summary

I wanted to remove an accidental multi-user/system-wide installation of `rvm` on Ubuntu 18.04. I removed all the files in my home directory as well as all the system directories. I removed the initialization commands from my login scripts. I still had some left over in my shell, even though I couldn't find any script setting them. **I had to reboot in order for those environment variables to disappear.**

# Details

Most of the articles I read about how to completely uninstall `rvm`  assumed that I had a single-user installation, so they mostly didn't help. I finally managed to figure out that I needed to delete all the following files/directories:

```bash
$HOME/.rvm
$HOME/.rvmrc
/etc/rvmrc
/etc/profile.d/rvm.sh
/usr/share/rvm
```

I also had to remove all trace of `rvm` from my login shell scripts `.bashrc` and `.zshrc`. I did all this and then tried to reinstall `rvm`.

Nope! When I reinstalled `rvm` it seemed to have the same file permissions problems that led me to unknowingly install it with `sudo` in the first place. After much too much fiddling around, I gradually understood that I probably had some extraneous environment variables somewhere, so I checked.

```bash
$ env | grep rvm
```

Sure enough, I had a handful of `rvm`-related environment variables that affected how `rvm` would install itself. I could simply `unset` these environment variables, but I wanted to ensure that nothing would reset them, so I started to search for which script was setting these environment variables.

None. Nothing. Nothing in my login shell scripts, nothing in `/etc/profile.d`, nothing anywhere. Nothing. I spent an hour trying to find some magic trick to determine where these environment variable values came from. Nothing helped. Since I don't know Linux/unix that well, I assumed that I didn't know something important, so it took far too long before I fell back on some fundamental tricks of desperation.

I logged out and logged back in. The environment variables were still there, even though nobody seemed to be setting them. This made no sense to me at all.

Finally, in the greatest desperation, _I rebooted_. This is Linux. I'm not supposed to need to do this. But it worked! I rebooted, I opened a fresh shell, I typed `env | grep rvm` and got nothing!

From here, I could follow the instructions to install `rvm` for a single user the way I wanted it to work. And now it works. So far, nobody in my social media network has adequately explained why I needed to reboot in order to stop setting those environment variables in my shells.

If you can explain why I needed to reboot in order for a fresh login shell session to stop setting these environment variables, then I would appreciate understanding how this could possibly happen. I don't want to know, but I also don't want to be flummoxed by it in the future. Leave a comment.

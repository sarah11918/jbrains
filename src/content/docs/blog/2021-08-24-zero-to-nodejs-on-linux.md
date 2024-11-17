---
title: "Zero to nodejs on Linux"
date: 2021-08-24
tags:
    - The Little Things
    - Tutorials
summary: >
    A concise guide for going from nothing to a working
    nodejs environment on Linux environments.
---
This is not a step-by-step guide, but more of an overview that can help you stitch together the detailed step-by-step guides out there.

## Overview

- Install `nodejs` and `npm` packages from your distribution's package manager. I'll call this "System nodejs". You'll need `sudo` to interact with it.
- Install `n`, a node version manager, into System nodejs.
- Use `n` to install nodejs versions into your user space. For these versions, you don't need `sudo`.

## Steps

I'm running Pop!\_OS 21.04, which is essentially a flavor of Ubuntu, so this will look very Ubuntu-ish. If you don't use `apt` to install packages, then simply use your package manager.

First, install Node with npm.

```zsh
$ sudo apt-get install nodejs npm
$ node --version    # check that it's installed
```

Next, update your login scripts. I put this in my `.zshrc` (well, eventually---I've refactored).

```zsh
## NPM

# Put NPM packages in homedir
export NPM_PACKAGES="$HOME/.npm-packages"

# Find user-installed node tools
export PATH="$NPM_PACKAGES/bin:$PATH"

# Unset manpath so we can inherit from /etc/manpath via the `manpath` command
unset MANPATH  # delete if you already modified MANPATH elsewhere in your configuration
export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"

# Tell Node about these packages
export NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
```

Install n, the annoyingly-named-but-delightful node version manager.

```zsh
$ sudo npm install n --global
$ n --version
```

Next, update your login scripts again to know about n. I added this:

```zsh
# Use n to manage node installations in place of NVM
# https://github.com/tj/n
export N_PREFIX="$HOME/.n"
export PATH="$N_PREFIX/bin:$PATH"
```

Now you can install any version of nodejs without messing up System nodejs.

```zsh
$ n latest    # switch to the latest version and installed it if it's missing
$ n           # list the installed versions
```

## References

["How to Install Node.js and npm on Ubuntu Linux"](https://itsfoss.com/install-nodejs-ubuntu/). A generic guide that might be out of date by the time you read this. If so, then search the web.

["`n` – Interactively Manage Your Node.js Versions"](https://www.npmjs.com/package/n)

["Install Node.js to install n to install Node.js?"](https://stackoverflow.com/questions/19451851/install-node-js-to-install-n-to-install-node-js) A discussion on how to install n without installing System node. I didn't try this, but if you feel adventurous, you might want to try it. Please add a comment to let me know how it went.

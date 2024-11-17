---
title: "Renaming Magically With zmv"
date: 2017-11-23 06:20 +0100
tags:
    - Microtechniques
summary: >
    I just learned about `zmv` and I love it. Copying and renaming paths with regex? Very handy, indeed.
image: https://images.jbrains.ca/animals/interested-penguin.jpg
---

I just learned about `zmv` and I love it. If you already know about `zmv` or you already love `rename`, then don't waste your time reading this.

Sometimes I want to rename a bunch of files in a way that `mv` can't handle. Most recently, I had a bunch of files with the same name in numbered directories (`Page0/shot.jpg`, `Page1/shot.jpg`, …), and I wanted numbered files instead (`shot-0.jpg`, `shot-1.jpg`, …). Plain globbing won't do it. (If it will and I don't know how, then [please tell me](https://tell.jbrains.ca))

If you know about `rename`, then this might bore you. I never learned about it.

I _love_ ["A Better Finder Rename"](https://www.publicspace.net/ABetterFinderRename/index.html), which I use on MacOS to rename files in batch. It provides a nice user experience for renaming a batch of files: drag a bunch of files into a basket, apply a bunch of transformations to the filenames and paths, get a preview of the resulting filename, and then press "Rename All" and watch all the renames happen. Very nice. I like the friendly user interface for composing complicated transformations.

Sometimes, however, I have a simpler transformation in mind and I'd like to just use the command line. With `zmv`, I can do this.

## What You Need

For `zmv`, you need `zsh`. I installed `oh-my-zsh` and I love it. I'm slowly discovering more about it. If you don't use this as your shell, then search the web and set it up. I had the patience for it; therefore, so will you.

## Enable `zmv`

I first tried it from the command line.

```bash
$ zmv
[Nope.]
$ autoload zmv
$ zmv
[Usage. Now I can use it!]
```

Next, I added it to my `.zshenv`.

```bash
# in $HOME/.zshenv
autoload zmv
alias zcp='zmv -C'
alias zln='zmv -L'
```

Nice! Now, for example, I can try this:

```bash
$ zmv -n 'Page(*)/shot.jpg' 'shot-${1}.jpg'
[Tell me which files you'd change, without changing them. Looks good!]
$ zmv 'Page(*)/shot.jpg' 'shot-${1}.jpg'
[Files magically change!]
```

I love it. You might, too. Enjoy.




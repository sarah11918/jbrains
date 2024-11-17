---
title: "IDEA Crashes on Launch on Yosemite"
date: 2014-10-19 09:35 -0300
tags:
---
I upgraded to Mac OS 10.10 Yosemite and something strange happened with my installations of IntelliJ IDEA. They just disappeared. I still don't know what happened to them. When I tried to reinstall IDEA 13 Community Edition, it crashed on launch.

<aside markdown="1">Evidently, IDEA normally gracefully handles not finding a JRE with which to launch itself; but it didn't for me, and I still don't know why. After fixing the situation, IDEA now indeed handles a missing JRE gracefully. My Java SE 6 installation must have found itself in an irrational state.</aside>

Fortunately, my Twitter community came to my rescue. I'm sharing my experience here, just to make it easier for those who upgrade after me. I found two solutions.

## A Risky Solution

When I reinstalled Java SE 6 and made it my system Java virtual machine, IDEA 13 (and IDEA 14 beta) launched successfully. I followed these steps.

1. Install Java SE 6, which [Apple ships on its own](https://support.apple.com/kb/DL1572) .
1. Add `export JAVA_HOME=/usr/libexec/java_home -v "1.6.0"` to your login shell initialization script which, for me, was `.zshrc`.

This, of course, provides a system-wide solution. It works, but it perpetuates an annoying dependency between IDEA and the state of my operating system. As with any reliance on global variables, it carries certain risk. It made me happy, then, that my Twitter community pointed me towards a more localized solution.

## A Less Risky Solution

Thanks to this tweet, I have managed to solve the problem in a less risky fashion.

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/adymitruk">@adymitruk</a> <a href="https://twitter.com/jbrains">@jbrains</a> You just need to update the Info.plist to use 1.7 or 1.8.</p>&mdash; Hadi Hariri (@hhariri) <a href="https://twitter.com/hhariri/status/523714117530419201">October 19, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I followed these steps.

<figure><a href="/images/IdeaLaunchJreSetting.png"><img src="/images/IdeaLaunchJreSetting.png" alt="Setting the JRE that launches IDEA" /></a><figcaption>Setting the JRE that launches IDEA</figcaption></figure>

1. Duplicate the IDEA .app launcher, so as to keep an old copy with which to test.
1. Locate `Contents/Info.plist` inside the .app launcher and edit it. ("Show Package Contents" in Finder.)
1. Look for the dictionary with key `JVMOptions` and find the value corresponding to `JVMVersion`.
1. Change this value to `1.8*` in order to look for a JRE matching what `/usr/libexec/java_home -v '1.8*'` would find.
1. Launch the .app and verify that it launches.
1. Remove Java SE 6 from the system path. (I `tar`d it as a backup, then deleted it from `/System/Library/Java/JavaVirtualMachines`.)
1. Launch the .app and verify that it still launches.
1. Launch the other copy of the .app&mdash;still set to expect Java SE 6&mdash;and verify that it no longer launches.
1. Change the `JVMOptions/JVMVersion` to `1.7*`, while leaving Java 8 active as the system JRE.
1. Launch the .app and verify that it still launches, even though Java SE 7 is not the system JRE.
1. Change the `JVMOptions/JVMVersion` back to `1.8*`, because I want to keep that value.

I much prefer this localized solution, as it breaks the dependency between IDEA and the system JRE.

Choose whichever solution works better for you. Enjoy!

## References

stackoverflow.com, ["IntelliJ not starting after OS X Yosemite update"](https://link.jbrains.ca/1wdoIMX).

---
title: "Refactoring CSS: Not Impossible"
date: 2014-05-30
tags: 
---
I wanted to change some of the styling at [jbrains.ca](https://www.jbrains.ca), but I have a legacy Wordpress template, so I needed a way to start making incremental changes with something remotely approximating tests. I knew that I didn't want to have to crawl every page to check that every pixel remained in the same place, in part because that would kill me, and in part because I don't need every pixel to remain in the same place. I needed another way.

## How to Refactor CSS/SCSS

I chose to replace the raw CSS with SCSS using the [WP-SCSS](https://link.jbrains.ca/1kdj8pp) Wordpress plugin. Since I had all this legacy CSS lying around in imported files and I had fiddled with some of it before I knew how the original authors had organized it, I needed to consolidate the CSS rules as soon as possible so that I can change them without accidentally breaking them.

First, I created one big CSS file (the "entry point") that imports all the other CSS files. Then, in order to use WP-SCSS effectively, I needed to move the importants into a subdirectory `css/`, so that I could generate CSS from only the SCSS located in `scss/`. This meant changing some `@import` statements that loaded images using a relative path. I fixed those with some simple manual checks that the images load correctly before and after the change. (Naturally, I discovered the problem by accident, then fixed it.) At this point I had one big CSS entry point that imported a bunch of other CSS files in from `css/`. I committed this to version control and treated it as the Golden Master[^golden-master].

Next, I copied all the CSS "partials" into genuine SCSS partials and changed the entry point to import a single generated CSS file. I created an SCSS entry point that imports all the SCSS partials. This should generate the same CSS entry point, but get rid of all the little generated CSS "partials". It did. I committed this to version control.

[^golden-master]: This refers to the Golden Master technique where we check the result once by hand, then compare future versions automatically to the hand-checked "golden master" to detect changes. It's *like* testing.

Now I can freely change my SCSS, generate the CSS, and check the `git` index for changes. As long as only the SCSS changes and the generated CSS doesn't change, I definitely haven't broken the CSS. If the generated CSS changes, then I check the affected web pages by hand and either undo the change or commit the generated CSS as the new golden master.

I hope this helps you deal with your own legacy CSS. You know you have some.

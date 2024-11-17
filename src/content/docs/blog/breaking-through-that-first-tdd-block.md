---
title: "Breaking Through That First TDD Block"
date: 2021-08-12
tags:
    - Not Just Coding
    - The Little Things
excerpt: >
    Some programmers try TDD and feel blocked right away.
    "How do I write a test for code that doesn't yet exist?!"
    I remember how it felt and what happened when I tried anyway.
---

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">1. Change the code as usual<br>2. Write a test that only passes after the change<br>3. Revert to before 1<br>4. Type the test again (copy/paste is cheating &amp; invalidates the warranty of the exercise)<br>5. Make it compile by changing the code<br>6. See it fail<br>7. Change the code to make it pass</p>&mdash; Kent Beck (@KentBeck) <a href="https://twitter.com/KentBeck/status/1421257650113634304?ref_src=twsrc%5Etfw">July 30, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

I literally did this for one afternoon (back in 1999, I think) and began to feel the difference almost immediately. I also happened to like that feeling, even though there were moments where it felt strange: think, think, think, give up, write the production code, I see..., write the test, run it, see it pass, Hmm..., undo all of it, count to 10 (no, really!), now write the test.... I practised this for a few weeks (my manager seemed not to notice any drop in my productivity!) and the block that Kent describes in his tweet was mostly gone. This helped me build the habit of writing the test first.

**The first change I noticed** was in step 4: when I wrote the test, I sometimes noticed that I could write a simpler, smaller, more-direct, or clearer (somehow) test. This was the first "Aha!" for me.

**The first _big_ change I noticed** was a change in how I thought about code. I thought more directly about inputs and desired outputs, rather than data structures and algorithms. I always managed to find suitable data structures and algorithms, anyway. I still do, even when I build them up impossibly incrementally.

As I became more comfortable thinking about code in terms of inputs and desired outputs, **I stopped seeing only classes and started seeing interfaces**. Previously, I hadn't understood the value of interfaces at all, let alone how to use them effectively.

Within a few months, I began deeply to understand what I didn't like about programming: being forced to know _all these details_ about _that thing over there_ when I merely wanted to use it. Gradually, I saw this weakness in my own designs as well as in others' designs.

[The rest is history]({% link archive.html %}).

You can do it.

---
title: "Google Spreadsheet as a Test-First Demo Environment"
date: 2014-03-25
tags: []
---
If you like to teach test-first/test-driven techniques, then you have probably stumbled over configuration problems in your programming environment. This happens to every presenter at least once. We have a variety of ways to handle the problem, and today I'd like to share another one with you.

Google Spreadsheet can run Javascript, which means that we now have a ready-to-go approximation of [Fit](https://fit.c2.com). It took me only a few minutes to figure out how to write a Javascript function that operates on the value in a spreadsheet cell. After that, I recorded ten minutes of video demonstrating the environment.

<figure class="body-text-block">
<div class="embedded-video-container">
<iframe class="embedded-video" src="https://www.youtube.com/embed/Bk1am07r8zQ?rel=0" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
</div>
</figure>

*Yes, I wrote the code test-first, but not test-driven. Please hold your cards and letters. I wanted to demonstrate a testing environment and not TDD. Even so, with ATDD or BDD, we programmers often receive a batch of customer tests and make them pass one by one, and sometimes we don't need additional programmer tests to have confidence that we've built things well. Looking at the final design for this solution, I don't think that a strict test-driven approach would have improved anything. If you disagree, then please share your approach with us!*


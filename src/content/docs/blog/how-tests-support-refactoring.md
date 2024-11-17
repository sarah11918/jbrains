---
title: "How Tests Support Refactoring"
date: 2023-02-28
tags:
    - Refactoring
# summary: >
#     No, tests aren't supposed to make refactoring _easier_; they
#     make refactoring **safer**. Sometimes, by accident, they do both.
---

I have witnessed programmers express annoyance about how tests seem to interfere with changing production code. A discussion on this topic [led here](https://mastodon.social/@nat@ruby.social/109938741113806550):

<iframe src="https://ruby.social/@nat/109938740857766771/embed" class="mastodon-embed" style="max-width: 100%; border: 0 none; padding: 1em" allowfullscreen="allowfullscreen" width="300" height="600"></iframe>

In particular, it raised this commonly-heard expression of frustration in the vein of ["Ask Why, But Never Answer"](https://blog.jbrains.ca/permalink/ask-why-but-never-answer)

> Aren't tests supposed to make refactoring easier???

No.

Isn't that better? You can let go of this expectation now. May you be at peace.

Tests make refactoring **safer**, but not necessarily _easier_. Sometimes, by accident, they do both.

If you judge that the safety is no longer worth the investment, then you can safely throw the tests away. This carries the risk of committing early to "rolling forward" (or going back and trying again), but **throwing away the tests is always safe** in the sense that doing this must never break production code.[^must] At worst, it makes changing that production code more expensive&mdash;a risk that you can manage in a variety of ways.

[^must]: I use "must" here precisely and deliberately. Not "should", but _must_. If you break this rule, then you have more-urgent problems. Plz fix.

But if you're expecting tests to (generally) make refactoring _easier_, then you're expecting too much. Nothing can (generally) do that. You'll have to settle for making refactoring less risky in other ways, less expensive overall, and ultimately less stress-inducing. Tests certainly help me do _that_, at least on most days most of the time.


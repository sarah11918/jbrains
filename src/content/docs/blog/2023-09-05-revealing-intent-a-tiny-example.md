---
title: "Revealing Intent: A Tiny Example"
date: 2023-09-05 09:03 -0300
tags:
  - Simple Design
summary: >
  It's easy to give the instruction to **reveal intent**,
  but harder to provide helpful examples. I'd like to
  provide a tiny one that illustrates the point
  quite clearly---at least to me.
---

By now you've probably heard of [Four Elements of Simple Design](https://blog.jbrains.ca/permalink/the-four-elements-of-simple-design), among which you'll find this suggestion: **reveal intent**. You've probably also read articles about how to do this, many of which feel entirely subjective and seem to beg their own question: if it's enough to improve names, then I need good judgment to improve names; how do I develop that judgment?

[Deliberate practice](https://blog.jbrains.ca/permalink/test-driven-development-as-pragmatic-deliberate-practice). Repetition. Inviting the loving criticism of others.

Examples.

# An Example

I wanted to redeploy a simple web site to Netlify using the `netlify-cli` tool. I typed this:

```zsh
$ netlify deploy --prod
```

Yes, I'd rather that switch read `production`, but that's not what I wanted to point out today.

When I did this, `netlify-cli` informed me that there was no Netlify site linked to this project's repository and asked me whether I'd like to link one. Of course I would! I answered its questions, resulting in `netlify-cli` updating a file in my repository.

```zsh
$ git diff
diff --git a/.gitignore b/.gitignore
index c1a6e33..d30de63 100644
--- a/.gitignore
+++ b/.gitignore
@@ -1,3 +1,6 @@
 www/
 .sass-cache
 .jekyll-metadata
+
+# Local Netlify folder
+.netlify
```

Now I will risk sounding like _that guy_. Please forgive me.

This comment strikes me as very similar to...

```c
// Increment x by 1
x = x + 1;
```

# Reveal Intent by Asking "Why?!"

I learned this trick a long time ago and it rarely lets me down. When I want to reveal intent, I ask "why?!" and replace existing words with the answer to that question. Let's try it.

Why do I want to ignore the local Netlify folder (as opposed to some other folder)? Because this project isn't forced to deploy to Netlify; it could deploy anywhere.

Sometimes asking "why?!" doesn't suffice. In this case, I'm looking for an intention-revealing name and the current name describes the implementation details instead of the purpose. Perhaps I need another question.

# Reveal Intent by Asking "What?!"

I learned this trick a long time ago, too, and it bails me out when the "why?!" question lets me down. When I want to name something according to its purpose instead of its implementation, I ask "what is this, _really_?!" with a little bit of "...and don't say what's already there!"

What is this Netlify local folder nonsense?! I guess it's data about where I have deployed this project. One might call that a "project deployment details folder". Not bad.

I might not stop here forever, but, following the rule "I Type What I Say", I type what I said.

```zsh
diff --git a/.gitignore b/.gitignore
index c1a6e33..d30de63 100644
--- a/.gitignore
+++ b/.gitignore
@@ -1,3 +1,6 @@
 www/
 .sass-cache
 .jekyll-metadata
+
+# Deployment details
+.netlify

```

Better. Ship it.

# Really?!

Yes. What happens now, in five years, when I deploy this project somewhere other than Netlify? (These places have a habit of disappearing or starting to charge exorbitant fees or something. Ask TextDrive and Heroku.) When I see the word "deployment" referring to `.netlify`, it becomes much more likely that I'll volunteer to update the project consciously, rather than leaving cruft to accumulate. Imagine if, in 20 years, I'm wondering what the hell "Netlify" was for. "I haven't used Netlify since 2028! I guess I can finally delete that!"

You scoff, but how much of your legacy code boils down to everyone forgetting what the hell "Netlify"---or something like it---was for?

Any little thing that helps me delete obsolete code delays the onset of legacy code by precious hours or days. And when legacy code hurts you, you'll do almost anything to make the pain a little duller.


---
title: "I Learned Some sed"
date: 2017-12-22
lastUpdated: 2022-04-29
tags:
  - Tutorials
  - Microtechniques
excerpt: >
 I decided to learn some `sed`, because of its ubiquity and its power.
---

<section class="highlight">

In 2022 I learned about `sd`, a modern replacement for many of the simplest ways to use `sed`. [Check it out!](https://github.com/chmln/sd)

</section>

I decided to learn a little `sed`, because I can find it everywhere and it seems like the kind of tool that would make a bunch of everyday things easier and faster.

I started with ["Sed - An Introduction and Tutorial by Bruce Barnett"](https://www.grymoire.com/Unix/Sed.html) and immediately realized the enormity of the consequences of my choice.

>   Anyhow, _sed_ is a marvelous utility. Unfortunately, most people never learn its real power. The language is very simple, but the documentation is terrible. The Solaris on-line manual pages for sed are five pages long, and two of those pages describe the 34 different errors you can get. A program that spends as much space documenting the errors as it does documenting the language has a serious learning curve. — "Sed — An Introduction and Tutorial"

If you can read this, then I didn't abandon ship.

## The Essential Command

Evidently, my world in `sed` will revolve around the command `s`.

```bash
$ echo day | sed "s/day/night/"
night
```

That seems reasonable enough. This might even provide as much as I need for my current task.

## My Current Task

I have started redesigning this very web site. (You might even be reading this article on the redesigned version of the web site.) As of the end of 2017, I used Jekyll to generate this site. When I started using Jekyll, I took advantage of Jekyll's built in feature for generating _excerpts_ from articles. Later, when someone taught me about Twitter cards for promoting my articles better, I began needing _summaries_ in addition to _excerpts_. Now, I realize that I don't need excerpts at all, really, and so I want to change excerpts to summaries.

This involves changing article metadata, stored in YAML. I need to rename the `excerpt` property to `summary`. As far as I can tell, I don't need to change anything else. This means that it suffices to change the string `excerpt` to `summary`, as long as:

+   it occurs at the beginning of a line, and
+   a colon (`:`) follows it, and
+   it occurs within the YAML front matter, which comes between lines of `\-\-\-` at the beginning of the document


It seems highly unlikely that I'd find the word `excerpt` at the beginning of a line, followed by a colon, but occurring in the main text of the article, so I can probably very safely ignore the last of these conditions; however, I might as well learn how to handle it with `sed`.

Since `sed` works on one line at a time, I need a stateful solution that effectively remembers "I've entered the YAML front matter" and "I've left the YAML front matter". Or something like that. Let's see….

## A Simplified Solution

If I permit myself temporarily to ignore the condition of matching text inside the front matter, then I can transform `excerpt`s into `summary`s in a fairly straightforward way. Doing this will allow me to learn how to operate on a family of files without simultaneously trying to understand more-complicated `sed` syntax, so let me start there.

I know how to perform a single regex replacement, so I start there.

```bash
$ cd $BLOG_PROJECT_ROOT  # Where my Jekyll project resides
$ grep -r "^excerpt" source/**
[A list of article files with excerpts.]
$ cat source/_posts/2010-01-28-not-just-slow-integration-tests-are-a-vortex-of-doom.markdown | sed "s/^excerpt:/summary:/"
[The output of the article, but with "summary:" instead of "excerpt:"]
```

Next, I'd like to change the file "in place". Since I have put these files in version control, I can safely change them in place, and then check them out if I accidentally destroy them. For that, I need the `-i` switch.

```bash
$ cd $BLOG_PROJECT_ROOT
$ sed -i "s/^excerpt:/summary:/" source/_posts/2010-01-28-not-just-slow-integration-tests-are-a-vortex-of-doom.markdown
sed: 1: "source/_posts/2010-01-2 ...": bad flag in substitute command: 't'
```

Nope! Nice try. But wait… _why not_?!

Aha.

>   The GNU version of sed allows you to use "-i" without an argument. The FreeBSD/Mac OS X does not. You must provide an extension for the FreeBSD/Mac OS X version.

Since I find myself on Mac OS X, I have to provide an argument to `-i`: a "backup" file extension to which `sed` can rename the file that it changes in place. And since I don't want to create a backup...

>   If you want to do in-place editing without creating a backup, you can use `sed -i \'\'  \'s/\^/\t/\'  *.txt`.

Silly, but then, Bruce warned me.

```bash
$ cd $BLOG_PROJECT_ROOT
$ sed -i '' "s/^excerpt:/summary:/" source/_posts/2010-01-28-not-just-slow-integration-tests-are-a-vortex-of-doom.markdown
[No output. I assume this means that all went well.]
$ echo $?
0  # an exit code of 0 means that my command threatened to work
$ git diff
[Evidence that only the excerpt metadata property changed. Success!]
$ git reset --hard HEAD   # Let me now try to change all the articles at once!
$ sed -i '' "s/^excerpt:/summary:/" source/_posts/**/*.{markdown,md}
[No output. I don't trust myself just yet.]
$ echo $?
0   # Wow!
$ git diff --stat
[Evidence that I changed 14 files.]
$ grep -r "^excerpt" source/**
[Evidence that no files inside source/ have an excerpt metadata property.]
$ git add -A
$ git commit -m "Articles now provides summaries for Twitter cards, instead of legacy excerpts."
```

Very nice!

## A More-Precise Solution

Now, I can set a timer for 15 minutes and try to learn a _more-precise_ solution, which only matches `excerpt` inside the YAML front matter, instead of anywhere else in the article. In order to do this, I need to create an article with `excerpt:` at the beginning of a line in the main body of the article. Since I don't actually want any such article published to this blog, I create a version control branch that I can easily throw away.

```bash
$ cd $BLOG_PROJECT_ROOT
$ git checkout -b learn-advanced-sed HEAD^
$ grep -r "^excerpt" source/** | wc -l
      14   # As I inferred from having changed 14 files in the previous step.
```

Now, I create an "article" that I can use to challenge my `sed`-fu.

```bash
$ cd $BLOG_PROJECT_ROOT
$ cat source/_posts/2017-12-22-a-stupid-article.md
---
title: "A Stupid Article"
date: 2017-12-22
excerpt: >
  This is an actual excerpt.
---
excerpt: Don't put "excerpt:" at the beginning of a line in the actual article, you nit!
$ git add -A && git commit -m "We now have an article that can test our sed-fu."
```

Now, if I try to use my existing solution, I'll "accidentally" change too many lines.

```bash
$ cd $BLOG_PROJECT_ROOT
$ sed -i '' "s/^excerpt:/summary:/" source/_posts/**/*.{markdown,md}
$ git diff --stat | grep -i "a-stupid-article"
 source/_posts/2017-12-22-a-stupid-article.md                          | 4 ++--
[Oops. I should have only added 1 line and deleted 1 line.]
$ git reset --hard HEAD
```

So how do I find a range of lines? According to Bruce's article, I can use a syntax familiar to `vim` users: `start,stop`. I can use regexes for `start` and `stop` by using the typical `/regex/` syntax. For YAML front matter, I want to look between the first two lines that start with three hyphens, so that means `/\^\-\-\-/,/\^\-\-\-/`. Does it work?

```bash
$ cd $BLOG_PROJECT_ROOT
$ sed -i '' "/^---/,/^---/ s/^excerpt:/summary:/" source/_posts/**/*.{markdown,md}
[No output. I don't trust the silence.]
$ echo $?
0
$ git diff --stat | grep -i "a-stupid-article"
 source/_posts/2017-12-22-a-stupid-article.md                            | 2 +-
[No way! It worked! Did it work everywhere?]
$ git diff --stat | grep "2 +-" | wc -l
      15
[Excellent! Just one last thing to check...]
$ git diff source/_posts/2017-12-22-a-stupid-article.md
diff --git a/source/_posts/2017-12-22-a-stupid-article.md b/source/_posts/2017-12-22-a-stupid-article.md
index d6863a1..5b51b1c 100644
--- a/source/_posts/2017-12-22-a-stupid-article.md
+++ b/source/_posts/2017-12-22-a-stupid-article.md
@@ -1,7 +1,7 @@
 ---
 title: "A Stupid Article"
 date: 2017-12-22
-excerpt: >
+summary: >
   This is an actual excerpt.
 ---
 excerpt: Don't put "excerpt:" at the beginning of a line in the actual article, you nit!
```

Excellent! It works! And with 1 minute, 32 seconds left on the timer.

## The Winning Command

```bash
$ sed -i '' "/^---/,/^---/ s/^excerpt:/summary:/" source/_posts/**/*.{markdown,md}
```

Let me review the salient parts of this command.

+   `-i \'\'`: change the file "in place", backing up the original file to "nowhere". On other operating systems, you might only need to specify `-i` without an argument.
+   `"/\^\-\-\-/,/\^\-\-\-/ [\.\.\.]"`: apply the following command to only the region between the first occurrence of a line starting with `\-\-\-` and the following line starting with `\-\-\-`.
+   `"[\.\.\.] s/\^excerpt:/summary:/"`: replace `excerpt:` (only when a line starts with it) with `summary:`.
+   `source/_posts/**/*.{markdown,md}`: this part uses `zsh` to match all the files inside `source/_posts`, including subfolders, with the extension `markdown` or `md`. This has nothing to do with `sed`. 

### Some Notes

According to Bruce's article, my winning command would fail in an article with more than one pair of lines starting with `\-\-\-`. I didn't bother to test this. Also, Bruce's tutorial notes that the substitution command applies to the boundary lines themselves, which happens not to affect my winning command.

# Epilogue

[A nice reader pointed out a mistake in an earlier draft of this article](https://twitter.com/ianjmacintosh/status/946065347689541632), and then [reminded me that I could have used `sed` to fix the mistake](https://twitter.com/ianjmacintosh/status/946073116404576256). Even though I had already published a fix for the mistake, I felt that I needed to go back and do it again with `sed`, so I did. I had forgot to put `https://` at the beginning of a URL, which makes Jekyll incorrectly interpret the URL as a URI at the blog's server address. With `sed`, this becomes a relatively easy command: `sed -i '' "s/(www.grymoire/(https:\/\/www.grymoire/g" source/_posts/*i-learned-some-sed*.md`. I chose to include the open parenthesis `(` in the search regex in order to narrow down the context. I didn't need to do that, but it didn't hurt.

Even better, I might have started a trend:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">You inspired me to try out sed on my own because I was skeptical about those unescaped parens. I learned something!</p>&mdash; Ian MacIntosh (@ianjmacintosh) <a href="https://twitter.com/ianjmacintosh/status/946163583653695488?ref_src=twsrc%5Etfw">December 27, 2017</a></blockquote>

# References

Bruce Barnett, ["Sed - An Introduction and Tutorial"](https://www.grymoire.com/Unix/Sed.html).


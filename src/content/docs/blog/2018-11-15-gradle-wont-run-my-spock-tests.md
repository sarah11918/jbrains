---
title: "Gradle Won't Run My Spock Tests"
date: 2018-11-15 06:11 +0100
summary: >
    If you write a Spock test, but forget to subclass from `Specification`, then you might not notice the mistake.
tags:
    - "The Little Things"
---

I recently had this problem: I was writing some tests with Spock, but IntelliJ IDEA wouldn't run them. It would run my JUnit tests (written with JUnit 4), but it wouldn't run my Spock tests (or "specs", if you prefer). At least this is how it seemed to me. I had made this work before, so I couldn't understand at all why it didn't work now. And, of course, I wanted to get this working for a training course, so I felt a certain pressure to get it to work. Nothing made sense to me.

# Symptoms

- In IDEA, I tried to run all the tests from my `src/test` source folder. Spock tests did not run.
- I tried to run all the tests from just the `src/test/groovy` source folder. Spock tests did not run.
- I tried to run all the tests from just the `src/test/java` source folder. JUnit 4 tests ran as expected.
- I tried to rebuild the project. No change.
- I tried **Invalidate Caches and Restart**. No change.

I tried to run all these tests from Gradle, in order to isolate the problem to some IDEA configuration setting, but even with Gradle I saw the same behavior. I couldn't run Spock tests. I looked inside `build/` and saw that Gradle had built my Groovy source code, but still, Spock tests did not run. It look to me as though Gradle weren't even trying. This seemed really strange to me, since I had created this Java project exactly the same way as I'd done in the past.

# The Mistake

I forgot to add `extends Specification` to my Spock test classes. Yup. Once I changed that, everything worked.

# Summary

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">TIL what happens when I forget to &quot;extend Specification&quot; when writing Spock specs: <a href="https://twitter.com/hashtag/gradle?src=hash&amp;ref_src=twsrc%5Etfw">#gradle</a> silently doesn&#39;t run any tests. Sadly, it looks like a build task failure when it isn&#39;t. I wonder how I could get the feedback, &quot;I ran the tests, but there weren&#39;t any.&quot;</p>&mdash; ☕ J. B. Rainsberger (@jbrains) <a href="https://twitter.com/jbrains/status/1062660413396054017?ref_src=twsrc%5Etfw">November 14, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
---
title: "Not Just Slow: Integration Tests are a Vortex of Doom"
date: 2010-01-28
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
excerpt: >
  Integrated tests are slow, but I have plenty more reasons to recommend
  against using them to gain confidence in the basic correctness of my code.
---
{% include integrated-tests-are-a-scam-disclaimer.html %}

<style type="text/css">
.reader-comment { font-size: small; font-weight: italic; }
.float-right {
  float: right;
  padding-left: 1rem;
  padding-bottom: 1rem;
}
</style>

My friend, Artem Marchenko, had a comment about my recent writing against <del>integration</del> integrated tests.

<div class="float-right" style="max-width: 200px">
![Artem Marchenko]({{ site.images_url }}/not-just-slow-integration-tests-are-a-vortex-of-doom/ArtemMarchenko.jpg "Artem Marchenko")
</div>

> “Aha! So @jbrains is really against the integration tests just because they are too slow for hourly use”

> It reminds me about the Ferrari IT story (XP team, dozens of deployments a year on many continents) that started from getting a big visible counter of a total number of tests and wrote just big amount of **any** tests first. You need to start somewhere and getting large integration tests is definitely better than nothing. As long as you are prepared to improve the testing practices later. —Artem Marchenko

I agree with this sentiment. I tell the story of my very first attempt at test-first programming[^test-first-programming], how I wrote about 125 tests, many of which fit my definition of “integration test”, and which took 12 minutes to execute. This meant that, on average, I only made 8-12 edits per hour when writing that code. I recognized then, and I still recognize now, that even making only 8-12 edits per hour—4-6 edits per hour towards the end—that I produced better software than I did when I would write code almost continuously for several hours at a time. As much as I disparage those integration tests today, I appreciated them a great deal at the time I wrote them. I find integration tests useful for finding system-level problems, as the first step in fixing a mistake, and if I genuinely can’t write a focused object test, then I will usually write an integration test.

[^test-first-programming]: I use the term *test-first programming* to refer to test-driven design without the evolutionary design part. With test-first programming, I develop a specific design, then I use tests to help me type it in correctly.

As you say, Artem, I simply don’t stop there.

When I label integration tests a *scam*, I mean to emphasize the self-replicating nature of integration tests. It starts simply enough: you write a handful of integration tests, which give you a lot of freedom to implement your design in a way that introduces unfortunate dependencies, which makes focused object testing quite difficult. As a result, you will probably resign yourself to writing more integration tests, which do nothing to improve your dependency problems, and the cycle begins again.

![The Cycle of Pain]({{ site.images_url }}/not-just-slow-integration-tests-are-a-vortex-of-doom/cycle-of-pain-1.jpg "The Cycle of Pain")

Integration tests help cause pain, even though they appear to help reduce pain. Therein lies the scam.

I must acknowledge this: if you started writing tests this week, or this month, or even this year, then you will probably benefit more from writing integration tests than trying to write perfectly focused object tests. I have said and written elsewhere that I believe a programmer needs to write about 1500 to burn into her brain the basic patterns of good tests. Even so, as you write those tests, I want you to remain aware of the cost. Even if you don’t know how to write a good, focused object test, if you *want* to write more such tests, and especially if you *try* to write more such tests, then I will have completed the first phase of my mission to eradicate programmer reliance on integration tests to show the basic correctness of their code.

Join us! Turn one integration test into a small suite of focused object tests today. If you don’t yet see how to replace an entire integration test with equivalent focused object tests, then write at least one or two focused object tests along side the integration test. Try it. I promise, you’ll like it.

One last comment to my good friend Artem: please don’t [put me to sleep](https://duckduckgo.com/?q=lullaby+words) with the word “just”!

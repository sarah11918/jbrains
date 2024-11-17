---
title: "How To Recover From the Integrated Tests Scam"
date: 2015-11-07
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
A Twitter follower asked me how to recover from feeling overwhelmed by too many integrated tests, calling it "a common struggle of mine".

If you haven't seen [this video (64 minutes)](https://vimeo.com/80533536), then you might not quite know what I mean by "integrated tests".

> If a test passes or fails based on the behavior of many "interesting" bits of behavior, then I call it an _integrated_ test. (Not an _integration_ test&mdash;those check the integration between layers of a system.)

Integrated tests tend to be big, because they run multiple layers of the system together. They tend to cause trouble because either they check too many things and confuse the programmer or they check only one thing and waste a lot of time doing it. I prefer, instead, to write as many isolated or microtests as possible, which run one thing and check that one thing and that's that.

Nevertheless, most groups that practise TDD seriously eventually fall into the integrated tests scam to some degree.

<figure><img src="/images/HowToRecoverFromTheIntegratedTestsScam/image-1.jpg" /><figcaption>The integrated tests scam</figcaption></figure>

When it happens for long enough, more of the system becomes tightly interdependent, it becomes harder to test anything (whether with _integrated tests_ or with _microtests_), and then they're stuck in the mud: can't dig out, can't move forward.

Well... not _can't_. It does, however, seem daunting. Even if you know that you ought to start teasing things apart, it goes slowly. You feel pain. Little victories seem like very hard work and significant progress seems impossible. This leads to the feeling of being overwhelmed.

## The Best Time To Start...

The old joke advice goes like this:

> The best time to start was five years ago. The next-best time to start is now.

As a consultant, I often have to give this kind of "dissatisfying but true" advice. To deal with legacy code and crawl out of the integrated tests scam, you just have to start. You have to start trying to add tests, trying to tease code slowly apart, trying to improve the design just a little every day. Eventually, these improvements compound and, months from now, over a weekend, suddenly the improvements mean something. Then you gain confidence. Then you feel better. Then you celebrate.

## Where Do I Start?

One of the most common questions people ask me about refactoring, is _Where do I start?_ I even turned this question into a popular conference talk about a decade ago. The bad news with this situation is that there's no good place to start. The good news is that there's no bad place to start, either. Just start. Anywhere. Really.

I intend this advice to feel liberating, but most people find it disheartening. _Great! It doesn't matter where we start! It's hopeless!_ No. I offer you this:

> Great! It doesn't matter where we start! We can start wherever we want!!

Yes, you can. Even if there is an optimal place to start rescuing your design, nobody can see it right now. It lies buried under the rubble of a thousand compromises. Even the greatest tools will only help you a little. Picking a place to start by random chance will give you a roughly equally good chance of a reasonable return on your investment.

<figure><img src="/images/HowToRecoverFromTheIntegratedTestsScam/image-2.jpg" /><figcaption>Good news, everyone!</figcaption></figure>

No matter where you start adding tests or teasing apart code, it'll feel slow, annoying, and painful. It'll make you laugh, cry, throw things against the wall. It'll make you sweat. It'll take months, even years, to get better.

**So get started.**

## While I Have You...

You probably already know about my online training school at [online-training.jbrains.ca](https://online-training.jbrains.ca). I'm planning the next course, and I'd like your help. It'll take 30 seconds, depending on the speed of your internet connection. It's a one-question survey. Please answer it by [clicking here](https://jbrains.typeform.com/to/GCSL41). Thanks.


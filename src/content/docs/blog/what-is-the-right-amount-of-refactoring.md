---
title: "What is 'the Right' Amount of Refactoring?"
date: 2022-08-22
tags:
    - Refactoring
    - Simple Design
    - Evolutionary Design
excerpt: >
    You refactor too much! We're not refactoring enough!
    This is a problem that, with a light touch, resolves itself.
---

A mentoring client of mine said this recently:

> I took ownership of some strategically pivotal code and did precisely that, typically refactoring twice a week for about 18 months (my delivery was unaffected). The refactorings took at most half an hour. Last week I got reprimanded. I've read the room and stopped.

Someone asked why someone reprimanded them, from which came this reply:

> I should be refactoring under an initiative, the colleague felt. I said I was refactoring to the [Four Rules of Simple Design](https://blog.jbrains.ca/permalink/the-four-elements-of-simple-design). Others felt that is not a valid reason.

I've experienced this. Let me describe how I handle the situation.

# Two Kinds of Refactoring

We have two kinds of refactoring: speculative and purposeful. The purposeful kind happens when we clean up the part of the code that we intend to change next; the speculative kind happens when clean up some part of the code where we have worked recently, hoping that it helps us in the future.

**Speculative refactoring makes many people nervous**, because the return on investment is uncertain. Purposeful refactoring makes them feel better, but then the cost is often uncertain, because **Who Knows how bad the code was left by the last person who worked there**. We do speculative refactoring in part to try to amortize the cost of refactoring over the lifetime of the project.

When we are Very Far Behind Schedule, speculative refactoring seems like a luxury we can't afford. No problem! Stick with purposeful refactoring. Eventually, after we get things a bit under control, someone will whine during some purposeful refactoring about how bad the code was left by Some Irresponsible Person in the past. No problem! Let's spend 30 minutes doing some speculative refactoring at the end of every task in order to avoid being The Irresponsible Person From the Past.

And so it goes.


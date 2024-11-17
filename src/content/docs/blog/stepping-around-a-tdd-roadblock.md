---
title: "Stepping Around a TDD Roadblock"
date: 2022-04-11
# summary: >
#     Programmers routinely give up on TDD when they try to 
#     do it in their toughest, meanest, most-valuable legacy
#     code. I understand their impulse, but I think they're
#     setting themselves up for failure and ultimately missing out.
tags:
    - Evolutionary Design
    - Refactoring
---

> I think a lot of people fall off the TDD wagon because of this exact thing&mdash;they learn TDD by working on new code and then can't seem to apply it to their existing work projects. And then they give up, naturally!

When this happens, I help the person focus on the difference between "test-first" and "test-driven". I hope that this offers them more-realistic expectations regarding the outcome.

With test-first, we focus on correct behavior and fix defects. Usually, but not always, when we find defects, we are happy to fix them.

With test-driven, we consider good design and fix dependency problems. Usually, but not always, when we find unhealthy dependencies, we are unhappy because we feel trapped by bad decisions.

I try to warn people that this will happen, it's normal, it's natural, and probably even unavoidable. We need to train ourselves to remember Ron Jeffries' words "That's good news about today, not bad news about yesterday". And since that often sounds trite in the moment, we have a tendency not to believe it. It helps if we support each other to remember these words. Even I don't believe them every time I hear them, although with enough emotional distance from the situation, I end up trusting them again.

This is also why **I emphasize practising refactoring and evolutionary design where it's already easy**: on code that runs entirely in memory and over which you have enough authority to change it. It might not feel as satisfying to practise there, but it tends to work better (for most people most of the time). One obvious goal emerges: gradually and relentlessly expand our sphere of influence and the Happy Zone[^happy-zone].

[^happy-zone]: My name for what others call "the core" of their design: the part that runs entirely in memory and, in many cases, consists of only pure functions.

I hope that helps them. I don't know. They tend to disappear on me before I can find out. (That's the life of a consultant.)

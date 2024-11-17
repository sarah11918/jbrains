---
title: "Refactoring Just Enough"
date: 2024-06-21
tags:
    - "Programming Without Blame"
excerpt: >
    Programmers routinely become stuck in the Advanced Beginner stage of
    refactoring because they are trained to worry about overdoing it, so
    they underdo it and don't build the skill they need to progress.
    They might benefit from some rules to help them break through.
---

This comment arose recently at [The jbrains Experience](https://experience.jbrains.ca) in a discussion about whether all software design choices are "like, just my opinion, man".

> I’ve kind of looked at this in the way. That a beginner needs rules because they don’t yet have the experience to judge each situation on its own. I suppose I am in a way asking for a rule to help hone my judgement when I should or might want to refactor.

Indeed, so here are some rules that I’ve found helpful over the years:

- refactor only when you’re about to touch that part of the code
- refactor only enough to support what you need to do now (Kent Beck’s “make the change easy, then make the easy change”)
- leave SMELL/REFACTOR comments any time you notice a smell or refactoring and don’t intend to address it now, due to some other rule
- Clean Up Before Moving On, with preferably a very specific list of things to clean up or a time limit otherwise

These rules helped me build the habit of “clean the kitchen as you go” refactoring while avoiding the trap of polishing the stone beyond what’s needed. Even so, I still polished some stones too much and didn’t clean the kitchen enough.

I think that particularly Advanced Beginners need to over-polish some stones in order to learn where to draw a more-balanced boundary. I also think that the typical time pressure of an industrial-strength project situation makes it very difficult for programmers to allow themselves (and each other) to over-polish some stones. These two things together trap programmers in the Advanced Beginner stage.

# You Must Know When to Break the Rules

I don't follow these rules very carefully all the time any more. I tend to trust myself to refactor just enough, although if I notice that I'm starting to retreat into refactoring because I'm afraid to add features or fix defects---and this _does_ still happen from time to time---then I know which rules to reach for. I tend to prefer to Clean Up Before Moving On, because I have observed myself rushing to finish features (from excitement, usually, not time stress) and so at this specific time I tend to have overlooked refactoring the most.


---
title: "Which Kinds of Tests Should I Write?"
date: 2022-04-03
# summary: >
#     Programmers routinely ask me for advice on which kinds
#     of tests they ought to write: unit vs. functional, fast vs. slow,
#     big vs. small. They keep saying "integration test" when they
#     mean "integrated test". We have made this confusing, so I'd
#     like to take one step towards clarifying it.
tags:
    - Microtechniques
    - Evolutionary Design
    - Refactoring
    - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
---

Too many people are writing too many articles trying to direct others' thinking on their own testing strategies. [I am guilty of this](https://integrated-tests-are-a-scam.jbrains.ca) and would like to contribute to reversing this trend.

Instead:

- test until fear is transformed into boredom (Phlip Plumlee)
- if you don't like something about the test, then try interpreting that as a sign of a design problem---usually an unhealthy dependency in the production code (The "driven" in test-driven development)
- faster-running tests tend to provide more value because they shorten the feedback cycle, so if you're not sure what else to do, try to make tests execute more quickly (Lean thinking)
- when in doubt, write another test (Common sense)

If you do these things, then you'll discover the tests that you need.[^ask-for-help] You can do this.

In the final analysis, remember that **we test in order to gain confidence** and that **they pay us to generate profit, not to write tests**.[^why-they-pay-us] 

If you're thinking of a test that will help you gain confidence, then just write it. If you're thinking of a test that's clearly more expensive than dealing with the fallout from the corresponding defect, then don't bother.[^trust-your-own-judgment]

That's enough.

[^ask-for-help]: You'll sometimes feel strange. You'll sometimes encounter choices that follow these guidelines, but feel wrong. When that happens, ask a trusted adviser for help.

[^why-they-pay-us]: OK, this part is complex, so it's subject to endless debate. Even so, I think you can agree that most people, most of the time are paid by their employers to "produce value" and that tests are *an investment* in producing more value per unit time and not the valuable product itself.

[^trust-your-own-judgment]: If you don't trust your own judgment yet, then give yourself the chance to gather more experience. And remember that good judgment comes from experience, while experience comes from bad judgment.
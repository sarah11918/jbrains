---
title: "Too Many Ifs? Maybe."
date: 2021-01-20
tags:
    - Not Just Coding
    - Simple Design
summary: >
    Writing "too many" `if` conditions can cause problems in code,
    but I think we'd all feel better understanding why this might be
    the case, rather than merely repeating received wisdom.
---
Complicated code only creates problems when humans try to change it. When we try to change code, we spend energy understanding it, and so we label code "complicated" when it _feels_ like it requires "too much" energy to understand. That's why we _design_ software: we organize code in a way that reduces the cost of understanding it.

"Too many" `if` conditions represents just one way to write complicated code. Most of us don't immediately grasp long chains or deeply-branching trees of boolean conditions. We sometimes have to draw a truth table in order to trace the various paths. Accordingly, we feel _positive pressure_ to simplify `if` conditions.

Incidentally, **writing a lot of `if` conditions doesn't automatically become complicated**. We judge that when we read the code, based on a _subconscious judgment about the relative effort to understand it_. We read the code and create an impression of whether it "is too complicated". On different days, we react differently, sometimes depending on when we last ate food or drank coffee.

Let's assume, for the sake of this article, that we on the team who maintain this code generally agree that a given `if` block "is too complicated". How can we simplify the `if` conditions? We could try at least these things:

- Name some of the conditions or sub-expressions. [Let the names be long, if the extra detail helps the reader understand.]({% post_url 2011-06-15-a-model-for-improving-names %})
- Replace deeply-nested branches with Guard Clauses. Yes, this conflicts with the received wisdom "only allow one exit point per function". Principles sometimes conflict. As always, use your best judgment.
- Replace deeply-nested branches with a single level of branches, even if that creates duplication among the various conditions. Giving sub-expressions names often helps to reduce the duplication. Often, when I do this, I can spot a higher-level pattern that helps me remove the duplication differently and simplify the entire structure.
- Extract a function/method for the bodies of the first-level branches. This has a similar effect to naming the conditions or sub-expressions, except that we name the _actions_ instead of the _conditions_. Doing this often hides distracting details, making it easier to spot a helpful pattern.

When we name things, we do at least these two helpful things:

1. We articulate in the code what we understand about the design, so that **future readers don't need to reverse-engineer that knowledge**.
2. We hide "noise", leaving behind more "signal", resulting in a greater "transmission" of information. This **reduces the cost of understanding the code**.

I'm sure there's more to say about this topic, but I think the foregoing suffices for now.

<details class="highlight">
<summary>About Guard Clauses...</summary>

When I write a Guard Clause, I get the vague, uneasy feeling that I've put the code in "the wrong place". Typically I see it as an irrelevant detail that I ought to [push up the call stack]({% post_url 2013-01-29-consequences-of-dependency-inversion-principle %}). You can find an example of this in ["Sell One Item Part 2"](https://wbitdd.jbrains.ca/lectures/136759) of [The World's Best Intro to TDD: Level 1](https://tdd.training), starting around the 2:30 mark of the video.
    
**Spoiler Alert**. If we've only created Controller layer so far and we try to write pure user interface behavior there, it feels strange. We don't resolve that strangeness until we write the text-based user interface, which acts as a client to the Controller layer, and provides a natural place for this UI behavior to "bubble up" to. We finally get there in ["Tension in Abstraction"](https://wbitdd.jbrains.ca/lectures/203398) starting around the 11:00 mark of the video. (Please note: this video is _not_ in the **free preview** part of the course. Sorry.)
    
</details>



# References

Quora, ["Why is using a lot of “if” conditions not considered a good computer programming practice?"](https://www.quora.com/Why-is-using-a-lot-of-if-conditions-not-considered-a-good-computer-programming-practice)


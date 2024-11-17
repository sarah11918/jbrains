---
title: "Surviving Legacy Code with Golden Master and Sampling"
date: 2014-09-28 14:09
lastUpdated: 2017-12-08
tags:
  - "Surviving Legacy Code"
excerpt: >
  Learn one proven approach to help with the age-old chicken-and-egg problem
  of "I want to refactor this legacy code, but I'm afraid to change it
  without tests" and "I want to write tests, but I need to introduce
  some structure in order to write reasonably-focused tests".
---
You have inherited some code. Congratulations. Now you need to change it.

There, there.

[Michael Feathers once wrote](#welc) that legacy code is "code without unit tests". I use a slightly more general definition.

> By "legacy code", I mean **profitable code that we feel afraid to change**.

I think that both parts matter. You probably accepted the "afraid to change" part without any need for convincing. (If not, then this article probably won't interest you.) Moreover, if the code doesn't generate significant value, then I don't see much risk in changing it. If the cost of "getting it wrong" doesn't significantly outweigh the profit we derive from "getting it right", then who cares? Probably not I.

I treat valuable code with considerable respect. It provides food for families. I treat difficult-to-change code also with considerable respect, although this comes more from fear than admiration. If we put these two things together, then, quite simply, one false move and I might destroy an order of magnitude more profit than the yearly cost to keep me around.

This brings me to **Rule Number Zero of Surviving Legacy Code**:

> Maximize safety.

We find ourselves in the typical chicken-and-egg problem: we want to write tests in order to refactor more safely, but then we remember that integrated tests are a scam&#8480;[^integrated-tests-are-a-scam-series] and decide that we'd rather break things apart a little in order to write less-costly-to-maintain tests. So which do we do first?

[^integrated-tests-are-a-scam-series]: You can find a series of articles on that topic by [clicking here](https://integrated-tests-are-a-scam.jbrains.ca).

In a situation like this, I like to go back to my guiding principles.

{% include calls_to_action/surviving_legacy_code.html %}

Integrated tests are a scam&#8480; in part because they don't put enough positive pressure on my designs and thereby don't give me enough useful design feedback. Right now, *I don't care about this*. I already know that the design needs significant work. I also know that I can't handle the torrent of feedback that microtests would give me about the design.[^out-of-your-head] [^backlog] If I want to use this principle to guide my behavior, then I need to find another justification.

[^out-of-your-head]: When diving into legacy code, I find it more important than ever to keep stuff out of my head. During the two hours it takes to safely refactor some large function, I'm probably going to spot 14 potentially-useful refactorings. I can't chase every bunny, no matter how cute they are. I need to write those ideas down, get them out of my head, and get back to the tricky surgery at hand.

[^backlog]: I see little point in spending energy generating a backlog knowing full well that I will never get around to doing about 80% of it. Who would volunteer to do _that_? (Ask your project manager if [value-driven product development](//www.jbrains.ca/training/value-driven-product-development) is right for them.)

Integrated tests remain a scam&#8480; in part because of the combinatoric explosion in the number of tests I need to achieve a strong level of *coverage*, which in this case correlates to *confidence*. I might have to write millions of tests to achieve high coverage. I probably only have time to write hundreds of tests, in which case I have to gamble about the level of coverage. Perchance, could I not care about coverage in this situation?

Test coverage&mdash;however one measures or defines it&mdash;links directly to safety in changing code.[^test-coverage] I want to use those tests as *change detectors*. I want the red light that flashes the moment I make a mistake. Microtests, especially if I write them first, give me that. They help me find mistakes immediately. They help drive down the cost of making a mistake, an essential technique for managing risk.[^agile-approach-to-risk-management] If I can't write microtests cost-effectively, then what can I do?

[^test-coverage]: I know that measuring test coverage can lead to some pretty terrible results, but for my purposes here, I assume an environment in which we don't have that particular problem. We can act like adults, can't we?

[^agile-approach-to-risk-management]: I claim that "the agile approach" to risk management complements the typical approach to risk management of limiting the probability of failure in order to limit exposure. "The agile way", if you will permit me to use this shorthand, involves limiting the cost of failure instead. Eventually I will replace this sentence with a link to an article that goes into this topic in more detail.

What if, instead of a red light that flashes the moment I make (almost) any mistake, I had a pink light that flashes when I make a really obvious mistake? I can't have what I want, but I can afford this; will it do? It will help more than doing nothing. I will simply buy as much of this confidence as I can afford. To do this, I combine two simple ideas: **Golden Master** and **sampling**.

## Golden Master

I use *Golden Master* to help me detect changes in the behavior of a system when I can't justify writing the typical kind of assertion that you've grown used to seeing in tests. I use this trick, for example, when I find it difficult to articulate the expected result of a test. Imagine a function whose output consists of an image. It happens quite often that a binary comparison between actual and expected result yields a *hyperactive* assertion&mdash;one which frequently fails even when a human would judge that the test had passed. I suppose some people know tricks to make it easier to articulate "looks similar enough" for images, but I don't know how to do that, and that leaves me to choose either a hyperactive bit-by-bit comparison or ongoing, manual inspection. Rather than revert to the Guru Checks Output antipattern[^guru-checks-output], however, I take a snapshot of the last-known acceptable output&mdash;I call that the *golden master*&mdash;and save it for future use. When I run the test again, I compare the output to the golden master, and if they match, then the test passes; if they don't match, then the test fails. This doesn't make the code wrong, but it means that I need to check the result and decide whether the code needs fixing or the golden master needs replacing.

[^guru-checks-output]: Marcia, the *guru*, looks at the output, pauses for a moment, then says, "Yep. That's it." If you want to re-run the test, then you need Marcia. That doesn't seem to scale particularly well.

{% pullquote %}
You can use Golden Master wherever you already have some output to check, even if you find the form of that output particularly challenging. With this technique, you simply diff the output and inspect the situation only when you find differences between the current test run and the golden master. {"If your system already sends text to an output stream that you can capture, then you have the tools to use this technique."}
{% endpullquote %}

### What Kind Of Output?

In short: anything that you can easily inspect. With luck, the system writes comprehensive text-based output to a predictable location, such as a local file system. With less luck, the system writes some kind of text-based output somewhere that you can collect. Most systems produce _logging output_, which you can use as a kind of proxy for "the real thing". You might prefer this, because it gives you the chance to trace intermediate results by adding more logging statements _relatively_ safely. (I have worked on systems where adding a logging statement changed some significant behavior, so I have to hedge my bets here.) If your system produces events for other systems, then you might add a listener that echoes the event as text (JSON?) to a simple file. If your system design doesn't allow that flexibility, then you might add logging information just before and after sending the event. Let your imagination run wild. Whatever you need to do in order to capture results that you want to check, do it, but _do it carefully_. Make the smallest changes you need in order to produce output that you can check, because that provides the tests you'll use to make bigger changes with more confidence.

### What About Noisy Output?

If your system produces "noisy" output, then you will probably want to filter the results. Noise can include insignificant things that change, such as timestamps and thread names; but it can also include insignificant things that don't appear to change, such as user-friendly words. For example, in a game that reports "Joe has rolled a 6" when a player rolls the die, you might prefer to extract the parts that matter, transforming this into `roll: "Joe", 6`, so that your golden master doesn't fall out of date when someone changes some irrelevant part of this text. All the same, don't go overboard: don't start building a parser for an arbitrary, unplanned, probably context-sensitive grammar. That way lies madness. (Of course, if a context-free grammar happens to describe the format, then go for it. You've always wanted to learn `lexx` and `yacc`, haven't you?) Once you find yourself spending a significant amount of time filtering your golden master output---beyond what a few simple regular expressions can handle---consider that you might spend less time extracting a huge function and then writing `assertEquals()` checks.

## Sampling

I find one glaring problem with the Golden Master technique: if the output describes a long-running algorithm, process, or path through the system, then the golden master itself might describe only one of a thousand, million, or even billion potentially-interesting possible outputs. Welcome back to the combinatoric explosion problem that makes integrated tests such a scam&#8480;. How do we proceed when we can't possibly check the variety of paths through the system that we need to check?

Ideally, we refactor! I know that if I can break my system into many smaller, composable pieces, then I turn products into sums: instead of checking combinations of paths through multiple parts of the system at once, I can check the handful of pairwise connexions between parts of the system in relative isolation. I could turn millions of tests into hundreds. Unfortunately, in our current situation, I don't feel comfortable refactoring, so that means that I have to *sample* the inputs and hope for the best.

You can find more sophisticated sampling systems out there among blogs written by experienced testers, but they all amount to sampling: if I can't try every combination of inputs, then I try some combinations of some of the inputs and aim for the best coverage that I can.

This shouldn't surprise you. You've done this before. You've written a function that operates on an integer, and you knew enough about the algorithm to identify boundary cases at, for example, -1, 0, and 1, as well as around 100 and 1000, so you check in and around the interesting boundary values and feel satisfied that the algorithm will work for the remaining few billion inputs. You were **sampling**.

In the case of legacy code, however, sometimes we can't sample quite so intentionally. Sometimes *even when we limit our scope to characteristic inputs*, we have so many combinations of those inputs that we still can't afford to write and run all those tests. In some cases, we don't even know how to identify the characteristic inputs. In other cases, the algorithm itself has a random element, defeating our goal of writing nice, deterministic, repeatable tests. Random sampling to the rescue.

If you can use the random number generator to generate a stream of inputs to your system, then you can use this generate a collection of output files, and that collection can act as your golden master. You only need to control the random number generator by seeding it with the same stream of seeds every time. I use a simple linear generating function like `m + p * i` where `m` and `p` represent arbitrarily-chosen numbers and `i` represents a loop index. Now I simply have to decide how big a sample to take. Generally speaking, a larger sample gives me more confidence in the sensitivity of the pink flashing light that signals possible danger.

I adjust the size of the sample depending on how long it takes to execute a test run, and how much significantly that affects my flow while programming. I also adjust the size of the sample to match my fear level: the more worried I feel about getting something wrong, the larger sample I take while working, and I accept the cost of slowing down. I'd usually rather go a little too slow than a little too fast, because I know that the cost of making a mistake would likely dominate the savings from going more quickly.

## The Techniques in Action

You can see an example of this technique in action by reading [this code](//link.jbrains.ca/1AVawrV). If you'd like to see how I added this behavior to some legacy code, then [start at this commit](//link.jbrains.ca/1mmmKIW) and follow the process step by step.

Although these techniques do not, on their own, guarantee success, when I combine Golden Master and Sampling, I can usually find a way to proceed safely. When I combine these with microcommitting[^microcommitting], I can proceed at an even quicker pace. They help me avoid the Catch-22 problem that arises from needing to refactor dangerously unsafely in order to be able to refactor safely and sensibly. Where might you use Golden Master and Sampling to help get your arms (at least a little) around your legacy code?

[^microcommitting]: Really frequent committing, like after changing a single line of code. No, really.

{% include calls_to_action/surviving_legacy_code.html %}

## References

Michael Feathers, <a name="welc">[_Working Effectively with Legacy Code_](//link.jbrains.ca/jdXMTy)</a>. Still the classic work on winding your way through legacy code.

J. B. Rainsberger, ["Getting Started with Getting Things Done"](//link.jbrains.ca/getting-started-with-gtd). You don't have time to read _Getting Things Done_? Start here. Four pages. It'll be fine.

David Allen, [_Getting Things Done_](//link.jbrains.ca/WOXFIr). I use it. Not all of it, and not all the time, but I use its core principles quite significantly in managing my work and home lives. No cult, I promise.

J. B. Rainsberger, ["A Proven Path to Effectiveness"](//link.jbrains.ca/1caX2Mq). A "method" that combines Getting Things Done and Test-Driven Development aimed specifically at the beleaguered programmer.

[texttest.org](//link.jbrains.ca/1plDKK9). A library to help you write text-based tests, such as I would use to provide golden masters. **Do not download this tool until you have written your own golden master at least once. That is an order.** After that, use TextTest, because it really helps.

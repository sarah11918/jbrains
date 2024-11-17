---
title: "How a Smell in the Tests Points to a Risk in the Design"
date: 2016-01-21
---
In ["What Is Functional Programming?"](https://blog.jenkster.com/2015/12/what-is-functional-programming.html) I spotted a nice example of how duplication in tests leads to a suggestion to improve the design.

Let's start with his example function `getCurrentProgram()`.

```
public Program getCurrentProgram(TVGuide guide, int channel) {
  Schedule schedule = guide.getSchedule(channel);
  Program current = schedule.programAt(new Date());
  return current;
}
```

<aside class="aside" markdown="1">

Notice, first of all, the word _current_, which almost always reveals a risky, implicit dependency. The word "current" already suggests hardwiring the function to one particular instant in time, which is usually an arbitrary detail, and which is literally **a detail that's constantly changing**! It's about as unstable a detail as one can have, and so depending on it seems awfully risky.

Good news, though: even if you don't react to the word "current", you will almost certainly have trouble testing the function as is.

</aside>

As Kris Jenkins points out in his article, this function has a hardwired (difficult to change) implicit (unspoken) dependency on the current time. I find it no less difficult to use and significantly easier to test by simply making the hardwired implicit dependency both explicit and pluggable by turning it into a parameter. Making this change suggests to me to rename the function, since it no longer depends on the detail of "now" or "current", and instead becomes "get program at/on/as of".

```
public Program getProgramAt(TVGuide guide, int channel, Date when) {
  Schedule schedule = guide.getSchedule(channel);
  Program program = schedule.programAt(when);
  return program;
}
```

As Kris points out, this version makes all its dependencies explicit and pluggable. This leads to a few benefits:

- To write a test, I can confidently determine the expected result from the inputs without having to look at the implementation for additional dependencies to set up.
- To write a test, I don't have to resort to hijacking `new`, because the concept of "where the date came from" is no longer inside the function. The function doesn't care where the date came from.
- When I specify the inputs and expected results in the test, the link between them will be obvious, which makes it easier to figure out how to write more tests, later, after people have added more code and we've encountered a problem.
- We can reuse this code in other contexts! Kris offers the example that we get "What's showing on channel 45 in an hour?" by simply passing the equivalent of `now + 1 hour`. This is the power of context independence.

Even so, I see a problem. Commenter Mario T. Lanza saw the problem even before I did.

> I like your exposition and many excellent points; however, as a minor point, we should note that getProgramAt has a Law of Demeter violation that increases complexity. &mdash;Mario T. Lanza, [in a comment](https://blog.jenkster.com/2015/12/what-is-functional-programming.html#comment-2432023201).

As soon as I saw the problem, I saw how it would affect the tests, and that's what I wanted to write about here today.

## Duplicate Irrelevant Details in the Tests

I first wrote about the power of irrelevant details in tests in 2010. (Read ["What Your Tests Don't Need To Know Will Hurt You"]({% link _posts/2010-01-14-what-your-tests-dont-need-to-know-will-hurt-you.md %}).) In the intervening time, I've discussed the idea a lot in my training classes, but never taken the time to write the details down, mostly for lack of good examples. Since I found a good example today, I decided to take the time to write about it today.

Kris' example leads to simpler, clearer tests once we parameterize the _instant_ at which we want to find the program airing on a specific channel. Even so, I notice a pattern in the tests the moment I start writing them.

<div class="test-table" markdown="1">
| guide | channel ID | when | | expected program |
|:-----:|:----------:|:----:|:-:|:-------:|
| {...} | 45 | 2016-01-01 12:00:00 -0300 | | Breaking Bad S01E01 |
| {...} | 45 | 2016-01-01 12:29:59 -0300 | | Breaking Bad S01E01 |
| {...} | 45 | 2016-01-01 12:30:00 -0300 | | Better Call Saul S01E01 |
| {...} | 45 | 2016-01-01 12:59:59 -0300 | | Better Call Saul S01E01 |
| {...} | 45 | 2016-01-01 13:00:00 -0300 | | Breaking Bad S01E02 |
</div>

<aside class="aside" markdown="1">

I've left out the details of how to describe the guide, but you can bet that somewhere in there is a piece of data that links channel 45 and noon on January 1, 2016 to Breaking Bad, season 1, episode 1 for the first two tests, then channel 45 and 12:30 to Better Call Saul, season 1, episode 1 for the next two tests, as well as channel 45 and 13:00 to Breaking Bad, season 1, episode 2 for the last test. I certainly hope that the tests don't all use the same guide data.

</aside>

Do you notice that the channel number is the same in every test? This makes me wonder whether the channel number provides any value to the test. Worse, imagine if I'd followed the time-honored heuristic of using different data for each test! In that case, the channel numbers would be different for each test, and I might not have noticed that the channel number looks like an irrelevant detail for the test!

Irrelevant? How can it be? Surely we need the channel number in order to determine which show is on that channel at a given time!

No, we don't. The channel number is just a leaky implementation detail that forces us to understand how to look up a channel in a guide. It feels natural because we've collectively lived with channel numbers since the 1930s and if you're reading this then you've probably never known a world without channel numbers... except Netflix, YouTube, Hulu, and the world of torrents. Moreover, the act of writing that in words has made the design risk even clearer, because it surfaces the intent behind the test: to be able to answer "what's playing on this channel at a specific instant in time?" and not to answer "where does a channel's schedule come from?"

Why do we need to go to the "guide" to answer this question? _Why do we need to know the details of how to obtain the stream of shows on a channel when we're only interested in finding the show scheduled to air at a specific instant?_ Why, indeed?

## Rate Of Change Of Inputs

{% pullquote %}
I like Bob Martin's formulation of the Single Responsibility Principle: a module should have a single reason to change. {"Cohesion seems to relate to how reasonably one could see the reasons for a module to change as a single reason."} I see the same principle at work in another context: I prefer to separate parameters that change values at different rates from each other. If I notice that 80% of the calls to a function pass the same value for a parameter, then I have the impulse to to elevate that parameter to the constructor of some class. Functional programming practitioners know this as currying or partially applying the function. (I still don't quite understand the difference between these two things. Feel free to teach me.) It provides a natural way for values to flow through a design.
{% endpullquote %}

## Removing the Duplicated, Irrelevant Detail From the Tests

The repeated `45` in my tests stand out against the background of the varying values in the **guide** and **when** columns. It's as though the test wants the **channel** column out of the way and is only providing a value for it because the design (for the moment) demands it. Even more telling, the only parts of the **guide** that the tests cares about are the programs scheduled to air on channel 45.

There's a clue in that sentence.

The test would rather simply check the program airing on a stream of programs organized by time. Fortunately, the current design already has a name for that: the `Schedule`, meaning the schedule of programs on a specific channel. In that case, these tests really want to check `Schedule.programAt(when)`, and so perhaps they should.

<div class="test-table" markdown="1">
| schedule | when | | expected program |
|:-----:|:----------:|:----:|:-:|:-------:|
| {...} | 2016-01-01 12:00:00 -0300 | | Breaking Bad S01E01 |
| {...} | 2016-01-01 12:29:59 -0300 | | Breaking Bad S01E01 |
| {...} | 2016-01-01 12:30:00 -0300 | | Better Call Saul S01E01 |
| {...} | 2016-01-01 12:59:59 -0300 | | Better Call Saul S01E01 |
| {...} | 2016-01-01 13:00:00 -0300 | | Breaking Bad S01E02 |
</div>

Better? Maybe. Simpler, at least. At a minimum, the tests no longer duplicate irrelevant details. Each test states simply "if the schedule contains program P airing in time range R, then when we ask it what's airing at instant T in R, then it should return program P". Direct. Less waste. Obvious. Almost too obvious.

> When it seems too simple, then it's finally simple enough.

## Mechanical or Intuitive

I always feel more comfortable when multiple signals point me towards the same underlying design risk, because even on my worst days, I'm probably going to notice at least one of those signals. I categorize these signals as either _mechanical_ or _intuitive_, depending on whether they rely on knowing lower-level rules (mechanical) or higher-level principles (intuitive). In this case, I see a bit of both. Specifically, I saw/felt/noticed these signals:

1. Repeating the channel number value in every test, and applied the _mechanical_ rule of "remove duplication".
1. The word "current" in the name of the function and immediately guessed (thanks to my _intuition_) that it unnecessarily depended on a specific instant in time (namely _now_, since that's what "current" means).
1. The combination of **guide** and **channel number** as a kind of repository lookup (_intuitive_) being bound to a lookup within the result of the first lookup, and that usually spells trouble.
1. The tests as is would probably lead to creating a **guide** with either (1) only the data from a single **schedule** in it, or (2) arbitrary data from other, irrelevant schedules/channels, just to avoid silly implementations like "assume channel 45 is the only channel we have", which felt wrong (_intuition_) and obscured the link between the inputs and the expected result (_mechanical_).

Individually, maybe these signals don't suffice to suggest a change, but taken together, they beat me into submission and I change the design to make the tests easier to express more directly. Even if I miss the intuitive signals, **removing duplication of irrelevant details in the tests** usually points my designs in a healthy direction.

## One Last Thing

At best, `getProgramAt(guide, channel, when)` works well as a convenience method for a specific application that presents the guide information to the TV viewer organized by numbered channels. Accordingly, this function makes perfect sense as a facade method integrating the user interface to the domain of the system. Even so, I'd prefer to call it `lookupProgramInGuideAt(guide, channel, when)` to emphasize that we're willing, just this once, to bind together the details of where a channel's schedule comes from to looking up a program on that schedule. Moreover, I would really, really prefer to implement the function in a language with named parameters, like Smalltalk.

```
unnamedObject lookupProgramAt: (Date now) onChannel: 45 inGuide: guide
```

## References

Steve Freeman and Nat Pryce, [_Growing Object-Oriented Software Guided by Tests_](https://link.jbrains.ca/goos-book). Context independence. This book hammers you over the head with it. Enjoy.

J. B. Rainsberger, ["What Your Tests Don't Need To Know Will Hurt You"]({% link _posts/2010-01-14-what-your-tests-dont-need-to-know-will-hurt-you.md %}). An earlier, more generic, and frankly less clear version of this article.

J. B. Rainsberger, ["Injecting Dependencies, Partially Applying Functions, and It Really Doesn't Matter"]({% link _posts/2015-11-08-injecting-dependencies.md %}). Tests don't care whether they're function parameters or fields on an object, so take advantage of the flexibility!

J. B. Rainsberger, ["Becoming An Accomplished Software Designer"](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer). An outline of how I have used TDD to develop what Michael Feathers calls "design sense". It also explains why I teach modular design using TDD.

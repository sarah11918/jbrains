---
title: "Investing Wisely in Architecture Through Refactoring"
date: 2023-01-09
tags:
    - Simple Design
    - Refactoring
excerpt: >
    The stronger your refactoring skill, the more easily you can
    use architecture advice as guidelines instead of as rules to
    enforce. This makes it significantly more likely that you'll
    invest wisely in architecture, rather than over- or under-&#x200B;engineer.
---

A member of my [mentoring group](https://experience.jbrains.ca) started a discussion regarding this article: [Victor Rentea's "Overengineering in Onion/Hexagonal Architectures"](https://victorrentea.ro/blog/overengineering-in-onion-hexagonal-architectures/). They commented that the article made them feel uncomfortable, because Victor's advice seemed to be to drop all these architecture choices, because they represent overengineering. I wrote some words about this topic there and then I decided to refine my thinking and publish it here.

# The Short Version

We tend to use guidelines about design and architecture as protection against under-investing in design. This choice tends naturally to lead to a certain amount of over-investing in design before finding a helpful balance. I believe these two things:

1. This is a natural part of learning (for most people most of the time[^neurodiversity-disclaimer]) and therefore not a problem to solve.
1. Refactoring provides a clear path to investing wisely in design: not too much and not too little.

This explains why I don't directly try to stop programmers from "over-engineering" by following one of these Concentric Architecture[^define-concentric-architecture] schools, but instead teach them to engage these ideas with the mantra "don't worry about where the code goes, but rather how the code flows". The more confident they feel refactoring towards these dependency patterns, the more they can avoid over-investing up front in making every dependency "right" from their moment of birth.

[^neurodiversity-disclaimer]: The usual disclaimers about neurodiversity apply: not everyone will learn this way, but I feel fairly confident that it's a very very common way for people to learn. I might have this wrong and I would happily accept any research findings that suggest changing my mind.

[^define-concentric-architecture]: One of the various "ring"-style architecture styles, including Hexagonal/Ports-and-Adapters, Onion, and my Universal Architecture. Broadly speaking, these are rules for dependencies between modules (or classes or objects) that tend to reduce the cost of testing and changing code.

That's as short as I could make it. I tried.

# A Less-Short Version

Under-investing in design remains the norm on software projects. When programmers start to learn about investing in design, they rightly conclude that they need to invest _more_ in design, but they lack the judgment to invest _well_ in design, so they tend to invest _too much_ for a while. If they let themselves have the experience they need to refine their judgment, they'll eventually start noticing that they're over-investing in design, then try investing less until they find a helpful balance. I consider this a natural part of the learning process. I conjecture that **it's even a necessary part of the learning process**, although I have no real evidence for that claim beyond anecdotal observation.

Programmers who broadly prefer a Lightweight approach to software practice tend to practise some form of evolutionary design, such as [test-driven development](https://tdd.training). **They learn to use refactoring as a way to manage the risks of over- and under-&#x200B;investing in design**, because refactoring allows them to recover from both over- and under-&#x200B;investment when they encounter it. Over time, they converge towards a balance that they consider "just-enough investment", which I'm calling _investing wisely in design_.

All this explains why I practise the way I do and teach the way I do. I don't try to push specific architecture patterns, but instead teach refactoring as [a general practice aimed at internalizing the tradeoffs of various design choices](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer). I don't want to short-circuit your learning by trying to upload "the right answers" into your mind; instead, I try to provide you with the [simplest rules I know that are aimed at helping you invest wisely in design](https://blog.thecodewhisperer.com/permalink/putting-an-age-old-battle-to-rest). **I don't try to stop you from over-investing in design, because I recognize it as an important (even beneficial) stage of learning**; I encourage you to create a safe space where you can freely over-invest in design: by writing code test-first, by practising refactoring, and by surrounding yourself with advisors who can help you make sense of the consequences of your choices. Using this approach, programmers develop skill and judgment over time, rather than merely learn to follow a certain set of rules. Not only do they learn to invest more-wisely in design, but they also develop a skill that helps them navigate unfamiliar situations, including unfamiliar technology stacks, unfamiliar group dynamics, and unfamiliar (often dysfunctional) enterprises. They not only invest wisely in design but also learn to adjust their strategies to invest more wisely in more situations over time.

I interpret Victor's article as the outcome of a programmer allowing themself to go through this learning process. It describes one person's conclusions regarding which kinds of over-investing to watch out for, based on which specific forces they've encountered (been hurt by!) along the way. Unfortunately, some readers will interpret his advice as rules that they ought to follow in order to learn from his mistakes. We writers run that risk every time we write an advice article. (I'm risking that right now!) **Read context-free advice with extreme caution**. For example, where Victor suggests "collapse these layers", I suggest "be prepared to collapse these layers". This means at least two things:

- Learn how to collapse those layers so that you can do it when you need to. To do this, you'll probably need to overdo it more than a few times.
- [Understand your resistance (or someone else's!)](https://dhemery.com/articles/resistance_as_a_resource/) to collapsing those layers, so that you don't lose the opportunity to do it when you need to. Remember that you are not your code, but you are (presumably) a human and humans don't always react rationally to their environment.

The web is full of articles like this one, which provide helpful wisdom mixed up with advice to "always do this" and "never do that". Even the writers that don't directly write "always" and "never" typically know that their readers will tend to do what they suggest. Some of them even manipulate their audience by not outright telling them "always" and "never", but expecting them to insert those words into their minds themselves. **I teach refactoring ultimately as an antidote to all that**. A programmer who comfortably changes their design decisions avoids this fate. They don't need to pick "the right set of rules" to follow, because they feel confident changing their mind and adjusting their strategies to fit the situation. They rarely feel paralyzed by a choice because they feel comfortable changing it later. They learn from others, rather than adhere to a school of thought. They experiment and adjust, rather than try in vain to predict the future. They---dare I even write it?---_embrace change_.

(Sorry. Once I felt myself moving in the direction of those words, I couldn't resist.)

# A Few Gory Details

You can stop here, but if you're interested in a few more details, you can find them below.

## I Don't Call It "Engineering", Because It Mostly Isn't

First, you'll notice that I shy away from the terms "over-engineering" and "under-engineering". I do this for at least two reasons:

1. I consider what we programmers do as _craft_, not _engineering_.
1. I prefer more transparent terms that more-directly express what we mean.

For this reason, at least as of early 2023, **I prefer to talk about investing in design** where other people talk about the "level of engineering". Notice that I also take the Martin Fowler view of architecture[^fowler-view-of-architecture], which means that I typically talk about _design_ instead of architecture and treat architecture decisions as design decisions with one additional, particular, strong constraint.[^when-i-say-architecture] When Victor writes "overengineering" and I write "over-investing in design", I believe we mean the same thing. Close enough, anyway.

[^fowler-view-of-architecture]: Martin has described "architecture" as the set of "irreversible" design decisions. I interpret that to mean design decisions that seem to expensive to change and therefore which we can't afford to allow to freely emerge. Instead, we need to commit earlier to these design decisions than a Lightweight practitioner would otherwise choose to do.

[^when-i-say-architecture]: I tend to use the word "architecture" to an audience that expects me to use it, then immediately frame architecture as "design decision that seem too expensive to change", after which I feel more confident not using the word at all with them.

## Under-Investment in Design Remains Very Common

I don't have research findings to support this claim, so I would happily change my mind if presented with surveys that showed me otherwise. Most projects most of the time under-invest in their design. They create [Big Balls of Mud](http://www.laputan.org/mud/). They do this for all the typical reasons: subjectively-felt pressure to deliver features sooner, having difficulty articulating the value of cultivating a "better" design, and even not understanding what "better" design even means, and even generic patterns of management dysfunction, including demanding teamwork while rewarding individuals for individual contributions. **Even though you can read thousands of articles about over-investing in design, under-investing remains the norm**. I'm not complaining: it provides me with an income stream and reminds me of the value in what I do and teach.

<aside>

You can read more about understanding and overcoming some of the forces that lead to under-investing in design in ["The Eternal Struggle Between Business and Programmers"](https://www.thecodewhisperer.com/permalink/the-eternal-struggle-between-business-and-programmers).

You can help your (fellow) programmers debate "better" design more productively through activities such as ["What's Not To Like About This Code?"](https://www.jbrains.ca/sessions/whats-not-to-like-about-this-code).

</aside>

## Over-Investment Leads To Wise Investment

You might have heard the old joke. It's an old joke for at least two reasons: it's corny and it's right.

> Good judgment comes from experience.
>
> Experience comes from bad judgment.

If you don't allow yourself to make questionable choices, then you won't learn what makes them questionable choices. It's the difference between "20 years of experience" and "1 year of experience 20 times". This explains why I don't try to teach programmers "the right way" to design; instead, I try to teach them a way to discover better ways of designing over time. And not everyone agrees on what constitutes "better" here. I don't mind.[^what-is-good-design]

[^what-is-good-design]: I think of design as the activity of organizing source code in a way that reduces the cost of programmers figuring out how to change it confidently and safely in the future.

When writers say "always do X" or "never do X" to programmers about design choices, I worry that they are robbing the readers of an opportunity to develop "good" judgment. Even when those writers don't explicitly say "always" or "never", their mere role as influential leaders causes many of their ardent followers to insert the words "always" or "never" in their mind as they read, so they need to be aware of that. This explains why I take great care to distinguish various grades of advice: the things that I tend to do from the things I prefer to do from the things that I almost always do. I almost always use Inbox Technique while I'm working, but I merely tend to write the test first. I prefer to guide designs to evolve by refactoring, but I don't insist on pushing up-front design decisions out of my mind as though trying to "push away the bad thoughts". On the contrary, I trust myself to make design decisions up front precisely because I trust myself to refactor away from the decisions that ultimately don't work as well as I'd expected.

I wouldn't have developed this trust and this skill if I hadn't felt free to over-invest in design on a few projects [with the help of a team of advisers](https://groups.io/g/testdrivendevelopment) who guided my learning along the way. Now I have the pleasure of working with others as [one of their trusted advisers](https://experience.jbrains.ca).

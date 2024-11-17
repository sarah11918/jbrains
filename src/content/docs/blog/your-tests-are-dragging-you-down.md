---
title: "Your Tests Are Dragging You Down"
date: 2015-03-28
tags: []
---
I've written in the past that [integrated tests are a scam](https://bit.ly/QWK7do), but that's not what I mean here.

<aside>Even if you're not a programmer, read on. There's something in this for you, too, and you'll probably want to share it with the programmers around you. I promise.</aside>

Dear programmers, your tests are probably dragging you down. Here we have another delightful irony of agile software development, this time related to test-driven development. I give you The Fundamental Irony of Test-Driven Development.

<figure><p class="highlight">If you practise test-driven development, then depending on how you manage your short-term tasks, you run the risk of *increasing* your stress levels compared to not doing test-driven development at all.</p><figcaption>The Fundamental Irony of Test-Driven Development</figcaption></figure>

Strange, isn't it? Here's how it works:

1. Practising TDD encourages you to break your work down into microtasks: in many cases, individual tests. This clarifies what you intend to do, by breaking it down into more, small tasks.
1. You're used to keeping the salient details of your current work in your mind's short-term memory, even when you work for a few hours at a time.
1. Now, you have even more details to try to keep in your head while you work. Congratulations!

It reminds me of some companies who adopt Scrum, switch from weekly status meetings to monthly sprint reviews, and the flow of information about the progress of the project actually goes *down*. Great, no?

This bears repeating.

<div class="highlight space-above-paragraph" markdown="1">
Practising TDD while keeping everything in your head:

+ **decreases** focus
+ **hurts** productivity
+ **wastes** precious energy
+ **increases** stress
</div>

You didn't see that coming, did you? Maybe you did.

It doesn't happen right away, mind you. You probably found TDD a relief when you first started practising it. The constant sense of completion. The continuous positive feedback. The orderly progress towards working, solid code. It feels fantastic... but maybe you've noticed a few unexpected side effects.

+ Tasks drag on: often when you think you're done you notice one more test that you'd forgot to write.
+ Thinking about all those error cases and side effects up front makes every feature feel like *so much work*.
+ In the planning meeting it seems like you need half a day, but once you get going it feels like it's never going to end.
+ When you get near the end of a task, you can't shake this feeling that you've forgot something important.

In your weakest moments, it might encourage you to long for the days when you didn't think about your work quite so systematically and carefully. It's like writing your second book: once you see how much work it takes to write one, many authors can't stomach going through it again.

## Kent Beck To the Rescue!

Naturally, Kent Beck had good advice for us way back in his seminal book [_Test-Driven Development: By Example_](https://link.jbrains.ca/172z2KZ). He encouraged us to start a programming session by writing a *test list*: literally a list of the tests that we think we'll need to write. As we make tests pass, we cross them off the list; as we think of more tests to write, we add them to the list. When we've crossed the last item off the list, we're done! Simple.

As you might expect, this advice can help anyone, and not just programmers. It just so happened that Kent aimed the advice at programmers writing tests. The more generic version of this advice can help everyone:

<p class="highlight" markdown="1">When you sit down to work, start by getting things out of your head!</p>

## A Few Basic Rules

{% pullquote %}
If you're a programmer, then the moment you hear about a programming problem, you probably start solving it in your head. {"Your enthusiasm will drag you down if you don't do something about all those ideas buzzing around inside your mind."} Thinking in terms of tests helps organize your thoughts, but if you keep them all inside, they'll crush you. Try this the next time you sit down to program:
{% endpullquote %}

1. Get yourself something to write with and something to write on.
1. Sit comfortably. (So many people overlook this one.)
1. Take all the ideas buzzing around your mind and *write them down*.
    + Draw some high-level design diagrams
    + List the tests that have leapt to mind
    + List any refactorings that you already know you might need to do
1. Once your mind feels quiet, pick a test and start test-driving.
1. As ideas pop into your head, quickly write them down.
    + Add some tests or refactorings to your list.
    + If unrelated work pops in your head ("I need to prepare for that damn meeting tomorrow morning..."), write that anywhere else: on another page, in a notebook, wherever.
1. As you make tests pass, cross them off the list.
1. As you perform the refactorings you had in mind, cross them off the list.
1. Repeat until you can't think of anything more to do to complete your task.

OK: more than a few rules, but only because I want to leave less room for differences of understanding or interpretation.

A few things to keep in mind:

+ Just because you write the test or refactoring on your list, that doesn't mean that you have to do it. If you don't need it, then *don't do it*.
+ When first getting things out of your head, don't try to list *all* the tests that you *might* need. Focus on listing all the tests that immediately come to mind. First, **unburden yourself**, then you'll find it easier to notice that you've missed something.
+ I write tests from the top of the card or page and refactorings from the bottom. I guess that's just personal style.
+ When you finish your programming task, if you have other work left over, then put it wherever it needs to go in order for you to follow up: email, calendar, to do list, whatever system you use.[^no-system]

[^no-system]: If you don't have a system, then you'll need one, but let's solve one problem at a time.

## Even Simpler...

[It's no good to anyone in your head, Mozart. Write it down.](https://www.imdb.com/title/tt0086879/?ref_=fn_al_tt_1)

Not only that, but I like the satisfaction of crossing things off and ripping up cards when I'm done with them. What can I say? Little things like that amuse me. Whatever works.

So don't let your tests drag you down. Lighten the load by getting them out of your head. Try it now! I'll wait.

## References

Kent Beck, [_Test-Driven Development: By Example_](https://link.jbrains.ca/172z2KZ). When you reach a certain point in studying a field, you long you read the classics. If you've reached that point, then read this classic.

David Allen, [_Getting Things Done_](https://link.jbrains.ca/WOXFIr). When I first read _Getting Things Done_, with its emphasis on getting things out of your head, I immediately recalled Kent's "Test List" trick. As much as Test Lists helped me with programming tasks, getting everything out of my head has helped with the rest of my work. You can't imagine the difference until you try it. David's trademark: _Your mind is for having ideas, not holding them._ Kinda cultish, but true.

J. B. Rainsberger, ["Getting Started with Getting Things Done"](https://link.jbrains.ca/getting-started-with-gtd). If you're not eager to read 200 pages of productivity advice, then start with a handful. I give you enough detail to try the basics of the system for a few days and decide whether you want to learn more. How agile of me!

## Reactions

<blockquote class="twitter-tweet" lang="en"><p>Been working like this for more than a year, probably influenced by <a href="https://twitter.com/jbrains">@jbrains</a> workshop <a href="https://t.co/xOuN1I75kY">https://t.co/xOuN1I75kY</a></p>&mdash; Giorgio Sironi (@giorgiosironi) <a href="https://twitter.com/giorgiosironi/status/588579169178488833">April 16, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

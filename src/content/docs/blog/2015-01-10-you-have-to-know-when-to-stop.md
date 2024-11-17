---
title: "You Have To Know When To Stop"
date: 2015-02-15
tags: []
---
After one of the mob programming sessions I did with [RubySteps](https://www.rubysteps.com) last year, a viewer singled out this as a valuable piece of advice:

> One of the most important things that a programmer must learn how to do is to stop when they get to the end.

I remember the first time I encountered this issue: in Steve McConnell's excellent book [_Rapid Development_](https://link.jbrains.ca/1tU7uTW), which I remember reading in 1997. (Wow! I should read it again.) He referred to "gold-plating" as one of his Classic Development Mistakes. You might immediately think, _Uh... [stop it!](https://link.jbrains.ca/bob-newhart-stop-it)_, but until then I hadn't realized just how pervasively programmers in particular tended to do this. They would continue working on something, even though they'd solved the underlying problem. This sounded utterly insane to me. Suddenly, I saw it everywhere. I noticed when others did it. (They loved that.) I noticed when I did it. I didn't really understand why.

When I started practising test-first programming (and later test-driven development), this problem slowly disappeared&mdash;at least for a while. (Read on; you'll see why.) For years, one of my IBM office mates challenged me to justify writing the tests first. He argued that as long as he wrote his tests and production code in tiny cycles, it didn't much matter which he wrote first. For years, I never had a good answer for him. Of course, now that I do, I have no idea where to find him.

## Write Until You Get To The End, Then Stop

Among the microbenefits of writing tests first: knowing when to stop. I approach test-driven development roughly like this:

1. Write a failing test that describes a very small bit of new behavior.
1. Run the tests to watch the new test fail.
1. Write just enough production code to make the tests pass.
1. Run the tests to watch all the tests pass.
1. Now that I have a solid pool of change detectors, try to improve the design, usually following the [Simple Design Dynamo](/permalink/putting-an-age-old-battle-to-rest).

All these steps help me write better code, but I want to focus on just two of these steps.

First, we have the act of writing a failing list, which describes when to stop. You can't know when to stop if you haven't thought about when you _should_ stop. I imagine that programmers gold-plate in part because they don't really understand the goal behind their task. They might not even know the goal behind a microtask on the way to completing their larger task, _even though they themselves have divided their task into microtasks_. Amazing, isn't it? They might have a vague idea of the steps, but writing tests encourages the programmer to articulate very clearly the goal of the next step. By doing this, one can't help but know exactly what "there" looks like, so as to stop when arriving "there".

{% pullquote %}
In addition to knowing where to stop, we need to know when we've got "there". For this purpose, the step "write **just enough** production code" matters most. When I write tests first, I find it much easier to judge when I've written just enough production code, because the new tests now passes and I haven't broken anything that used to work. {"When I see the green bar, I know I've arrived "there"."} Doing this brings more benefits than only that:
{% endpullquote %}

* I know when to stop writing code right now related to the current task/feature/behavior.
* I train myself in general to stop writing code once I've written enough.
* I train myself to think about what it would mean to have written enough code, so that I get better at spotting it when it happens.

It might seem like overkill to you, but remember: programmers famously tend to gold-plate, and so any technique that helps a programmer [ingrain the habit](#quick-win) of stopping will probably help. Test-first programming fits the bill.

{% comment %}
I'd like to make this first sentence a pull quote, but the octopress-pullquotetag tag doesn't markdownify the text of the pull quote, and even if it did, it looks like the CSS rules don't render the HTML correctly.
{% endcomment %}
**Imagine that you had on your computer a red flashing light that signaled _that's enough_ as you wrote code.** When you saw it flash, you could stop, then go on to the next microtask. Wouldn't that help you finish your work sooner? Wouldn't that help you question whether you need to do what you have in mind next? Wouldn't that help you avoid unnecessary work in the first place? It sounds great to me! Writing tests first gives me exactly that, so I do it even to this day, lest I fall back to gold-plating.

## Danger: Gold-Plating the Design

{% pullquote %}
The Universe, however, in its desire to respect the Law of Conservation of Irony, intervenes. Although I write the tests first in order to tell me when to stop writing code, **the refactoring step gives me a new opportunity to flex my gold-plating muscles**. {"I love refactoring because I never have to stop."} I can always find something more to improve. I can go around the [Simple Design Dynamo](/permalink/putting-an-age-old-battle-to-rest) again and again and again... try to stop me!
{% endpullquote %}

Now you see why I pointed out more benefits than simply "I know when to stop writing code for the current microtask". Knowing that the programmer mindset tends to lean towards gold-plating in general, I continue to write tests first in order to **train myself to remain aware of my own tendency towards gold-plating**. As a result, I do it less often, and in a variety of situations.

* I learn to refactor just enough to keep new features flowing without turning modularity into a means unto itself. I don't want to turn clean code into a fetish.[^reduce-volatility]
* I learn to build just enough features to keep new customers flowing, rather than trying to deliver the perfect product.
* I learn to edit just enough in order to convey my ideas clearly, rather than trying to turn my work into literature.

[^reduce-volatility]: I only refactor [in order to reduce volatility in the marginal cost of features]({% include links/eternal_struggle.txt %}). Don't you?

I could probably find more, but that will do for now. What do you do in order to counter your own tendency towards gold-plating? It might have nothing to do with code. I'd love to learn your secrets either at [tell.jbrains.ca](https://tell.jbrains.ca) or in the comments.

## References

J. B. Rainsberger, ["Putting an Age-Old Battle to Rest"](/permalink/putting-an-age-old-battle-to-rest). The article that turns the four elements of simple design into the Simple Design Dynamo.

Steve McConnell, [_Rapid Development_](https://link.jbrains.ca/1tU7uTW). One of the pre-agile books that had a significant impact on how I thought about professional software development.

<a id="quick-win"></a>J. B. Rainsberger, ["Change Your Life One Habit At A Time"](https://blog.jbrains.ca/permalink/change-your-life-one-habit-at-a-time). For more _Quick Win_ articles like this one, [click here](https://sign-up.jbrains.ca).

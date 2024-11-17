---
title: "What Good is Subclass to Test, Anyway?"
date: 2015-04-07
tags:
---
> We recently ran a legacy code retreat based on your format. People were questioning the value of subclass-to-test in a real world scenario. The best reason I could come up with for myself was that it's a smaller step to separating out responsibilities from a class.
>
> How would you frame the value of subclass-to-test, and in which contexts would you use it?

I view Subclass to Test as an intermediate step towards other refactorings like Replace Inheritance with Delegation, Introduce Named Constructors, and especially Separate Lifecycle Management from Lifecycle Behavior. I see Subclass to Test has a highly mechanical way to start identifying how to split things apart. (I just follow the steps and don't have to know where the design is going yet.) It's easy to say "we need to split things apart", but Subclass to Test helps me see specific patterns, for example, in the difference between setting up state and doing something interesting. Referring to the [Legacy Code Retreat code](https://www.github.com/jbrains/trivia), does your test check addPlayer() or roll()? Do you only call addPlayer() so that you have players who can roll()? What if you could call roll() on an object with the necessary players without worrying about how to make that happen? What if you could call roll() on an object that doesn't care about players?! If we separated the Board from the Rules from the Players, then it would be easier to add things like save/restart, which would make playing the game online more robust.... By only committing up front to Subclass to Test, I remain open to options without over-committing to one, specific, narrow refactoring.

So I see two main benefits to Subclass to Test:

* I don't know where the design needs to go, so I can start with Subclass to Test, look for patterns in the subclasses, then decide later.
* I think I know where the design needs to go, but I don't feel comfortable going there safely in one big step, so I can start with Subclass to Test, do those steps safely and correctly, then continue with the design improvements that I had in mind. (Sometimes here I realize that I was wrong, and I have a chance to change direction without undoing all my good work.)

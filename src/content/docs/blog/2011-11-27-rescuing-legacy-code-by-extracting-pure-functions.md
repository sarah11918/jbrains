---
title: "Rescuing Legacy Code by Extracting Pure Functions"
date: 2011-11-27
---
After running a handful of [Legacy Code Retreats](https://www.legacycoderetreat.org) I've had the chance to try a number of exercises related to rescuing legacy code. I'd like to share one that has met with very positive reactions from people: extracting *pure functions*. I use the term *pure function* to describe a function that only operates on local variables and parameters, but does not touch any state outside the function. No object fields, no global data. I have very little experience in functional programming, so I hope I use the term in a standard way.

No doubt you already know about the [Composed Method](https://c2.com/ppr/wiki/WikiPagesAboutRefactoring/ComposedMethod.html) design pattern, which we commonly use to help understand code as we read it. Most commonly you encounter a block of code with a comment that describes what that code does. You then extract that block of code into a method whose name matches the comment. I've used this technique for well on a decade to raise the level of abstraction in code, help code document itself, and eliminate misleading comments. While introducing these methods helps me read the code, it sometimes hides the tangle of dependencies that makes separating responsibilities so difficult. For this reason, I recommend trying to extract pure functions instead.

To introduce a pure function, start with a block of code and extract a method for it. Now look at all the fields and global variables that the method reads and introduce each one as a parameter to the method. Now look at all the fields and global variables that the method writes to and turn these into return values. Where the old code invokes the new function, assign each new return value to the corresponding field or global variable. You know you've done this correctly if, of course, the overall behhavior of the program hasn't changed and you can mark the new function as `static` or whatever your language calls a class-level function.

In some languages, like Java, you'll have to introduce a new little class to allow you to return multiple values from the new function. If you don't want to do that right away, then return a `Map` of return values. Once you see that you need to return similar `Map`s from different functions, consider replacing those `Map`s with a new class. Perhaps that new class will attract some code!

When I've used this technique, two key things have happened: either I've noticed duplication in the parameter lists of the new functions or introducing a parameter has changed the behavior of the system. In the first case, I introduce Parameter Objects for the duplicated parameters, which then probably attract code and become useful domain objects. In the second case, I've detected temporal coupling, which requires me to separate the function into two smaller ones so that some output from the first becomes input to the second. This helps me uncover cohesion problems, usually of the type of different things written too close together.

I realize that an example would help right about now, but I would rather create some screencasts than write out examples in code, but I don't know when exactly I intend to do that. I wanted to share this idea with you without waiting for the energy to put together a suitable screencast.

I invite you to try introducing pure functions into some legacy code and practising the technique as a kata. Get used to the various maneuvers, like introducing Parameter Objects or Return Value Objects or solving temporal coupling by splitting the function in two. It sounds crazy, but I'd like to try a Legacy Code Retreat where we practise only this technique all day. I don't know whether anyone else would find it valuable enough to try it together for an entire day, over and over and over.

Would you? Add your comments below.


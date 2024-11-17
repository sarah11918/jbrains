---
title: "Injecting Dependencies, Partially Applying Functions, and It Really Doesn't Matter"
date: 2015-11-13
lastUpdated: 2015-12-30
tags:
  - Dependency Inversion Principle (DIP)
---
You might have noticed _dependency injection_ gaining popularity in recent years. You might also have noticed some notable figures (I'm thinking of [Kevlin Henney](https://www.twitter.com/KevlinHenney)) who _appear_ to be bad-mouthing dependency injection, when really they are simply taking away what they feel is a veneer of mystery from the term.[^appear-to-be-bad-mouthing] I must say that I appreciate their doing so without pretentious use of the annoying word "demystifying". (Simply ignore my own "demystifying" article by most certainly not clicking [here]({% link _posts/2013-01-29-consequences-of-dependency-inversion-principle.md
%}). While on a three-hour-long car trip it occurred to me&mdash;some would say much too late&mdash;that injecting dependencies, particularly through the constructor, acts precisely like partially applying functions. This leads to a couple of potentially useful conclusions:

  * This explains why practising TDD has seemed to be pushing my object-oriented designs in the direction of what appears to be a functional programming design style.
  * When test-driving, I see no good reason to rush to label a parameter as a collaborator, so I can defer the decision as long as I want.

In other words, when practising TDD, if I ever have a moment of doubt as to whether a parameter belongs with the object's constructor or the function/method itself, I stop thinking, put the parameter on the method, and just keep going. No worry, no penalty, no problem.

## The Tests Don't Care

I write _microtests_[^origin-of-microtests], meaning really small tests. I design my microtests to be independent of one another, so that the side-effects of one test don't affect the results of running another test in the same test run.[^independent-tests] This encourages me to design my production code to make it easy to pass in any useful details ("inject" them), like collaborating services, configuration information, and, of course, request data. Don't be fooled by my use of _request data_: I just mean parameters that vary from request to request, such as the 49 in a call to `sqrt(49)`.

Aha! Since every test lives in its own little world, and sets everything up before running and tears everything down after running, then _every parameter in a test is request data_!

A typical application runs for some non-trivial amount of time. Let's say "days", just to make it more concrete. While the application is running for days, certain details about the application don't change much: connections to databases, web services, the file system. These details might change from run to run, but while the application is running, often just as a performance optimization, we don't change these details. Accordingly, we consider these application-level details quite stable and probably configure them at the very top of our application, just once, and then use those objects in the rest of our system without changing their state. (Worse, we probably scatter these details all over the damn application, _putting them directly into code_ through hideous anti-patterns like the so-called "Service Locator".)

A typical user interacts with our application for some non-trivial amount of time. Let's say "minutes", just to make it more concrete. While the user is interacting with our system, certain details about that interaction don't change much: the user's authentication credentials, their permissions to perform various actions, their user profile information. Accordingly, we consider these session-level details relatively stable and probably store them in some object attached to the user, changing their state rarely. (Worse, we probably use the session as a dumping-ground for data that we have to pass between ill-designed, overly-interdependent transaction scripts.)

This leaves the details of each individual micro-interaction that the user has with our application. Each time the user presses a button or selects an item from a list or issues of command from our handy command-line interface. These details change wildly from request to request. Accordingly, we treat them as precious snowflakes, accept them as parameters, put them lovingly on the stack, and then throw them away when we've crafted our response and sent it, with care, to the user.

**The tests don't need any of this**, because each test acts like a separate run of the entire application.

<p class="highlight" markdown="1"><span style="font-variant: small-caps">**Do not, under any circumstances,**</span> interpret this to mean that each test runs the entire application from end to end. No. **NO**. [Integrated tests are a scam](https://integrated-tests-are-a-scam.jbrains.ca), remember?!</p>

I mean this: when I write a microtest, which means that it involves **a very small part of the application**, I can treat each test as a separate run of that part of the application, **and the distinctions between request data, session data, and application data have no value for me at all**. The "application", such as it is, runs for such a small amount of time, that these distinctions literally have no meaning _in the context of the test_. On the contrary, promoting parameters to the session or application level&mdash;which mostly amounts to caching their values&mdash;becomes a performance optimization that has value to the application as a whole, but not to the tests. (Moreover, they make the tests harder to understand in most cases.)

<p class="highlight" markdown="1">
In fact, when I try to tease apart highly-interdependent legacy code, I spend a lot of energy moving changing details to their "proper" scope. This is why "extract pure functions" works so well: it reduces every detail to a request-scope parameter, then I can use patterns of duplication to figure out how to repackage them more sensibly.
</p>

## To A Test, Everything Is Request Data

This means that, when we write a test, _everything_ is request data. **Everything can be a function parameter and the test doesn't mind**.

Great news! This means that, especially when test-driving, we can freely pass every salient detail to the object we're testing as a method parameter **if that's convenient**, then decide later, once the tests pass and we feel all warm and tingly, which parameters to promote to the constructor of some object. Some of those objects have session-oriented lifecycles (like a Shopping Cart or a Locale) and some have application-oriented lifecycles (like an Authentication Service or an Order History).

But in the tests&mdash;oh, boy!&mdash;we can just list all the salient details, make them all parameters, invoke the function that interests us, then go on our merry way checking whatever we need to check.

## So, Stop Worrying... And Arguing!

If you test-drive, then you can literally start by making everything a function parameter to start, then **remove duplication** and **improve names** to help identify which parameters you should promote to the constructor. You would end up with a design in which details change at their proper rates. It would totally work. I might even try it.

Mostly importantly, if you find yourself working with someone who cares deeply about getting this point right, then you can either (1) let the parameter stay on the function until duplication makes it clear that it's time to promote it to the constructor or (2) let the parameter go to the constructor, secure in the knowledge that it is a purely mechanical refactoring to demote it to the function when it becomes clear that that's warranted. No arguments. It'll be fine.

## Uh... Partially-Applied Functions?!

Oh, yes. And, it so happens, this is exactly what partial application helps with in functional programming languages. We can design functions to take 20 parameters, if we want, but if 18 of them change infrequently (but at the same rate), then we can apply `f20` to those 18 parameters, making function `f2` that takes only the last two parameters that change most often. I will prefer to invoke `f20` in tests for the sake of explicit links between inputs and expected outputs, but I will prefer to invoke `f2` in the application for the sake of avoiding duplication, and probably as a performance optimization. (I don't know: do compilers like the one for Haskell have enough magic to optimize this for me? Probably not, but how cool would that be?!)

I guess this explains why I've had this feeling for several years that practising TDD has nudged my OO designs in the direction of FP-style design. I've been partially applying functions, and I even [knew that I was](https://www.harukizaemon.com/blog/2010/03/01/functional-programming-in-object-oriented-languages/)&mdash;an object is, after all, a cohesive (we hope) collection of partially-applied functions&mdash;but I didn't understand this particular aspect of the significance of those facts until I had a few hours riding in a car for it to occur to me.

[^appear-to-be-bad-mouthing]: I consider it categorically unfair to interpret what Kevlin writes or [Chris Oldwood](https://chrisoldwood.blogspot.co.uk/2014/04/terminology-overdose.html) writes as "bad-mouthing" the _concept_ of dependency injection, but unfortunately, a careless reading of their work might suggest that in the mind of the careless reader. They mostly object to coining a new term for an old idea, with which I agree. Even so, _dependency injection_ remains known as a term of art, so I just want to roll with it.

[^origin-of-microtests]: I learned the term from [Michael Hill](https://www.twitter.com/GeePawHill), who uses it in part to avoid the whole "what is a unit?" navel-gazing exhibition.

[^independent-tests]: I learned this principle from [Kent Beck](https://www.twitter.com/KentBeck)'s "daily bug reports" story, which I think I first read in one of the early [XP](https://link.jbrains.ca/UNqq44) [books](https://link.jbrains.ca/10Ys86c).

## References

J. B. Rainsberger, ["Demystifying the Dependency Inversion Principle"]({% link _posts/2013-01-29-consequences-of-dependency-inversion-principle.md
%}). A few ways to explain this critical-but-often-misunderstood design principle.

Simon Harris, ["Functional programming in object oriented languages"](https://www.harukizaemon.com/blog/2010/03/01/functional-programming-in-object-oriented-languages/). A wonderful answer to the question "How does design change between OO and FP styles?"

Ingmar van Dijk, ["The History of Microtests"](https://www.industriallogic.com/blog/history-microtests/). A retrospective on the origins of the term _microtests_.

Kent Beck, [_Test Driven Development: By Example_](https://link.jbrains.ca/172z2KZ). This remains the classic text on the topic, complete with examples of the tiny steps that help me keep the cost of mistakes low.

Chris Oldwood, ["Terminology Overdose"](https://chrisoldwood.blogspot.co.uk/2014/04/terminology-overdose.html). Don't let a new term get in the way of understanding an old idea.

Kris Jenkins, ["What Is Functional Programming?"](https://blog.jenkster.com/2015/12/what-is-functional-programming.html). Another article that argues both sides of implicit dependencies, describing functional programming as designing side effects with care. (I'd call this "programming", myself.)

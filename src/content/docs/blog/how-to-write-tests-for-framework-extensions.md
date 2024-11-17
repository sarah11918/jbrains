---
title: "How to Write Tests For Framework Extensions?"
date: 2021-03-14
tags:
    - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
excerpt: >
    Programmers get into trouble when they try to use one set of tests to
    check their code and someone else's framework. Clarifying the intention
    of the tests and isolating these two kinds of behavior from each other
    tends to lead to better results overall.
---

# A Reader Question

Recently I came across attempts to verify framework-based behavior. This is what I saw:

We introduce a framework like JPA Query Builder, RestEasy, or Spark. Then we get two kinds of code:

- the code which uses a sequence of framework-specific calls (like run-time JPA query building)
- the code which uses annotations to configure system behavior (like JAX-RS annotations for ReST paths)

Now I start seeing two kinds of unit tests.

The first kind relates to verifying framework calls: it verifies the code makes 'expected' calls to the framework (like building JPA query via multiple API calls or calls Spark API to configure processing or ReST requests). This is a unit test, since the framework API is mocked, but then to me it makes little-to-no sense. We only care about some final call to the framework (with an object built via API calls) or we expect the framework to handle incoming requests correctly because we configured it properly in run-time. An alternative to this kind of test may be an integrated test, where we run our method in a live environment where the framework is instantiated inside its runtime container (within which our code is run as well). As an example, a JPA query builder-based code is  run in some kind of JPA-enabled container to make sure that database calls have expected results.

In fact, the second kind of tests are exactly those integrated tests, which verify that framework is configured correctly. For instance, an HTTP-enabled container gets initialized and we run just enough of our code (with the latter annotated with JAX-RS annotations and may be even having some dependencies mocked) to make it possible to send live HTTP requests to the container and verify some kind of expected outcomes.

So, the question is can we safely say, that given visual inspection (or something) the integrated checks are not really needed for annotation-based code? What do we really need to test here?

This still leaves the question about the meaninglessness of verifying run-time framework configuration against API mocks.

May be those kinds of integrated checks are unavoidable?

Also, as a dessert a different question.

Is there a guide on mock boundaries? Basically, the question was shouldn't we mock everything including language API  libraries (like `Arrays.length`)? If not, then how far should we push the envelope of mocking? Is there any reasoning-based guidance (not really an inflexible dogma) about when to stop mocking?

# Discussion

I don't feel certain that I know your intention when you say "unit test". I avoid using this term because many people disagree on what is a "unit", and then they spend a lot of time arguing about this question. I believe that they waste their time and energy when they do this. I only mention this for two reasons:

- I'm explaining why I use different terms from "unit test", in case this confused you.
- I'm trying to encourage more people to stop using this term when some other, more-specific, clearer term is available.

Even if this doesn't inform the rest of my answer, I wanted to mention it, in order to avoid confusion in the future.

## Consider the Goal of Each Test

Regarding your first kind of test, I think I notice a common risk: writing one test to check two parts of the system. In particular, I notice that programmers confuse themselves by trying to use a single test to check both their understanding of how the framework works and the behavior that they want to deploy into that framework. I find that my results improve when I check each kind of behavior in its own test.

You might have experienced this problem before: you're writing code in an unfamiliar framework, it doesn't work, and you don't know whether the problem lies in your code or their documentation. Everyone reacts differently: some people assume that that their code is wrong, some assume that the  framework documentation is wrong, and other people stubbornly refuse to guess. Almost everyone wastes a lot of energy, feeling some kind of anxiety from the uncertainty. **I avoid this problem by clarifying the intent of each test.**

When I notice this risk in my code, I stop and write tests to explore my assumptions about how their framework works. Since I'm exploring their framework and not my code, I choose examples based on how I think the framework behaves, rather than based on the application I'm trying to build. This leads me to write classical Learning Tests for their framework, which act as classical acceptance tests for their framework. These aren't even tests for my application! They act instead as enhanced documentation for the framework&mdash;the kind of documentation that I wish the framework authors had written.

When I do this, it becomes easier to see the boundary between their framework and my code. This makes it even easier to write tests for my code that focuses on my code rather than on some fuzzy combination of my code and their framework. When I do this, it becomes easier to identify the source of problems when tests fail. Even better, when I try to write one of those tests near the boundary between their framework and my code, it becomes clear quite soon that **I don't understand something well enough even to express the assertions**. This leads me to focus on the part of the code that I need to understand better. Sometimes it's their framework and sometimes it's my transaction script or domain code or whatever.

When I separate these kinds of behavior from each other, then I avoid that feeling of confusion: _Why am I checking a framework function call when I'm interested in how my controller interacts with my domain model?_ or _Why am I stubbing this framework function when I really care that my controller invokes the right update in my model?_ These questions signal me that I'm writing integrated tests with unclear boundaries, unclear focus, and unclear intentions. When I take a moment to isolate these kinds of behavior from each other, the intent of the tests becomes clearer and this kind of confusion disappears.

If you want to verify that you know how to configure the framework correctly, then _don't use your application code to do that_. Instead, create a tiny project, integrate the framework, then write tests (integrated or isolated, as you need them) that help you feel confident that you understand how to configure the framework. These tests will help you feel confident that you understand the effects of your configuration choices, but they won't necessarily help you feel confident that _this_ application requires _that_ set of choices. You might need to write some system tests (integrated tests) to get that kind of confidence, but you probably don't need to write a large number of them, and you almost certainly don't need to write a new set of them for each new part of your application as you build it. Quite often, configuration choices affect system-level properties that go beyond computing the right answer, into things like throughput, response time, and memory usage. If I run automated tests for these, I tend to write system tests, such as load tests; otherwise, I monitor the running application in production to measure its performance.

## Integrated Tests Or Isolated Tests?

When integrating with the framework, I typically write integrated tests to explore their framework, and then write microtests after I've explored "enough" and feel confident that I understand **the contract of the framework extension point**. I end up writing more integrated tests both early in the project and whenever I need to explore some part of the framework I hadn't yet used. As I use the same part of the framework more often, I don't need integrated tests for that and I trust my contract tests&mdash;my assumptions about how the framework behaves&mdash;more and more.

Annotations (in Java, or attributes in .NET) tend to force me to write more integrated tests. I accept that. I hope that I end up using a small number of well-defined, well-tested, well-documented annotations. If not, then I end up spending some time and energy writing the tests and documentation that I wish the annotation authors had provided. I usually expect the cost of this work to be higher early in the project and to drop to near-zero relatively soon after that. Eventually the annotations become just another kind of code that we know deeply and trust, so we focus our testing efforts in other parts of the system.

As for whether manual inspection suffices, you have to decide that for yourself. Remember: **test until fear is transformed into boredom**. If you feel fear, then write more tests; and as you feel more confident, trust your visual inspection more. This becomes a self-regulating system as long as you follow one simple rule: **when something blows up in your face, then write more tests for that part**.

## A Flexible (Not Dogmatic) Approach To Using Test Doubles

My advice on this has not changed much over the years. I wrote something about this in 2010, based on advice I'd been following and giving for years. You can read the details in ["When Is It Safe To Introduce Test Doubles?"](https://blog.thecodewhisperer.com/permalink/when-is-it-safe-to-introduce-test-doubles). Please remember that these are general rules, not to follow exactly, but to follow unless you know exactly why you're choosing not to follow them. In addition to this advice, I recommend that you "don't mock types that you don't own", generally speaking. You can read more about that starting at ["Don't Mock Types You Don't Own"](https://davesquared.net/2011/04/dont-mock-types-you-dont-own.html) and continuing to the classic ["Mock Roles, Not Types"](https://jmock.org/oopsla2004.pdf). This last article, although from 2004, continues to serve me well. I can also recommend Matteo Vaccari's ["How I Learned to Love Mocks"](https://medium.com/@xpmatteo/how-i-learned-to-love-mocks-1-fb341b71328).

Beyond these guidelines, however, lies the larger principle: **use test doubles when you want to check one bit of behavior without knowing the details of how to implement another bit of behavior nearby**. When I find myself saying, "I just want _a thing_ to do _this_", then I interpret to mean that I want an _abstraction_ to do _"this"_, and in those situations, I generally want to use a test double to simulate that behavior. I tend to follow this guideline and then look for evidence that it's hurting me, and it hurts me only very rarely. Even when it hurts me, I try to interpret that to mean that I'm missing a useful abstraction, and when I look for that abstraction, I usually find it and it usually helps me. (I don't sit there for days until I find the abstraction; sometimes it comes to me suddenly while I'm doing something else entirely.)

I encourage you to follow the guidelines until you feel comfortable enough to use this larger principle directly.

# Do You Have Questions?

If you would benefit from mentoring like this, then consider becoming a member of [The jbrains Experience](https://experience.jbrains.ca). Members get direct answers to their questions, commission new articles on topics that matter to them, and participate in [Office Hours](https://office-hours.jbrains.ca) several times per month.

If membership isn't for you, don't worry: [you can still ask your question](https://ask.jbrains.ca), but I can't give you any service level guarantees about when you'd receive an answer.
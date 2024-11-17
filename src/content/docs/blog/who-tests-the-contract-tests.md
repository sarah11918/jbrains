---
title: "Who Tests the Contract Tests?"
date: 2018-07-09
lastUpdated: 2020-04-25
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
excerpt: >
 Programmers cling to integrated tests in part because of a feeling of security.
 I consider this a false sense of security, but it only seems fair to answer the
 common question of how I keep contract tests and collaboration tests aligned.
# image: https://blog.thecodewhisperer.com/images/who-tests-the-contract-tests/correspondences-between-tests.jpg
---
<img class="paragraph-eyecatcher" src="/images/who-tests-the-contract-tests/stubs-and-expectations-and-spies-and-mocks-and-contract-tests.jpg"></img>

I write contract tests in order to help with the _drifting test doubles problem_: how do I know that my stubs and expectations and spies and mocks behave "like the real thing"? I do this because contract tests run in less time than integrated tests, I feel more confident with passing contract tests than I do with integrated tests, and they help me document my understanding of the contracts of the code that I use.

Unfortunately, it remains possible to write a contract test that contradicts a collaboration test. It remains possible to change a stub or an expectation or a spy or a mock and not notice that the new behavior doesn't match the contract tests. It seems that this doesn't fix the drifting test doubles problem after all. So what do I do? Who tests the contract tests?

## Summary

- If you try to use automated tools to write contract tests, you end up reimplementing a pre-runtime type checker. Note that **this does not mean that** "therefore compile-time type checking is better", but [it does remind me of the old joke about LISP](https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule).
- If you choose not to write the contract tests now that matter most, then you will very probably need to reverse-engineer that knowledge at some unknown point in the future, likely when it feels least convenient. Make this trade consciously!
- If you _do_ plan to write the contract tests that matter most, and since automated tools can't help you here, **I encourage you to approach the work systematically**. This way, you can feel more confident that you've done it effectively and can reasonably expect to reap the benefits.
  - Match the stubs in your collaboration tests to "assert equals" checks in your contract tests.
  - Match the expectations in your collaboration tests to actions in your contract tests.
  - Writing code "client-first" means writing collaboration tests and building the test list for the contract tests associated with the next layer.
  - Writing code "supplier-first" risks the Chunnel Problem: not knowing that you've built enough of the right things and only enough of the right things until you try to connect it to some clients; therefore, when in doubt, write code client-first.

And now, the details.

## The Two Parts of a Contract

Not all contract tests provide the same level of confidence and safety, so it helps to talk more precisely about contract tests as a way to clarify where to focus your limited resources of time, energy, and money.

<img class="paragraph-eyecatcher" src="/images/who-tests-the-contract-tests/syntax-plus-semantics.jpg"></img>

I don't know of any automated system (still, as of 2020) for verifying that collaboration tests (does a client use its neighbors correctly?) and contract tests (does a supplier behave as clients expect?) correspond to each other correctly---at least not the _truly interesting_ parts. For now, we need to check those things ourselves. In order to describe the truly interesting parts of a contract, let me introduce two useful terms.

<div class="aside" markdown="1">
When I say _the contract_, I might mean the contract of a single function or of a cohesive group of functions (an interface or a protocol). The contract of a group of functions is includes the contracts of all the functions in it and maybe some interactions between those functions. Think about how size/empty or contains/indexOf need to behave consistently in order to make sense: these are examples of part of the contract of a protocol that goes beyond simply the contract of a single function. I'll continue to refer to "the contract" in general, since the difference between a single function or a group a functions almost never matters.
</div>

A contract has two parts: its _syntax_ and its _semantics_.

**The syntax of a contract refers to the method signatures**: the names, parameter types, return value type, and any exceptions it might throw. I think of the syntax as the _shape_ of the interface. We check the syntax of a contract in order to feel confident that **clients and suppliers will fit together**. In a language that checks types at compile time (Java, C#, C, C++), the compiler checks for syntax mismatches, so if the (client) code compiles, then we have some protection against syntax mistakes. (The amount of protection depends on the precision of the types available.) In a language that checks types at run time (Ruby, Python, Smalltalk, Javascript), then we don't discover syntax mismatches until we see "method missing" or "key error" or "undefined. (Different languages give us different clues about syntax mismatches.) When I feel confident that components agree on the syntax of a contract, I feel confident that those components will at least talk to each other correctly, even if the conversation they have might not make sense and they might collectively do the wrong thing. In languages with more-precise type systems, getting the syntax right provides significant confidence that we've got the behavior right.

**The semantics of a contract refers to the rules of behavior**: how inputs map to outputs, which side-effects are expected or permitted, and rules for throwing exceptions. I think of the semantics as the "working agreements" between client and supplier. We check the semantics of a contract in order to check that **clients and suppliers will work together**. When I feel confident that components agree on the semantics of a contract, I feel confident that those components will behave sensibly together. They might solve the wrong problem, but they will fail only when they should and they will succeed when they should. **With this level of confidence, clients can freely choose the appropriate suppliers to help them solve a specific domain problem** without worrying about whether the suppliers might do something unexpected, even if we can't yet conclude that the clients are trying to solve the right domain problem.

## Collaboration Tests Need Clear Contracts

When I imagine a collaboration test---even before I type it into the computer---I need details about the contracts of the suppliers with which the subject under test interacts. When I write code client-first, I am designing those contracts; when I connect a new client to existing suppliers, I need clear expectations about how those suppliers behave. **In most situations I'm making assumptions about the contracts of the subject's collaborators**, either that I'll find a way to make those collaborators behave that way or that I recall correctly how they behave. I need to check these assumptions somehow.

I write contract tests in order to document the contracts of suppliers so that I can confidently write collaboration tests for the clients of those suppliers. **The drifting test doubles problem happens exactly when programmers write collaboration tests without a clear understanding of the contracts of the subject's collaborators**. This lack of clarity leaves them searching for a way to bridge the gap. Many of them turn to integrated tests to check the assumptions in their collaboration tests. **I recommend against using integrated tests this way.** This way lies the [integrated tests scam](https://integrated-tests-are-a-scam.jbrains.ca).

<div class="aside" markdown="1">

I would say that any sufficiently-complicated integrated test suite is a haphazard, defect-masking, difficult-to-follow, bloated (duplication-infested) suite of contract tests.

</div>

## How Not To Paint A Wall

Imagine that you need to paint a wall. (It's not my fault that you need to paint a wall. Here we are.) Not a small wall---a few metres tall and several metres wide. You probably use some combination of paint rollers for the easy parts of the wall and paint brushes for the corners. You probably put masking tape along the edges of the wall in order to help yourself paint only the parts of the wall that you want to paint. You might use an edger, but some people find them a bit difficult to control and, in the end, not faster than a conventional small brush. You probably do the same around the electrical outlets, any doorways, or any other part of the wall that you don't want to paint. In other words, **you use precision tools to paint the wall when you need precision and you use less-precise tools to paint the larger portions of the wall where you don't have to worry as much about precision**. All this probably sounds quite sensible to you.

Now imagine your friend who has a different approach. They line up a bunch of cans of paint three metres away from the wall. They stand there, staring at the wall a moment in preparation. Next, they pick up a can and throw paint at the wall. Some paint sticks to the wall. Maybe even _a lot_ of the paint sticks to the wall. Maybe your friend is world paint-throwing champion and manages to get most of the paint to stick to mostly the right parts of the wall. So far, so good, but what about the corners? What about avoiding the electrical outlets and the windows? How do they get paint in the very top-left corner of the wall, some five or six metres away? That's a long way to throw paint so accurately and precisely. They keep picking up buckets of paint and throwing them at the wall. The central parts of the wall end up with many coats of paint (how many? nobody knows) and the corners with very little. **No matter how long they keep throwing paint at the wall, the corners never seem to get any paint**, and they might as well stop. The whole thing seems very haphazard. At some point, you probably want to yell at your friend to pick up a brush to paint the corners!

I feel exactly this way about using integrated tests to check your understanding of the contracts between clients and suppliers throughout the system. **By putting all the components together and running them in a single test, you're throwing tests at the system, hoping to cover the whole thing**. You're also covering certain parts of the system much more than you need to and missing other parts entirely. Even if you manage to cover 30% to 70% of the system relatively quickly this way, I can't tell what you've covered and what you haven't. As long as you insist on throwing tests at the system, you'll miss significant parts of the system and you won't really know which parts you've missed until a customer reports a problem. Pick up a brush and paint the corners already!

Contract tests help me cover the wall evenly and completely. 

Sadly, contract tests alone don't solve the drifting problem; but they remind us of the risk in a way that integrated tests just don't seem to do for most people most of the time. I believe that this results from how utterly distracting integrated tests become over time: riddled with duplicated, mostly-irrelevant details. Yes, yes, the current user needs to have logged in! Yes, yes, we have to put this big heap of magic data into the database, because of all the foreign key constraints! Yes, yes, we have to tweak that configuration file, changing one or two settings out of the 118 settings it contains! **These details assault our senses and beat our conscious minds into submission**. Our eyes glaze over. Before long, we stop paying attention. **Over time it becomes easier, not harder, to make a mistake**.

## Collaboration Tests And Contract Tests Check Each Other

We can use automated tools to address the drifting problem for the _syntax_ of contracts, but not for the semantics. You can already find libraries that help detect interface syntax changes in languages that don't have compile-time type checking. These include [chado](https://github.com/robindanzinger/chadojs) for Javascript and [Pact](https://github.com/realestate-com-au/pact) for Ruby, or whatever the cool kids are using these days. **These libraries effectively provide a form of pre-runtime type checking** to help alert the programmer to potential incompatibilities between collaboration tests and the syntax of the contract of the collaborators. We can also add type checking to languages that don't have it built in, which explains why we have Typescript. The semantics of a contract, however, require more complicated and varied checks. They describe the meaning and purpose of the modules in the system. I don't know of any software that can write those checks for us. A human needs to do that.

**I maintain the correspondence between collaboration tests and contract semantics tests by hand**. I don't know of any automated way to do this. Building software to help with this task sounds like a suitable Ph.&nbsp;D. project&mdash;indeed, a few people have told me that they intended to do exactly that, but I haven't seen any results yet (still not, as of 2020).

## My System

<img class="paragraph-eyecatcher" src="/images/who-tests-the-contract-tests/correspondences-between-tests.jpg"></img>

Rather than throw paint at the wall, let me describe what I do, which corresponds to painting the corners of the wall with a brush.

First, I describe the key properties of collaboration and contract tests:

+ A **stub** in a collaboration test corresponds to the **expected result** of an assertion in a contract test.
+ An **expectation** in a collaboration test corresponds to the **action** of a contract test.
+ These correspondences apply equally well in both directions.

From this, we can extract some helpful rules:

+ When I write a stub in a collaboration test, then I remind myself to also write a contract test where the stubbed return value becomes the expected result of the contract test.
+ When I write a contract test with `assert_equals()` in it, then I can safely stub that method to return that value in a collaboration test. Moreover, I should probably try to imagine a collaboration test for the client that stubs that method to return that value so as to document what happens in that case. Maybe I need it; maybe I don't.
+ When a collaboration test expects a method (with certain parameters), then I remind myself to also write a contract test that describes what happens when we invoke that method with those parameters. Any module that implements that method must behave accordingly.
+ When I write a contract test with the action `foo(a, b, c)` in it, then I can safely write a collaboration test that expects ("mocks") `foo(a, b, c)`.

I should mention that the method parameters don't need to match _exactly_, but they do need to come from the same [class of equivalence](https://en.wikipedia.org/wiki/Equivalence_class). If you feel unsure how to start, then start by making the method parameters match the contract test values exactly.

I have built a system out of following these rules to replace the haphazard approach of writing integrated tests until it somehow feels safe enough. My system requires more care and attention than throwing tests at the problems, but I can make more-well-informed tradeoff decisions between writing the contract tests now or reverse-engineering that knowledge later. By relying on integrated tests, I don't even know how much of a risk I'm taking; but by thinking about the contract test that corresponds to this collaboration test, I have a clearer picture of the risk I'm taking by thinking _No, it's fine. I understand this well enough. The corresponding contract test is obvious._ I might still not write the contract test, but this additional precision provides just enough resistance to challenge my assumption about how obvious or self-evident or clear the contract will seem to whoever needs to read this code weeks, months, or years from now. **Even if I get this wrong, we will know better how to fill in the gaps in the contract tests when we finally get around to writing them**. Maintaining the correspondence between collaboration and contract tests better assures me that I have agreement between clients and suppliers. It helps with both the syntax and semantics of my interfaces. When I finally put things together, they not only fit, but they just work.

## But... What About The Domain Problem?

This system helps me feel justifiably confident about how well the code fits together (syntax) and works together (semantics), but it doesn't (alone) guarantee that the resulting system solves the intended domain problem. For that, I need customer tests, and I will probably write most of those customer tests as end-to-end tests.

Yes---I hear you screaming. Stay with me a little longer.

I often use a smaller number of customer-facing integrated tests to help the _customer_ feel confident that we programmers have understood what they need, but **I definitely do not rely on an ever-growing suite of integrated tests to help the programmers feel confident that the system "hangs together" correctly**. On the contrary, since I write collaboration and contract tests, **my customer tests rarely fail due to incorrect code**, but rather due to differences of understanding about the business problem that we need to solve. **This makes those customer tests much more effective as tools for guiding the development of a system**. It also helps the customer see those tests as providing evidence of progress. It helps the customer feel confident in those tests. It helps them _believe_ and _trust_ those tests. That makes the project go more smoothly.

## "My Fellow Programmers Won't Do This"

I understand! Not every programmer volunteers to work with the same level of discipline in the same facets of their work as I do. Even if they did, not every programmer would believe that this approach works better than writing integrated tests. Some programmers insist on painting a wall from three metres back. I understand why they might prefer it (it seems easier), but I'll never understand why they consider it more _effective_ than picking up a brush. If you decide that you prefer to paint the wall with rollers and brushes and your fellow programmers try to stop you, then you have an entirely different problem. [Maybe I can help with that, too.](https://experience.jbrains.ca)

# References

Lisa Crispin, ["Using the Agile Testing Quadrants"](https://lisacrispin.com/2011/11/08/using-the-agile-testing-quadrants/). An overview of classifying tests as a way to clarify their nature and purpose. I use this model here briefly to refer to customer-facing (also known as "business-facing") tests as separate from technology-facing tests.

Brian Marick, ["Agile Testing Directions"](https://www.exampler.com/old-blog/2003/08/21.1.html#agile-testing-project-1). A series of articles describing a systematic approach to testing in an iterative and incremental environment that one might label as Lightweight or Agile (as it was meant to be practiced).
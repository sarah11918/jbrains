---
title: "Clearing Up the Integrated Tests Scam"
date: 2015-12-08 13:30 +0100
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
No matter what one writes, no matter how carefully one tries to articulate it, a non-trivial segment of the readership will interpret it differently from what one intended. So it has gone with ["Integrated Tests are a Scam"](https://integrated-tests-are-a-scam.jbrains.ca). I'd like to address some common differences of interpretation.

## "Integrated", not "Integration"

This point might seem small, but it matters. Word matters. Meaning matters. In 2009 I presented "Integration Tests are a Scam" to an audience at the Agile (North America) conference in Chicago. At the time, I was still formulating the key ideas and fumbling around in the dark, confident that (what I called at the time) "integration tests" were creating more problems than they were solving. Either at that conference or shortly thereafter, I spoke with several people who told me that they disagreed with my use of the term "integration tests", because they'd used the term to refer to what I was calling "collaboration tests".

It hit me like a ton of bricks. Of course! I'd got that wrong. An _integration_ test checks the integration between parts or layers of the system. I was telling people the equivalent of "collaboration tests are a scam, so use collaboration and contract tests instead", which, when I write it this way, is obviously nonsense. It couldn't possibly be what I meant.

<aside class="aside" markdown="1">
(You'd be surprised how many people seriously think that this is what I meant. I wish they would take the time to interpret more generously. That's another article.)
</aside>

This explains why I began calling them _integrated tests_, even making sure to distinguish the two terms when I presented "Les tests intégrés sont une arnaque!" at Agile Grenoble in 2011. There, at least one audience member seemed to understand the difference.

> Je précise que Joe fait une différence entre tests d’intégration et tests intégrés qui sont pour lui des tests dont la réussite ou l’échec dépend de plusieurs parties intéressantes du système.
>
> <p class="translation">I mean that Joe distinguishes between integration tests and integrated tests, the latter of which are, for him, tests whose success or failure depends on several interesting parts of the system.</p>
>
> &mdash;Fabrice Aimetti, ["Rétrospective de l'Agile Grenoble 2011"](https://www.fabrice-aimetti.fr/2011/11/25/retrospective-de-lagile-grenoble-2011/)

Knowing the confusion that I could have been causing, I made sure to change all my old articles&mdash;as many as I had the authority to change&mdash;and to start drawing attention to the fact that I had made a mistake saying "integration tests" when I meant "integrated tests". Unfortunately, [infoq.com](https://infoq.com) posted video from the Agile 2009 presentation and many people just don't take the time to think about the difference between the two terms, perpetuating the confusion.

Even in late 2015 I woke up to a tweet claiming that I believe integration tests to be a scam. It has become a runaway train and I can't stop it.

So let me state it clearly: **integrated tests, and not integration tests, are the scam**. They act like aspirin that makes the headache worse. The scam goes like this:

1. We have 100% passing tests, but we still have bugs.
2. I know! Our "unit tests" don't check how the system "hangs together", so we need integrated tests to make sure that the "real things" work when we put them together!
3. We write more integrated tests, which are bigger and don't criticize our design as harshly as microtests do.
4. Our tests don't give us as quick nor strong feedback about our design as they could, and we're humans, so we design things less carefully than we could. We design more sloppily both because we can get away with it and because we don't notice as easily that it's happening.
5. Our designs become more interdependent, tangled, and generally impenetrable.
6. The more interdependent our designs become, the harder it becomes to write good microtests.
7. We write fewer microtests.
8. The probability of 100% passing tests, but we still have bugs, **increases**.

Repeat until project heat death. (This is the point where starting over is cheaper than continuing with this code base.)

You can yell "straw man" all you want. I see it happen.

<p class="highlight" markdown="1">
Strong **integration tests**, consisting of **collaboration tests** (clients using test doubles in place of collaborating services) and **contract tests** (showing that service implementations correctly behave the way clients expect) can provide the same level of confidence as **integrated tests** at a lower total cost of maintenance.
</p>

This last paragraph is the key point. I've stated it as concisely as I can. I hope this becomes the new sound bite that people repeat to their friends, colleagues, and family. Please.

## Only Programmer Tests

When I talk about the integrated tests scam, I refer to a very specific practice of using integrated tests to "fill the gaps in our unit testing". Unfortunately, since I usually find myself very deep in this context, **I forget to mention that I'm referring only to programmer tests** when I write or talk about the scam. This point really, really matters!

I receive the occasional email&mdash;including one today&mdash;from people who tell me that they use integrated tests to verify that their features work the way their customers (or stakeholders or product owners...) expect. They are surprised that I would be telling them that they're doing it wrong. _I'm not_. Well... I am and I'm not.

When I refer to the integrated tests scam, I mean that **we shouldn't use integrated tests to check the basic correctness of our code**. I'm talking only about **programmer tests**: tests designed to give the programmers confidence that their code does what they think they asked it to do. Some people call these "technical-facing tests" or "developer tests" or even "unit tests" (I never use "unit tests", because that term causes its own confusion, but that's another article). Whatever you call them, I mean the tests that only the programmers care about that help them feel confident that their code behaves the way they expect. There, I write as few integrated tests as possible.

When working with **customer tests**, such as the kind we write as part of BDD or ATDD or STDD or just generally exploring features with customers, I'm not using those tests to check the correctness of the system, nor the health of the design; I'm using those tests to give the customer confidence that the features they've asked for are present in the system. I don't expect design feedback from these tests, so I don't worry about the integrated tests scam here. If your customer tests run from end to end, I don't mind; although you should remember that not all customer tests _need_ to run from end to end. James Shore once told me about "customer unit tests", which I've also used, but that's another article.

<p class="highlight" markdown="1">
So, let me clarify again: **the integrated tests scam happens when we use integrated tests for feedback about the basic correctness of our system, and write them in place of microtests that would give us better feedback about our design**. Don't do this.
</p>

## Yes, I Need A Few Integrated Tests

Even with all the foregoing, I still write a small number&mdash;very small&mdash;of integrated tests. Specifically, I follow the advice _don't mock types you don't own_&mdash;at least most of the time. You've seen interfaces that violate the Interface Segregation Principle in the worst possible ways&mdash;my canonical example is Java's `ResultSet`&mdash;and mocking those interfaces is a sure path towards madness. Even when third-party frameworks and libraries give us interfaces, they are often quite terrible, especially when different methods on the interface duplicate each other's behavior. (Think of `getParameter()` and `getParameterMap()` on an HTTP request interface.) When this happens, we face a Morton's Fork:

1. Mock all the related methods consistently to avoid contradictions (`size()` returns `0`, but `isEmpty()` returns `false`), in order to retain the freedom to refactor implementation details, even though that means mocking methods you won't need.
1. Mock only the methods you invoke, leading to brittle tests that fail because you've refactored what seems like a completely free implementation detail choice.

Some people interpret this as a failing of mock objects. No. I interpret it as a failing of the design. Again&mdash;another article. I prefer instead to emphasize the point that I do still write some integrated tests. I do, however, write almost none, and my code tends to flow in the direction of not needing them, and many of the ones I write I end up replacing over time with microtests.

<aside class="aside" markdown="1">I have a wonderful explanation of this point, but it takes several minutes or hundreds of words, and this article has already grown quite long. I have put it on my backlog to write another article with an example of how I do this. Patience.</aside>

I typically don't mock types that I don't own. I just integrate with them, write integrated tests, and be done with it. Of course, this creates little Adapters that export third-party behavior as Services to the rest of my system, which I hide behind interfaces that I call a "Patterns of Usage API". I then mock those interfaces so that the rest of the system neither knows nor cares about the details of integrating with that horrible gelatinous blob. In many cases, **those tests are learning tests for the third-party system**, rather than tests for "my code". They become acceptance tests in the classic sense of the term. They become tests for the third-party system, and I run them only when either I need to upgrade or I need to start using some hitherto-unused part of it.

<p class="highlight" markdown="1">
So yes, I write some integrated tests, but many, many fewer than you, for a specific purpose, and I design in a way to intentionally make them obsolete over time. I write them in a way that avoids the scam. And I certainly don't use them to check that "the system hangs together". That way lies the scam.
</p>

## So... Are We Good?

So... I've clarified some key differences of understanding regarding the integrated tests scam. Now I can get on with my life, right? Wrong. People will still read the old articles and not the new ones. Other people will perpetuate my mistake from 2009 whether they intend to do it or not. Others still will listen to the sound bites, switch off the brain, and often understand the exact opposite of what I meant. I have made peace with all these things. Even so, I hope that some thoughtful, mindful readers will have more clearly understood the nature of the integrated tests scam, how I use integrated tests effectively, and especially how sorry I am for ever calling them "integration tests" in the first place.

Not just Canadian sorry. Sorry sorry.

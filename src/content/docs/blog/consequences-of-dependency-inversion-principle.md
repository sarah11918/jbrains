---
title: "Demystifying the Dependency Inversion Principle"
date: 2013-01-29
lastUpdated: 2017-07-13
tags:
  - Dependency Inversion Principle (DIP)
  - Surviving Legacy Code
---
Another "demystifying" article. Great! I know... bear with me.

Of the SOLID principles, the Dependency Inversion Principle remains somewhat misunderstood. I'd like to help with that. I hope you'll ask questions and challenge these ideas, so that I can improve this little article.

I learned the Dependency Inversion Principle from [Bob Martin's article](https://link.jbrains.ca/2sTNJ3n), the salient part of which states:

> High level modules should not depend upon low level modules. Both should depend upon abstractions.

or

> Abstractions should not depend upon details. Details should depend upon abstractions.

I've noticed that I spend the vast majority of my time introducing abstractions and inverting dependencies (abstractions that use concrete things) when rescuing legacy code or adding behavior to legacy systems. Sometimes I feel like I don't know any other useful trick than *invert this dependency*. One could make a drinking game out of it.

Even so, not enough people understand and apply DIP. Perhaps if I share a few examples or equivalent formulations, they will.

<!-- more -->

## Move Specificity Towards the Tests

Moving details from production code towards tests clarifies the tests. In particular, I find it easier to relate the inputs to the expected outputs. It eliminates duplication between tests and production code. It highlights opportunities for abstraction and reuse. Corey Haines interviewed me about this in summer 2009.

<figure class="body-text-block">
<div class="embedded-video-container">
<iframe class="embedded-video" src="https://player.vimeo.com/video/5895145" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
<figcaption><a href="https://vimeo.com/5895145">JB Rainsberger - Move Specificity Towards the Tests</a> from <a href="https://vimeo.com/coreyhaines">Corey Haines</a> on <a href="https://vimeo.com">Vimeo</a>.</figcaption>
</figure>


(If you can't watch the embedded video, then [click here](https://link.jbrains.ca/119weXi).)


## Move Implementation Choices Up the Call Stack

Dependency injection confuses and annoys people, partly because some people miss the point. Injecting a dependency makes testing easier, by letting us substitute implementations in our tests that make those tests easier to write and understand. Don't stop there. When in doubt, push `new` up the call stack. In particular, don't instantiate a *service* if you can get your caller to do that. Keep pushing, even more than you think you should. Let all the choices of implementation of each service interface bubble up the call stack until they collect in your application's or component's entry point. This shines a huge floodlight on otherwise obscure duplication. It also paves the way for *sane* use of a dependency injection container, even though you don't need a container to inject dependencies well. This movement of `new` up the call stack leaves in its wake a loosely-coupled network of abstractions talking to each other over well-defined interfaces with well-understood contracts. Using this technique helps me remove duplication, which decreases errors, particularly of the "I forgot to change that one" type. Using this technique also encourages me to write code that depends on narrower interfaces, which slowly become more generic interfaces, which makes the code depend less on its context and more suitable to use in other contexts.


## Abstraction in Code; Details in Metadata

I first learned this principle from the book [The Pragmatic Programmer](https://link.jbrains.ca/2tQl7JK). You'll find it as "tip 38". I encourage you to buy the book and the read the tip yourself. The authors state among the benefits:

* a more robust program
* a more flexible program
* opportunity to reuse the "engine" with different metadata
* opportunity to express metadata in the language of the domain
* opportunity to customise code without rebuilding it

Who could argue with all that?


## Quick Summary

If you agree with the specific principles I've cited here, then you also agree with the Dependency Inversion Principle. Said differently:

> **Push details up towards the client and push generic patterns down towards the server.**

This principle, applied everywhere, makes testing easier, promotes reuse, both of which reduce the incidence of errors and the cost of development.

So tell me:

* If you already felt you understood the DIP well, how faithfully did I represent it here?
* If you didn't quite understand the DIP well before, how much has this article helped or hindered your understanding?
* If you explain the DIP to others, how do you do it?
* If you still think the DIP is a load of nonsense, how do you justify that? I'd like the chance to help you as well as fix holes in my own understanding and reasoning.

## One More Thing

<div markdown="1" style="font-size: 80%">
> *In what follows, I refer to the [Spring framework](https://projects.spring.io/spring-framework/)'s dependency injection container, not the [Rails Spring application preloader](https://github.com/rails/spring). I didn't even know that the latter existed until a commenter and I confused each other by using the same words to mean different things. (If you have a spare 50 minutes, you can [watch a video](https://vimeo.com/78917211) in which I discuss this and other tricks to improve how we programmers communicate with the world.)*
</div>

If you hate Spring's dependency injection container, then I know why: you have code that *depends* on the container.

Don't do that.

Dependency injection is related to the Inversion of Control principle, also known as the Hollywood Principle:

> Don't call us; we'll call you.

Spring's dependency injection container calls you; you never call it. Never.

Fine: you call it only from a smoke test that verifies that you've wired up your dependencies correctly, but you **never call your dependency injection container from production code**.

## References

Bob Martin, ["Principles of OOD (Object-Oriented Design)"](https://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod). A collection of Bob's original papers on the SOLID principles, among others.

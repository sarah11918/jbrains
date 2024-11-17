---
title: "Keep Dependency Injection Simple"
date: 2017-12-10 12:42 +0100
tags:
    - Simple Design
excerpt: >
    Every year I work with programmers who overcomplicate dependency injection.
    This causes stress and it influences other programmers to not even try this technique at all.
    I'd like to put your mind at ease with some advice to keep things simple.
---
I taught evolutionary design _in person_ to about 200 programmers this year.[^tdd-implements-evolutionary-design] In the 15 years that I've been doing this, I've spoken with confused programmers who felt unsure how to use _dependency injection_ to improve their design. I tend to notice this confusion more often among the programmers who have "some experience" practising test-driven development—say, 6 months to 2 years. I'd like to share a few short pieces of advice, and if this advice leads you to ask some follow-up questions, then I invite you [ask them](https://ask.jbrains.ca), so that I can help you even more.

[^tdd-implements-evolutionary-design]: I think of _test-driven development_ as the implementation and _evolutionary design_ as the interface.

**Why do I inject dependencies?** I have at least [one mechanical reason and one intuitive reason](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer) to inject dependencies. Injecting dependencies helps me write smaller, more-focused tests. A _smaller_ test runs less of the system and a _more-focused_ test involves fewer irrelevant details in the tests. The more I remove distractions from my tests, the more-easily I understand them, so **they help me change the code, rather than get in my way** when I want to change code. In addition, when I inject dependencies, this allows me to check a client's behavior without knowing details of the behavior of its suppliers. This helps me separate unrelated responsibilities, which leads to the usual benefits of higher cohesion: lower risk of distraction when I want to understand some specific part of the system and [more opportunities to reuse code in other contexts](/permalink/how-reuse-happens). Injecting dependencies helps me in at least both of these significant ways.

In my travels, when I ask programmers why they inject dependencies, I find out that most of them merely follow the rule that someone had taught them. [This works fine for learning](/permalink/guard-rails-not-prison-bars), but I fear that many of these programmers have stopped learning (about this in particular), but continue to follow the rule. This has led to at least two unfortunate misconceptions that I'd like to clear up.

## Unfortunate Misconceptions About Dependency Injection

**"I need to use dependency injection containers or frameworks."** I don't, and I don't plan to. I've taken superficial looks at Guice and Dagger and **I still have no idea what problem they solve**. I have, however, seen **programmers use both frameworks and then proceed to do the exact opposite of injecting dependencies**: since it takes so much extra work to wire arbitrarily implementations together, they simply "reuse" the existing production-caliber modules and [write integrated tests for everything](https://integrated-tests-are-a-scam.jbrains.ca). This defeats one of my key purposes for injecting dependencies: writing smaller, more-focused tests.

**"If I use dependency injection, then I need to use Factories."** Programmers in [my training courses](https://training.jbrains.ca) assume that injecting dependencies means that they (always?) need Factories to instantiate implementations. This assumption really puzzles me; I don't know where it comes from. I occasionally use Factories, most often [in contract tests](/permalink/getting-started-with-contract-tests) (at least in JUnit); but otherwise, **I simply instantiate implementations directly and pass them where I need them**. I rarely need Factories in production code as a result of injecting dependencies. (I use them for other reasons, usually as the Abstract Factory pattern.) When I combine this with [moving details towards the client](/permalink/consequences-of-dependency-inversion-principle), my designs improve considerably: the entry point decides how to wire implementations together and then injects that module graph into whatever framework I use to receive requests: web, CLI, service bus, it all works the same.

[You can benefit from injecting dependencies without creating extra work](/permalink/injecting-dependencies-doesnt-have-to-hurt). Pick some small corner of your code base and try ripping out all the container and framework stuff. Examine what remains. What do you think?

Most importantly (for me), if you love dependency injection containers, then please share your reasons and your experiences. I'd like to understand this point, and nobody has managed to explain it to me in over a decade.

## References

J. B. Rainsberger, ["Refactor Your Way to a Dependency Injection Container"](/permalink/refactor-your-way-to-a-dependency-injection-container). Bespoke, artisanal containers. No, really.

J. B. Rainsberger, ["Getting Started with Contract Tests"](/permalink/getting-started-with-contract-tests). I find it hard to inject dependencies without eventually wanting to write contract tests.

J. B. Rainsberger, ["Injecting dependencies doesn't have to hurt"](/permalink/injecting-dependencies-doesnt-have-to-hurt). This seems to be the 2010 version of this article. I hope the modern version provides more value; otherwise, I need to go stare in a mirror for a few hours and contemplate my life choices.

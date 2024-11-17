---
title: "What is Refactoring?"
date: 2022-07-29
tags:
    - Refactoring
    - Simple Design
    - Evolutionary Design
excerpt: >
    The most common definition of "refactoring" suffers from
    a common weakness that creates big problems for a very
    specific group of people. I'd like to help.
---

What is refactoring?

You'd think that, in 2022, we'd have long settled this question already. Yes and no.

# A Problem

I routinely encounter programmers who struggle with refactoring because they become stuck on this central question:

> I'm making these kinds of code changes (describes example)... am I refactoring?

They might arrive at this central question because some well-meaning person has looked at what they're doing and exclaimed, "That's not refactoring!" To someone trying hard to learn refactoring, who wants the feeling of making progress, this exclamation can come down like a hammer blow to their confidence, even though it's often meant more as a friendly warning of going off the rails.

Let's please be more careful about doing that. Let's please become more aware of the risk of interfering with the progress of earnest people who want to learn a thing. Let's do better to balance giving them correct information with facilitating their learning. Let's especially take care not to make them feel stupid for getting something wrong. Getting things wrong plays a critical role in learning.[^effortful-retrieval]

[^effortful-retrieval]: When retrieving information, if we struggle a bit to recall something, and occasionally get it wrong, we strength the corresponding neural pathways better and more quickly than if we always recall things correctly and easily. Brains are weird.

# Another Problem

Even worse, when our intrepid learner asks whether they are refactoring or not, many well-intentioned and seasoned practitioners (as well as the occasional asshole) tell them that they're wrong even to ask the question. I've been guilty of this in the past.[^sorry] They label asking this question "navel-gazing" and a "distraction". At their best, they want to help by freeing the learner from the shackles of pinpointing a definition of refactoring! It feels so liberating to stop worrying about whether what one is doing right now "is" refactoring by some strict definition and just do it!

[^sorry]: Sorry. Truly.

That works very well for people _after_ they've mastered the fundamentals or _before_ they've even noticed the difference, but what about the people who struggle consciously with the fundamentals? They need to feel like they're practising "the right thing". They need to use their time wisely. They need feedback regarding whether they "are on the right track".

Are _you_ going to sit there and write code with them for a few hundred hours to give them the reassurance they need and to help them notice when they've gone off the rails? No? OK. In that case, they still need to make sense of the state of their own learning and they don't have you to lean on. What are they supposed to do?!

Let me use the Dreyfus Model of skill acquisition[^dreyfus-model] for a moment to summarize this point: an Advanced Beginner, on the way to becoming Competent, becomes obsessed with rules and decision trees to guide their behavior. **This is a perfectly natural learning path**. They rely on precise understanding to feel confident in those rules and decision trees. These people in particular benefit from---and indeed crave---precise definitions. A Proficient practitioner, who has started to break free of the bonds of obsessive precision, harms the Advanced Beginner by telling them not to worry about defining precisely a term central to their active learning. Don't do that! One day, the learners might become Proficient and _then_ they will feel comfortable worrying less about the details.

[^dreyfus-model]: This model remains controversial, but please let me use it lightly to make this point a bit easier to fit into one's mind.

# How We Got Here

Partly, it's Martin Fowler's fault.[^chet]

> Refactoring (verb): to restructure software by applying a series of refactorings without changing its observable behavior. (<https://martinfowler.com/bliki/DefinitionOfRefactoring.html>)

The trouble comes from the harmless-looking phrase "observable behavior".

[^chet]: For once, we can't blame Chet.

## "That's Impossible!"

An Advanced Beginner or other sufficiently-determined person can point out that, _strictly speaking_, almost any non-trivial code change almost always risks changing some kind of observable behavior. Such a person will cite the Uncertainty Principle to prove their point, if pushed hard enough. They conclude that this definition of refactoring, as it stands, can't have any meaning.

Some of those people use this as a reason to discount evolutionary design altogether. Whether that hurts the world or not, I consider it a pity. I would prefer that someone abandon evolutionary design for more-significant reasons than this. Some other people use this as a reason to doubt everything they've ever learned about refactoring. They panic, wondering if they've missed something really foundational that everyone else seems to understand. We don't need more people with Imposter Syndrome.

Worse, those of us with significant refactoring experience, who encounter someone objecting this way, might not be able to distinguish the crank (who merely wants to discount evolutionary design, even on a technicality) from the earnest learner (who is struggling to understand a central concept in the topic they're learning). This leads to two unfortunate outcomes (among others):

1. Discouraging the earnest learner by disrupting their learning. (I described this earlier.)
2. Perpetuating the notion that refactoring is pseudo-engineering, because we can't even get our definitions straight! (Some programmers will therefore be scared away and will never know what they're missing.)

We can try to fix the problem, but pretty soon we bump up against some immovable limitations of human communication. I'm an amateur philosopher at best, so what follows is my attempt at making sense of what happens. If you've read any Wittgenstein, please don't yell at me. I haven't and I won't.

## You Know What I Mean!

Most people most of the time get the inflexion of Martin's nuance[^benny-hill], possibly even accidentally. They grasp that by "observable behavior", Martin doesn't literally mean every observable detail, mostly because that's obviously either impossible or undefined. The very notion of "observable behavior" implies at least three competing meanings:

- behavior as observed by one specific observer
- the union of the behaviors as observed by all possible observers
- behavior as observed by reasonable observers

[^benny-hill]: A line I learned from a Benny Hill sketch. Nevermind, unless you chuckled.

Martin very probably means "reasonable observers", but our poor Advanced Beginner can be forgiven for jumping straight to one of the other two meanings. Or maybe to being pulled in two different directions by trying to engage both.

That's just part of being an Advanced Beginner.

Indeed, most people most of the time understand that Martin means something more like this:

> Refactoring (verb): to restructure software by applying a series of refactorings without changing **the observable behavior that the project community generally cares about preserving, both at the moment and in general throughout the lifetime of that part of the system**.

Yeah... it doesn't exactly roll off the tongue, does it?

And now we come to _my_ struggle: how to describe refactoring in a way that achieves all these goals at once:

- people will (fairly easily) remember
- people won't fight over (much)
- people will find (mostly) helpful

Why do I care? I want the Advanced Beginner to feel the freedom to struggle with the "navel-gazing" that everyone else labels as either a waste of time or, worse, a sign that the entire endeavor is bullshit. And I want more-experience practitioners to retain the freedom to see the discipline as more than a set of rules to follow.

I generally want less confusion and more freedom.

# So... What is Refactoring?

Let me try to describe refactoring as I understand it.

First, I see two concepts with the same word:

- refactoring, the discipline of improving the design of existing code safely
- refactoring, an individual code transformation that facilitates refactoring-the-discipline

I wish we didn't have one word for both of these things, but that's just how English works. I've chosen to find it endearing.

With these two concepts I like to say that **refactoring (1) is a discipline of improving the design of existing code by judiciously applying refactorings (2) in an environment that tends to optimize for safety**.

I characterize refactoring-the-discipline with these features:

- changing code incrementally
- keeping the code "working"
- intent to improve the design

The act of keeping the code "working" corresponds to the idea of "not changing observable behavior". But since preserving all observable behavior is _strictly speaking_ impossible to guarantee in general, I focus on keeping the code "working". Then I use what I learned from Jerry Weinberg about "it works".

> Quality is value to some person at some time. (Jerry Weinberg, then [Markus G&auml;rtner](https://www.shino.de/2010/07/22/quality-is-value-to-some-person-at-some-time/))

From here, it's a short walk to defining "it works" to mean "has enough quality at the moment" or, if you prefer, "works well enough". No matter how we articulate it, we can't escape the notion that "works" depends on the people doing the judging. And those people's judgments---their ideas, their needs, their points of focus---change over time.

And this corresponds exactly to the problem of "without changing observable behavior". Which observers? When? And what are they paying attention to? Surely we can't _possibly_ mean an omniscient, omnipresent observer, because if we did, then refactoring would become impossible... _strictly speaking_.

The phrase "without changing observable behavior" suffers from an apparent precision that it can't deliver. For that reason, I prefer to say things like "preserves the behavior we care about" or "continues to work similarly enough to satisfy the project community" or some similar phrase. I want to avoid arguing about "observable behavior" by placing the observers at the center of the discussion. Only the observers know what they're observing!

Well... if anyone can know, only they can know.

# So... What is _a_ Refactoring?

I like to say that **a refactoring (2) is a code transformation that preserves enough observable behavior to satisfy the project community**. I'd like to note here that a refactoring might or might not improve the design. We can perform refactorings (2) outside of refactoring (1).[^refactoring-in-refactoring]

[^refactoring-in-refactoring]: I've tried letting the notion of a refactoring (2) imply intent to improve the design, and it makes discussing the topic too difficult. Removing this assumption seems to result both in cleaner writing and cleaner reasoning. I consider a refactoring (2) as a neutral code transformation, while refactoring (1) must by definition involve at least attempting to improve the design.

Even this description often leads to discussions about what it means to satisfy the project community, who the project community includes, and what it means to satisfy them "enough". I love these discussions, because they tend to have (at least) two key outcomes:

- they shatter illusions about the "correctness" and "readability" of code as properties of the code itself, which reduces arguments about angels and dancing and pins
- they bring to the surface unstated assumptions and lingering disagreements that tend to manifest as prioritization battles, needless context switches, and other symptoms of divergent, incompatible goals

# Can't You Make This Simpler?!

Nope.

Simple-but-wrong or precise-and-complex. **Pick one**.

This article seeks to explain why, on the one hand I care about "getting it right" and on the other hand I don't blame people for "getting it wrong". (I don't even really like to say "getting it wrong", but that works better as a rhetorical device.) Martin's published definition of refactoring works well enough for most people most of the time, but in certain specific contexts it creates repeatable and non-trivial problems. I happen to spend quite a lot of time in those contexts, so I feel the consequences more. And that's why the responsibility falls to me (and others in my situation) to try to soften the blow.

And that's just how language works. And that's just how learning works. And that's just how humans work.

Same as it ever was.

It's fine.


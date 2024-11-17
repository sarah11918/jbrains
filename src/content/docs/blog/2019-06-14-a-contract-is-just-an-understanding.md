---
title: "A Contract Is Just An Understanding"
date: 2019-06-14
summary: >
    A software contract is not a legal contract, so let's not treat it as one.
tags:
  - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
  - Simple Design
  - Not Just Coding 
---

A recent tweet caught my attention.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The drawback of ‘contract’ as a metaphor is that it leads to discussion as to whether a party is right (conforms) or wrong (violates) instead of overall outcome (what’s the best way to make the system meet the needs of the stakeholders in our technical/economic context).</p>&mdash; Nat Pryce (@natpryce) <a href="https://twitter.com/natpryce/status/1133277617686233094?ref_src=twsrc%5Etfw">May 28, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

When I read this, one thought immediately came to my mind: **are people _really_ doing this?!** And _of course_ they are, because people relentlessly find ways to interpret what they see and hear in their favor. I don't cite this as a problem to fix, but rather a tendency not to ignore.

A Client might want to focus on conformance so that they could blame the Supplier in case the software didn't behave as expected. A clear contract would help the Client direct their blame precisely and, I expect, more forcefully. A Supplier might want to focus on conformance so that they could deflect blame when a Client made an honest mistake regarding what to expect from the Supplier's software component. And so it goes. I understand.

Very well... since I have spent the last 15 years or so talking about _contract tests_ as a way to avoid the [integrated tests scam](https://integrated-tests-are-a-scam.jbrains.ca), I feel duty-bound to say this clearly to anyone who might ever be listening: **a software contract merely documents an understanding of what each part of the system can expect from the others**. An **understanding**.

Merely an understanding&mdash;and one that remains subject to change.

## How I Use Contracts

As a Client, I like clear, well-documented contracts so that I can figure out which behavior I can safely rely on and which I should not. A "good" contract helps me understand where the system's design is more stable and where it is more likely to change. This also subtly nudges me in the direction of designing components to become more stable (OCP). Clear contracts also alert me to situations where I've started relying too much on too many details of my suppliers (ISP) and a previously-unneeded abstraction would now help. In that situation, I could introduce the abstraction myself, then try to donate that part of the system to the Suppliers (internal open-source model). This would give them the option to offer a [defactored](https://raganwald.com/2013/10/08/defactoring.html) design to Clients who prefer ease of use over flexibllity, while retaining the factored, toolkit-like design for Clients who need flexibility at the cost of some up-front cost in understanding (make routine things easy, and unusual things possible). I want contracts that help me understand the likely future cost of depending directly on another part of the system.

As a Supplier, I want to offer clear, well-documented contracts for all those same reasons, but also in order to negotiate openly about the boundaries between what I will do and what my Clients will need to do. I see so many groups struggle with unclear boundaries due to an unwillingness to negotiate this openly (and in more-serious contexts than software component behavior!). I understand their reticence, but when we clearly delineate what my stuff does from what your stuff needs to do, everyone finishes their work sooner.

I often act as both Client and Supplier here, and in those situations, I mostly use contracts to document my understanding so that my future self doesn't need to reverse-engineer that understanding months or years later. Documenting contracts also helps me spot unhealthy dependencies as they evolve, rather than after they become entrenched and I feel too much resistance to change them.

I do not treat software contracts as permanent decisions about the behavior of software components. Instead, I treat them as documentation of the most-recent decisions and as a starting point for future negotiations. I document these decisions in contracts [so that we don't need to carry the current state of these agreements in our heads](https://blog.jbrains.ca/permalink/getting-started-with-getting-things-done). Why waste the energy? Just write it down!

**I treat software contracts as a record of decisions, with the goal of offering clarity to the project community.** Changing those decisions might cost more than we'd like, but change remains possible, if not always welcome. "Good" software contracts help us understand and even visualize the impact of changing those decisions. We do this work more consciously and with much less unplanned work. We don't scramble to "roll forward" once we've "committed" to make a certain change; instead, we go into these changes with our eyes open and we can better control the damage. We can, I dare say, _manage_ the work.

Even so, I understand: people are people, and  some people will focus on enforcement over understanding or on conformance over communication. I can't stop them. I can only write articles like this and hope that someone, somewhere realizes that they don't have to think about contracts in such a narrow, restrictive way.

<div class="highlight" markdown="1">

A software contract is merely a record of a decision of where to put the boundaries between software components. Don't wield them as an instrument to hold beneficial changes hostage.

</div>

# References

Reginald Braithwaite, ["Defactoring"](https://raganwald.com/2013/10/08/defactoring.html). Wherein Reg reminds us what the verb "factor" in "refactoring" means and helps us avoid disappointing a Client who asked for a bicycle by giving them a bicycle construction kit.

J. B. Rainsberger, [Beware the Integrated Tests Scam (was Integrated Tests Are a Scam): Series](https://integrated-tests-are-a-scam.jbrains.ca). A series of articles on the topic of integrated tests, why I shy away from them, and how to replace them with collaboration and contract tests.





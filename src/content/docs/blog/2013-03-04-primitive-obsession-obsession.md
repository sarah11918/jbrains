---
title: "Primitive Obsession Obsession"
date: 2013-03-04
tags: []
---
A Twitter conversation about Primitive Obsession caught my eye today. That conversation began with this tweet:

<blockquote class="twitter-tweet"><p>Re. "primitive obsession," I say this poker-scoring program wouldn't be bettered avoiding integers for rank and suit. <a href="https://t.co/qfc3Kyc9SD" title="https://www.jsoftware.com/jwiki/TracyHarms/PokerHandsScoring">jsoftware.com/jwiki/TracyHar…</a></p>&mdash; Tracy Harms (@kaleidic) <a href="https://twitter.com/kaleidic/status/308298155869499393">March 3, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I can't read J, so I can't decide much about the quality of the code Tracy wrote, but I do notice one thing:

> There aren't many functions that operate on the primitive data (card rank, card suit, hand classification), they're close by each other, and they're all quite short.

<!-- more -->

Regarding this one example, then, Primitive Obsession doesn't pose much of a problem yet. Using primitives to represent values with special constraints can lead to low cohesion and high duplication. The low cohesion consists of scattering related ideas throughout the code base, where programmers have a hard time finding them. Such scattering can lead to duplicating special processing logic, and worse, duplicating it inaccurately. That leads to mistakes. This makes me ask a question:

> When does Primitive Obsession not smell?

I suppose it doesn't smell when we use other means to keep cohesion high and duplication low. We can use primitives safely when we keep the special processing logic for those primitive values close together and use willpower (effectively) to avoid duplicating it.

I still can't account for Tracy's observation that Primitive Obsession doesn't figure prominently in array programming, where it ought to run rampant and create serious problems. Some guesses:

* Teams of programmers working in these languages don't create large, low-cohesion systems, like they do in Java/C#/C++.
* Teams of programmers working in these languages name things better in general, and so create fewer opportunities for misunderstanding.
* Teams of programmers working in these languages work together more closely in general, and so smooth over their misunderstandings more easily and more promptly.

Any ideas?

### References

Martin Fowler, [Refactoring: Improving the Design of Existing Code](https://link.jbrains.ca/32ZLFJJ). This book introduced me to Primitive Obsession as a code smell.

Ward Cunningham, ["The CHECKS Pattern Language of Information Integrity"](https://link.jbrains.ca/UJl7q0). This article includes a section on Whole Value, which counters the effects of Primitive Obsession. Whole Values should become *attractive code* when you introduce them into a system.

James Shore, ["Primitive Obsession"](https://link.jbrains.ca/15tt4S8). I recommend this article to my students to learn more about Primitive Obsession.

Corey Haines and J. B. Rainsberger, ["Primitive Obsession"](https://link.jbrains.ca/12F96Ug). Corey and I discussed Primitive Obsession while in Bucharest in early 2010. This article includes a 14-minute video of the two of us chatting about the topic.

[Code Retreat](https://www.coderetreat.org). We very commonly use the "no primitives" constraint at Code Retreat to encourage programmers to practise introducing Whole Values very early. I don't *always* design this way, but I believe that programmers should understand more deeply the differences between design with and without promitives, so I encourage them to practise.

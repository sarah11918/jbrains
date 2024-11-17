---
title: "Abstraction: The Goal of Modular Design"
date: 2014-08-01
tags: 
  - Dependency Inversion Principle (DIP)
---
<blockquote class="twitter-tweet" lang="en"><p>. <a href="https://twitter.com/cyriux">@cyriux</a> : Imho the best paper ever written in software engineering: <a href="https://t.co/C6kmmj0ntl">https://t.co/C6kmmj0ntl</a> Parnas, 1972</p>&mdash; Alistair Cockburn (@TotherAlistair) <a href="https://twitter.com/TotherAlistair/statuses/495160023396671488">August 1, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I don't intend to argue Alistair's contention one way or the other, but I invite you to set aside some time to read David Parnas' paper "On the Criteria To Be Used in Decomposing Systems into Modules", which I have embedded in this article. Do not let yourself be put off by the quaint-sounding title. If you prefer, think of it as titled "The Essence of Modularity".

I care about this paper because I strive for modularity in designing software systems and I find that programmers routinely lose sight of both the what modularity offers them and what it means. I value modularity as a way to drive down the cost of changing software. I value that because most of what we do as programmers consists of changing software, and so it strikes me as a sensible place to economise.

If you can't take the time to read the whole paper now, then let me direct you to a particularly salient part of the conclusion.

> We have tried to demonstrate by these examples that it is almost always incorrect to begin the decomposition of a system into modules on the basis of a flowchart. We propose instead that one begins with a list of difficult design decisions or design decisions which are likely to change. Each module is then designed to hide such a decision from the others.

Enjoy the paper. In case the embedded viewer doesn't work for you: [click here](https://www.dia.uniroma3.it/~cabibbo/asw/altrui/parnas-1972.pdf).

<embed style="margin: 2em 0 2em 0" width="100%" height="800" src="https://www.dia.uniroma3.it/~cabibbo/asw/altrui/parnas-1972.pdf#view=Fit">

# References

J. B. Rainsberger, ["Modularity. Details. Pick One."](/permalink/modularity-details-pick-one). We introduce modularity by refusing to let details burden us.

Martin Fowler, [_Refactoring: Improving the Design of Existing Code_](https://link.jbrains.ca/14NaGSY). A classic text that takes an evolutionary approach to increasing modularity in a software system.

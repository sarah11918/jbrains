---
title: Adding behavior with confidence
tags: []
---
# The 30-second version

+ Adding behavior confidently involves having fewer parts to change (low duplication), knowing which ones to change (high cohesion), ease of changing just the part you want to change (low coupling), and understanding how you've changed it (strong tests).
+ Adding behavior requires breaking an existing assumption.
+ In a well-factored design, we can easily find the one place we have made that assumption. (Otherwise, why bother refactoring?)
+ First, make room for the new code, then add it.
+ To make room for the new code, extract the existing code into a method whose name describes the generalisation we want to make, or the idea we want to introduce.
+ By making room for the new code, we make that code easier to reuse by reducing its dependence on its surrounding context.

# Want to learn more?

+ Visit the links in this article.
+ Try my course: [The World's Best Introduction to TDD](//tdd.training).
+ [Pair with me](//book.jbrains.ca).

# The Details

We all want to add behavior to a system confidently, and I have observed that my confidence in adding behavior depends on two factors:

+ I know where to add code.
+ I understand the behavior of the code I am adding.

I use test-driven development as the main technique for handling the second of these two factors, but what about the first? I have uncovered a technique that I both use and teach, and I'd like to share that with you. I call this "making room for the new code", naming it for a phrase I vaguely remember reading in one of the Grand Old XP books. (Did Kent Beck or Ron Jeffries write it? I can't remember.) This technique helps me quickly find a reasonable first-draft place in the code base to put new code. After I have put the new code in place, and I feel confident that it does what I expect, I then use the [Four Elements of Simple Design][four-elements-of-simple-design] to guide me in refactoring to improve the design.

[four-elements-of-simple-design]: //blog.jbrains.ca/permalink/the-four-elements-of-simple-design

# A premise

I start with the premise that **adding behavior means breaking an assumption**. By this I mean that whenever we add code to a system in order to extend its behavior, we have to falsify at least one assumption we've previously made. For example:

+ In a payroll system, in order to support a second cheque printer, we likely have to break the assumption that there is only one cheque format.
+ In a point of sale system, in order to support separate cash and card payment reports, we likely have to break the assumption that all "we made a sale" events look the same.
+ In a mobile phone monitoring system, in order to support billing by the second, we likely have to break the assumption that we only have to count the number of minutes a call lasted.

Some of these seem obvious, and others less so, and it bears emphasising that the specific assumption or assumptions we break depends heavily on what we've built so far and the way we articulate the soon-to-be-added behavior. Even so, I conjecture that <span class="highlight">*for every behavior we want to add to a system, we can identify a non-empty list of assumptions that we **need** to break*</span>.

# The technique

1. Identify an assumption that the new behavior needs to break.
1. Find the code that implements that assumption.
1. Extract that code into a method whose name represents the generalisation you're about to make.
1. Enhance the extracted method to include the generalisation.

The less duplication you have in the system, the better this works, because duplicate code makes it difficult to find all the code that implements the assumption in question. Similarly, the more appropriate the names in your system, the better this works, because unsuitable names make it difficult to know which code implements the assumption in question, as opposed to something unrelated. You'll notice that these points relate both to the [Four Elements of Simple Design][four-elements-of-simple-design] and to the core concepts of [Coupling and Cohesion][coupling-and-cohesion].

[coupling-and-cohesion]: https://wiki.c2.com/?CouplingAndCohesion

Yes, yes...

<div style="text-align: center"><img style="width: 200px" src="//images.jbrains.ca/handy-right-about-now.png"></img></div>

# An example

We are building a point of sale system, and we've just decided to implement sales tax. I live in PEI, Canada, where not only do we exclude sales tax from the price, we have two sales taxes, and we charge the second one *on top of* the first one. For example:

<p class="example">A $125 item that attracts both GST (the "Goods and Services" tax) and PST (provincial sales tax) costs a total of $144.38. GST at 5% costs $6.25, then PST at 10% of $131.25 (= $125 + $6.25) costs $13.13. The total is $125 + $6.25 + $13.13 = $144.38.</p>

Notice that this example implies that GST or PST might or might not apply to a given product, so even before we identify the old assumption to break, we need to note the new assumption we'll make: *we assume that all products attract both GST and PST*. Our customers won't like it, but the tax authorities will love it, and only they have the power to treat us guilty until proven innocent.

Our code has a class like this in it.

{% gist 1040052 UserGestureListener.rb %}

What do we assume now that we can't allow ourselves to assume any longer? **The sale total should increment by the (net) price of the item we sell.** By *net price* here, I refer to the pre-tax price, because of course, until now, our system has no notion of "tax". Fortunately, because we've ruthlessly removed duplication so far, computing the running total of the sale requires only this line of code. We can pretty safely apply the technique of this article right here. To do this, we extract the assumption into a new method whose name represents the generalisation we're about to make. In this case, we don't want to increase the sale total by the product's *price*, but rather by its *cost*, which includes any additional charges beyond net price. So, we introduce a method for accumulating the scanned product's cost.

{% gist 1040052 UserGestureListener-AddedMethodDescribingGeneralisation.rb %}

This creates space for the new code. We test-drive the new code, and end up with this delightful monstrosity.

{% gist 1040052 UserGestureListener-Generalised.rb %}

It looks ugly, but it works. In addition to looking ugly, this method has [Feature Envy][feature-envy]. Specifically, the calculation part of `#accumulate_cost` only talks to `product`, and so it can move onto the class `Product`, leaving only the accumulating left behind. You could also say that this method had two responsibilities, so I separated them, then notice the feature envy in one of them, then moved it. I can almost always take smaller steps.

[feature-envy]: https://wiki.c2.com/?FeatureEnvySmell

{% gist 1040052 UserGestureListener-Refactored.rb %}

Notice the [context independence][goos-context-independence] we've achieved with the method `Product#cost`. We can now refine the notion of "cost" freely without worrying about how someone will use that information. We have an easy-to-find, easy-to-extend part of the system where we can add behavior for determining which products attract which taxes, supporting multiple tax calculation policies, and even including shipping, handling and restocking fees. Now we can really add future behavior with confidence.

[goos-context-independence]: https://link.jbrains.ca/2u7IktO

---
title: "The Liskov Substitution Principle Demystified"
date: "2013-01-08 14:03 AT"
---
I apologise for the pompous title; I wrote it just for fun. If this "demystifies" anything, I'll consider that a coincidence.

Of the SOLID principles, the most pompous-sounding is the one named for a person: Barbara Liskov. I don't label her pompous -- I never knew her -- but of those five principles, only LSP has a common formulation that looks like the kind of mathematics so many programmers like to avoid, while others flock to.

> Let *q(x)* be a property provable about objects *x* of type *T*. Then *q(y)* should be provable for objects *y* of type *S* where *S* is a subtype of *T*.

Or, if you prefer:

> Subtypes must not change any supertype's significant behavior. Here, "significant behavior" means behavior upon which clients of those objects expressly depend.

If you like the language of contracts, then you might prefer this formulation:
<!-- more -->
> Subtypes must respect the contracts of their supertypes.

If, like me, you like to check contract compliance with [contract tests](https://link.jbrains.ca/13e1S9Y), then you might prefer *this* formulation:

> Subtypes must pass the same set of contract tests that their supertypes pass.

Remember that *subtype* here means any implementation of an interface or subclass of a class.

So, what does it look like when we violate the Liskov Substitution Principle? Usually like this:

```
// This should never happen
```

You can't trace *all* such problems to a violation of LSP. Sometimes you have a simpler disagreement between a client and its collaborator. Even so, subtyping without careful attention to the type's contract opens the door wide to breaking the contract, which creates disagreement between a client and a collaborator whose type *we sometimes only know at runtime*. You've experienced this if you've ever ended a 2-hour-long debugging session by yelling "You idiot! How did you expect that *ever* to work?!" You've discovered a fundamental contract disagreement.

While the LSP doesn't receive the same attention as the Single Responsibility Principle, breaking the LSP leads to painful, costly mistakes. Understanding LSP, clarifying and respecting contracts helps you avoid this frustration.

I hope this helps.

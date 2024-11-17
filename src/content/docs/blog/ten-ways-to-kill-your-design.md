---
title: "10 Ways to Kill Your Design"
date: 2012-02-19
tags:
  - Dependency Inversion Principle (DIP)
---
I wish that I could take credit for this article, but I can't. Instead, I have to credit two people: [Lasse Koskela](https://www.twitter.com/#!/lassekoskela) and [Mi&scaron;ko Hevery](https://twitter.com/#!/mhevery). I credit Lasse for writing the manuscript that led me to Mi&scaron;ko's article. Look for Lasse's upcoming book _Unit Testing in Java_ [at Manning Publications' site](https://manning.com/koskela2/). Let me summarize Mi&scaron;ko's article here, then you can read the details at [his blog](https://misko.hevery.com/2008/07/30/top-10-things-which-make-your-code-hard-to-test/).

Why would I simply summarize someone else's article on this site? Isn't that dishonest? Not in this case: Mi&scaron;ko wrote essentially the same thing that I say over and over again in my own articles and in my training classes. I consider it unfortunate that he and I have never met nor worked together. We really should. You should read his stuff.

So... 10 ways to kill your design.

1. Instantiate [Services](/permalink/when-is-it-safe-to-introduce-test-doubles) wherever the hell you want.
1. Grab what you want when you want it.
1. Do real work in your constructors.
1. Make state easily changed by clients.
1. Embrace singletons.
1. Make methods `static`. (Admittedly, this is more of a problem in Java/C# than Ruby/Python.)
1. Inherit implementation.
1. Reimplement polymorphism.
1. Mix [Services and Values](/permalink/when-is-it-safe-to-introduce-test-doubles).
1. Keep [conjunctions](https://dictionary.reference.com/browse/conjunction) in your variable, method and class names.

[Read more about the problems that these "techniques" cause](https://misko.hevery.com/2008/07/30/top-10-things-which-make-your-code-hard-to-test/).


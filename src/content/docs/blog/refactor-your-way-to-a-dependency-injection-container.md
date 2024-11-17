---
title: "Refactor Your Way to a Dependency Injection Container"
date: 2011-12-07
lastUpdated: 2015-07-06
tags:
  - Dependency Inversion Principle (DIP)
---

## The 30-second version

* Invert the dependency on a Service, moving the `new` statement up one level in the call stack.[^1]
* Repeat for all dependencies on Services until the corresponding `new` statements arrive at your application's entry point. The entry point now creates a large object graph of all your Services in its `initialize` function.
* Remove duplication in `EntryPoint.initialize()`:
    * Instantiate common objects only once, passing them into the necessary constructors, replacing any Singletons with plain objects.
    * Extract the choice of implementation for each Service interface into a lookup table mapping interface type to implementation type.
    * Externalise the lookup table to a file, if you like.

Now you have a customised Dependency Injection Container for your application. To go a little farther:

* Remove duplication in `EntryPoint.initialize()` among three applications.

Now you have a generic Dependency Injection Container that probably provides 80% or more of the features you'll ever need.

I recommend trying this incrementally. Think of the `new` statements flowing up the call stack, into the entry point, then changing from code into data. Nice, no?

## The Details

I don't have much to add.

I hope this helps to demystify dependency injection containers. To read about the technique of injecting dependencies, I refer you to [one of my articles][inject-dependencies] and then [a trusty web search][search-for-di].

This technique applies the [Dependency Inversion Principle][dip] repeatedly to move the choice of implementation for an interface up the call stack. This way, concrete things depend on abstract things.

Removing duplication in the entry point respects the principle [Abstractions in Code, Details in Data][pragprog], but it does rely on reflection, which can cause some problems. All the better not to scatter this reflection throughout the code causing a serious cohesion problem. Using reflection like this, all in one place, helps balance using a powerful technique with a design that everyone can understand.

Now you know what about 70% of what a dependency injection container does. You can build one. Even if you don't go that far, the Dependency Inversion Principle will help reducing coupling and highlight cohesion problems in your design. It provides [another set of mechanics to practise on the way to becoming an accomplished designer][accomplished-designer].

[^1]: I mean "Service" in the [Domain-Driven Design][ddd] sense.

[ddd]: https://link.jbrains.ca/6AtyK
[dip]: https://www.objectmentor.com/resources/articles/dip.pdf
[pragprog]: https://link.jbrains.ca/s2V3Co
[inject-dependencies]: https://link.jbrains.ca/vN1IiF
[search-for-di]: https://www.google.com/search?q=dependency+injection
[accomplished-designer]: https://link.jbrains.ca/gmeMhh

## References

Loose Couplings, ["Dependency Injection != using a DI Container"](https://www.loosecouplings.com/2011/01/dependency-injection-using-di-container.html). A handy overview of using dependency injection containers, notably a reminder that the container ought to _enchance_ your use of dependency injection, and not interfere with it.

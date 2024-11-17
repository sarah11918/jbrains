---
title: "Modularity and Performance"
date: 2022-01-08
tags:
    - "Simple Design"
    - "Dependency Inversion Principle (DIP)"
    - "Evolutionary Design"
# summary: >
#     Are you worried that all these little classes and interfaces are going to
#     destroy your system's performance? Maybe. More often, however,
#     the bottlenecks are caused by bigger classes and fewer interfaces
#     causing duplication in the design.
---

When I teach evolutionary design with TDD, I often encounter programmers who don't like all these little classes and all these extra interfaces. (Or all these little higher-order functions, if you prefer. It's the same problem.) They worry that it creates a serious performance problem: deeper call stacks, passing parameters around, that kind of thing. They see memory being unnecessarily allocated and freed, memory becoming fragmented, and garbage collection happening at the worst possible time.

And yes, that can happen; however, this is very often _not_ where the performance problems lie in typical industrial-strength professional software development projects. More often[^your-context-varies], it's like this:

> A couple of days ago, we ran into performance problems in production, and by extracting the "code that grabs the data from infrastructure" up the call chain, we realized that there were lots of duplicate expensive database calls and other inefficient code that went through multiple databases to get something that could have been a single database query. &ndash;a slight paraphrase of a comment I received from one of my training course participants

[^your-context-varies]: If you work in one of those specialized, highly-constrained programming environments, where every kilobyte counts, then you might not want to keep reading. Even so, the few times that I've worked in those environments, I've still seen many "penny wise, pound foolish" design choices.

**This is what I see over and over again**. [Removing duplication]({% link _posts/2013-12-05-putting-an-age-old-battle-to-rest.md %}) by [pulling details up the call stack](/series#dependency-inversion-principle-dip) makes it clear that we're retrieving the same data from the database more than once. As the database access moves up the call stack towards the entry point, it collects into a single layer and often a single class/function/module, where removing the duplication becomes _easy_. When we remove this duplication, two things happen:

- we create more, smaller classes and more interfaces
- we reduce the number of "trips" to expensive, external resources

When I discuss situations like this with my clients, most of the programmers feel comfortable accepting the smaller classes/functions/modules in exchange for reducing the number of trips across a network boundary or to the file system. Of course, they'd rather have the best of both worlds. Not only do I believe that they _can_, but that as they refactor, they _will_. **They can't not.**[^you-get-what-i-mean]

[^you-get-what-i-mean]: Programmers who refactor attentively, because they know how to do it **and** have the opportunity to do it, will eventually get there. The complexity of and dysfunctions within the organization determine how far in the future "eventually" is.

## A Simple Pattern

Using techniques such as routinely [injecting dependencies]({% link _posts/2017-12-10-keep-dependency-injection-simple.md %}), [pulling implementation details up the call stack]({% link _posts/2013-01-29-consequences-of-dependency-inversion-principle.md %}), [relentlessly driving irrelevant details out of the tests]({% link _posts/2010-01-14-what-your-tests-dont-need-to-know-will-hurt-you.md %}), we end up going through phases that look something like this:

1. Break bigger modules (especially long methods/functions) into smaller modules that talk to each other through smaller/more-focused interfaces. This usually sacrifices some cohesion (not as much as you'd think) in exchange for looser coupling (and greater ease in testing). As a pleasant side-effect, this helps us notice the kinds of performance problems that my training course participant described to me. ("I've written these assertions before... Hey! Look! We're doing the same thing in, like, 7 places!")
2. Take advantage of the looser coupling to move behavior around, generally in accordance with the [Dependency Inversion Principle](/series#dependency-inversion-principle-dip). Among other things, this is when we _fix_ those performance problems. ("All this database access is now in one place. Let's combine some queries.")
3. With the design arranged "better", it becomes safer to combine modules/objects/functions into more-cohesive bundles. This makes the design easier to understand, but it also leads back (a little) in the direction of bigger modules/longer functions. As we add behavior, we often end up dumping implementation details into functions/methods where they don't _quite_ belong. This happens because when we're struggling to make some new thing work, we're less concerned about how exactly to design it. It becomes easier just to "jam it in", declare victory, then move on. The good news is that this leads us back into phase 1, where we can do this all again.

**These three phases repeat forever. And this is natural.** This is _not_ a failure of design; instead, it's a natural way for designs to evolve. That's why we need some people on our project with a bias towards adding behavior and some with a bias towards refactoring: the first group reduces our over-investment in the design and the second group reduces our under-investment in the design. We don't do much gold-plating and we delay becoming crushed under the weight of a Big Ball of Mud. 

We find balance.

## Eventually...

And yes, over time, it might be the case that we find some performance problems related to too much indirection, allocating too much memory, passing too many arguments around. Imagine how well you're likely doing if creating too many objects in memory is your most urgent performance problem!
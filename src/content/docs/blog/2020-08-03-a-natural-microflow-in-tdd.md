---
title: "A Natural Microflow in TDD"
date: 2020-08-03
summary: >
    To some it feels a bit wrong, but it feels quite natural to me:
    I often need to refactor just before writing the next failing test.
    Indeed, that seems like a good practice on its face!
---

A reader asked me this question: 

> I've always wondered how does the basic flow of red, green, refactor reconcile with the concept of "make the change easy, then make the easy change"? Does that imply sometimes doing an extra refactoring before the next red [failing test] after deciding what the next change should be or is "make the change easy" referring to non-TDD things like an occasional larger-scale refactoring task?

In short: yes to the first option. I often find myself doing this:

1. Write a new failing test.
2. Notice a refactoring that would make the next step easier.
3. Ignore/delete the new failing test.
4. Refactor.
5. Rewrite the intended failing test---or occasionally a different one!
6. Continue.

If I understand the problem really well, I can often do 1-3 in my head and jump directly to 4. [With enough practice]({% post_url 2020-05-13-breaking-through-your-refactoring-rut %}) I don't have to take "the long route" every time and even when I take the long route, I've mastered the microsteps, so it takes only a few tens of seconds. The size of the refactoring that I perform in step 4 varies. I find myself needing large-scale refactoring tasks less often in this situation (and indeed in general), as long as I have been guiding the design to evolve over time in smaller steps (my usual way of working). Instead of a needing clean up a big mess, I often clean up a handful of little messes more often. That leads to dancing this little forward-and-back dance more often while mostly avoiding the pain and suffering of a large-scale refactoring task.

I demonstrate this in [The World's Best Introduction to TDD](https://tdd.training/lectures/133270) with my "Add Fractions" example, which you can watch without purchasing the course.

Moreover, I can see this forward-and-back dance as a good sign: I'm refactoring when I have evidence that I need it, rather than doing it before I need it. Of course, that doesn't make speculative refactoring uniformly bad, as long as it doesn't delay releasing features to waiting customers.
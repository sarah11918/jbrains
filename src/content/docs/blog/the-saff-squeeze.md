---
title: "The Saff Squeeze"
date: 2022-03-28
tags:
    - Tutorials
# summary: >
#     Debug with automated tests: it's systematic, it leaves
#     a record of what we've learned, and it's boring in the
#     best possible ways.
---

I like it when programming feels boring. I prefer to save the excitement for the actually difficult parts of the job of developing software: understanding what to try to build, navigating people, negotiating plans, all that stuff. When it comes time to write code, I'd like that to be exactly the right kind of boring: I want things to work, I want to make steady progress, and I want to know what's left to do.

Defects interfere with this rhythm.

When something behaves in an unexpected way, my emotions become heightened. I suddenly notice all the delicate information crammed into my working memory at risk of being lost to history. My breathing changes. Everything stops. In that moment, I want a _system_. The Saff Squeeze is part of that system.

Here is the Saff Squeeze in one sentence: **inline parts of a failing test until the reason for the failure becomes obvious**. Now you know enough to be able to do it, but if you'd prefer some detailed instructions, read on.

# When?

I use this technique when I discover a defect and I don't know what's causing it. Most often, this means that I make the mistake at some unknown point in the past and am only now encountering it. I'm hunting for the test that I failed to write (or wrote incorrectly) at some point in the past.

Sometimes, however, I use this technique when I'm adding behavior with a new, intentionally failing integrated test, but I'm not sure where to add the behavior. This technique helps me find a failing microtest that corresponds to my failing integrated test. I generally prefer to work with smaller tests over bigger tests, but I'm often forced by circumstances to work with bigger tests. I digress.

# How?

Start with a failing test---any failing test.

1. Run the test and watch it fail. Commit. You'll almost certainly squash later.
1. Inline the action of the test. This often requires raising the visibility of internal parts of a module, so do it. Don't worry about weakening the design for now.
1. Look for intermediate assertions to add, such as checking the condition of an `if` statement. Add assertions as "high" in the test as possible. We are looking for a new assertion to fail earlier in the test.
1. Once the failure moves earlier in the test, commit. You'll squash later.
1. Prune away unnecessary parts of the test, such as paths of `if` statements that don't execute and all the code after the first failing assertion. Commit. You'll squash later.

Do you now understand the cause of the defect? If yes, document it and decide how to fix it. If no, try another iteration of the steps.

At some point, you'll find "the missing test". This is a test that you probably wish that someone had written at some point in the past. We don't need to blame anyone, even though we might want to. We have found a missing test. We can interpret that as good news about today, not bad news about yesterday.

Don't rush. Take a moment. Write things down. Breathe. Now decide how to proceed:

- Maybe squash all these commits, because they add up to "here's a failing test we should have written before; we'll make it pass now". The project history makes it look the same as if we'd always planned to test-drive this behavior today.
- Throw away all those commits, then test-drive the missing behavior using the notes you wrote when you documented the cause of the defect and how to fix it.

I imagine there are other options, but I'm not sure what they are right now. Maybe there aren't.

# Why?

I like having a record of the failing tests, from which I can document both the cause and the resolution of the problem. I can also use the Saff Squeeze to turn bigger tests into smaller ones: I often Squeeze in order to uncover the microtest that I wanted to write, but couldn't think of how to write.

Raising the visiblity of internal parts of a module sometimes points me directly to encapsulation choices that seemed sensible at the time, but didn't work out in retrospect. This provides valuable design feedback that guides me to adjust the boundaries between modules: breaking things apart and extracting new interfaces.

I like how orderly it feels to do this. It feels like steady progress. It feels exactly the right kind of boring, which helps me think more clearly.

I love how autonomic most of the steps are. I don't need to understand anything about the code to Squeeze accurately; it's enough merely to understand the programming language. I need to know how to inline functions, identify dead code, add assertions at every branch point, and remove the dead code. That's it. I can practise those things every day, then perform them accurately and safely under pressure. I frequently experience it when I Squeeze that I have no idea what the failing test even _means_, then gradually I understand the cause of the problem with crystal clarity. No "talent" required. I imagine that Kent Beck had this kind of thing in mind when he labeled himself "a decent programmer with excellent habits".

# The Name

Kent Beck named the Saff Squeeze for David Saff, who showed him the technique while they worked on JUnit 4. That's the folklore version, since I wasn't there when it happened. Maybe something completely different happened; you'd have to ask Kent.

# No Example: Just Do It

You want to see an example. I understand. Don't bother. Just try it. Worst case, you throw away the commits and try again later. It's really not mysterious. Just follow the steps. If any step seems unclear when you try it, then find me and ask me---maybe I need to clarify something in this article.


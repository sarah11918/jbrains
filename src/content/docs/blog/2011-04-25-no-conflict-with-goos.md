---
title: "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam): No conflict with GOOS"
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
*I've taken this verbatim from a thread in the Google group for Steve Freeman and Nat Pryce's excellent work, Growing Object-Oriented Systems Guided by Tests. As I've said before, they've written the book I wish I'd written. I quote Rick Pingry below.*

> My partner and I were just looking at a video you made a while back
> about integration tests being snake oil.  The GOOS book of course
> talks about Acceptance Tests, but perhaps you are making a
> differentiation between acceptance tests and integration tests.  I
> bring it up in this thread because I think it is relevant.

Short version: Don't use end-to-end tests to avoid flaws in the basic
correctness of your system.

The crux of the problem: The Average Person™ conflates "Acceptance
test" (help the Customer feel good that the feature is present) with
"System test" (help the Programmer feel good that the system
components work together correctly) because they *tend* both to be
end-to-end tests. As a result, the Average Person doesn't write enough
microtests.

GOOS uses Acceptance Tests to guide programming and help Programmers
know when they've built enough stuff. Because they choose to implement
those tests in Java, the Average Reader™ might interpret those tests
as System Tests, and believe that they serve the purpose of making
sure the whole system works. Even when GOOS *does* use them as System
Tests, the book also shows many, many microtests, thereby avoiding the
logic error that the Average Person™ makes.

> In there
> you take the approach that you should mock ALL collaborators.  In a
> bit of code we wrote recently, we did that very thing, but find that
> making changes to how the thing works is hard.  Refactoring becomes
> harder.  (I wrote about this before and got lots of great advice from
> you guys, but I think I understand better about what is going on now
> so I can speak a little more intelligently about it).  The tests
> become glue that makes any kind of change to HOW a class is
> implemented difficult if you ever want to extract an internal.  The
> GOOS book and this thread talk about a difference between peers and
> internals, and I get the impression that you should mock the peers and
> not mock the internals.  I am not so sure now after hearing your talk
> about that.  Am I missing something?

No. I agree about using test doubles for peers, not internals. I
simply use the painful pressure from trying to use test doubles for
all collaborators to help me classify them as peers or internals.
Sometimes I guess well about that classification as a shortcut, but
when I don't guess well, I can always take the long route.

>  If you are mocking out every
> collaboration between every class in your system, how do you refactor
> anything without breaking tests?  Are you supposed to be able to
> refactor without breaking tests?  Could you provide an example of how
> you do that?

I tend more often to throw away tests than break them. If changing a
client leads to changing a peer interface, then I switch to revising
the contract tests for that interface. Sometimes this means throwing
tests away, because sometimes this means throwing an interface away.

I'm afraid I have no example to show you, because contrived examples
don't demonstrate the point adequately, and I don't own the IP rights
to the real-life examples I've used.

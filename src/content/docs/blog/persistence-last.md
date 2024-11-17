---
title: "Persistence Last"
date: 2003-07-01
lastlastUpdated: 2016-11-09
---
<aside markdown="1">

I originally wrote this article in 2003, based on experiences I had from 1997-2001 while working at IBM. The original Domain Driven Design
website kindly published it for me, but they appear to have since reorganized everything, and the link to the original article had become lost. Kevin Rutherford asked me to find the article, and I didn't even know where to look at first. Fortunately, I found _one tweet_ (of mine!) that referred to an otherwise dead link to the previous incarnation of this blog. The internet sometimes amazes me in its resilience.

</aside>

I was working at IBM when I
discovered JUnit, Design Patterns, [_Refactoring_](#references) and [_Pragmatic Programmer_](#references).
These all gave me a bright idea how to deal with a specific problem in
my programming group. There is a database group that acts as gatekeeper
to the database schema for our product. Since the product has several
hundred tables, I can appreciate the desire for conceptual integrity by
having a small group of like minded people oversee its design.
Unfortunately, for the most part, the database gatekeepers do not
criticize design, rather they merely control change. This change control
leads to problems on both sides: sometimes I have to wait five business
days for the testing group to see changes; sometimes my changes are
“lost in the translation” and made incorrectly by one of the
gatekeeper’s teammates. This sets the context for my decision to do
something radical: develop the database schema last. It is radical
because in that organization, the database was --- and may well still be[^may-well-still-be] ---
the center of the universe. 

I built a component entirely decoupled from
its persistence mechanism. It was the first time that I wrote code that
felt truly object-oriented.[^naive-about-oo] Using JUnit to test my business logic led me
to use a “dummy” persistence mechanism during testing, and I continued
to use this dummy persistence mechanism until I had implemented every
feature I needed.[^dummy-persistence-mechanism] This led me up to approximately three weeks before
feature/database schema freeze. As one might expect, this was a period
of time during which teams were continually submitting schema changes
and during which weekly meetings were used to judge which changes were
“in” and which were “out”. These was considerable tension as everyone’s
goal was to converge on a final schema. At “freeze minus three weeks” my
component was fully built, fully programmer tested, including an entity
bean-based implementation of the persistence mechanism. Building this
entity bean persistence mechanism led to designing a simple, four-table
database schema. **I designed the database schema only after all the
business features were fully implemented and programmer tested.** Since I
practised test-driven development, "implemented" implied “programmer
tested” in this case. At the third-last meeting [of the [Change Control Board](#references)] I submitted my request
for new database tables. In response to complaints that I was bringing
this up “awfully late in the cycle” I stated with supreme confidence,
“Yes. To compensate you for this, I relinquish all change requests for
the rest of the release. If I feel I need a schema change, I will simply
have to deal with it myself somehow.” The database group hesitated, but
felt that they had little choice: without the schema I proposed, there
was no way to ship my feature set. They agreed. 

As I promised, I changed
absolutely no part of that database schema. While other groups were
scrambling to make last-minute changes, I sat back, relaxed and grinned.
Of course, while they were also scrambling to fix defects that the
testing group reported, I also sat back, relaxed and grinned. I did have
to fix one defect, but that was a misunderstood requirement, rather than
an incorrectly-implemented feature. I attribute this success to two main
techniques: programmer testing and letting the domain drive the database
schema.

[^may-well-still-be]: I originally wrote this line in 2003, thinking back to 2000. I don't think I would change this line at all, even today. On the contrary, _the database_ has become even more of the center of the universe in many (most?) of the codebases I've seen in the nearly 20 years since.

[^naive-about-oo]: I forgive myself for saying something like this, even though I probably meant "modular" and not "object-oriented". I probably meant "with a non-zero amount of abstraction", as opposed to the typical open, obsessed-with-details "design" that I've seen in myriad codebases since.

[^dummy-persistence-mechanism]: We would now recognize this as using test doubles for the Repository layer.

## Epilogue

This was the second of two experiences from my early programming career that informed my opinions about programmer testing and the role of test doubles. Although I don't remember doing this work in the now-called Mockist style, it was the first time that I decoupled persistence from the domain model (such as it was) and understood the difference between using test doubles for technology dependencies (JDBC in this case) and using them one level higher in the call stack to separate the Repository abstraction from the rest of the system. It was the first time that I really tried "not mocking types that I didn't own". It worked well!

This episode contributed considerably to my advocacy for programmer testing, test doubles, and eventually test-first programming, evolutionary design, and test-driven development. Without it, I would not be writing these words today.

## References

Steve Freeman, Nat Pryce, Tim Mackinnon, Joe Walnes, ["Mock Roles, Not Types"](https://www.jmock.org/oopsla2004.pdf). The programming episode that I describe here amounted to applying the principles of this paper to my design, using test doubles for the Repository and not the database client library.

Martin Fowler and others, [_Refactoring: Improving the Design of Existing Code_](https://link.jbrains.ca/32ZLFJJ).

The Gang of Four. [_Design Patterns: Elements of Reusable Object-Oriented Software_](https://link.jbrains.ca/11ATEqK). The original reference for a description of the Abstract Factory pattern.

Andrew Hunt and Dave Thomas, [_The Pragmatic Programmer: From Journeyman to Master_](https://link.jbrains.ca/WNg8Se). Still one of those classics that demands a place on every programmer's bookshelf.

Steve McConnell, [_Rapid Development: Taming Wild Software Schedules_](https://link.jbrains.ca/1QzMlux). The book that includes, among other things, the Change Control Board as one of its "blue-ribbon practices", McConnell's version of a "best practice".

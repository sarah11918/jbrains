---
title: "TDD: You're Probably Doing It Just Fine"
date: 2024-03-25
tags:
    - "Programming Without Blame"
    - "Not Just Coding"
excerpt: >
    Many programmers struggle to adopt TDD because they put pressure on themselves
    or because some commentators try to shame them for their imperfections or
    because someone else is forcing them to do it. This causes needless stress,
    even suffering. Let's try to reverse that trend.
---
I'd like to share a few little points to help you or someone you care about through their day.

- You can write good code without TDD.
- Even the act of trying to write one test is already enough to clarify your thinking about what the system (or some part of it) ought to do.
- You don't have to do TDD 100% all the time perfectly in order to benefit from doing it some of the time and pretty well.
- You might find tests helpful when it comes time to change the code after you've written it the first time.

I fear that some people feel like they're Not Doing It Right when they're doing actually quite good work. Even so, I'd bet my own money that, on average, you'd benefit from practising more TDD than you do now.

TDD definitely doesn't work if you turn learning into a guilt/shame spiral by focusing on what you don't yet know and what you don't yet do.

# Some Clarification

If that was enough for you, then stop. If you'd like a little more detail, then read on.

## Point 1

**You can write good code without TDD.** I wanted to learn about Test-First Programming (as we called it then) because I grew tired of the mistakes I was making. It seemed like I shipped defects every week and when I fixed one defect, I created two more. This provided a natural motivation to try writing tests before writing production code. The rest is history.

Just because I needed it then and still appreciate it now doesn't mean that you need TDD to write good code. Remember: the goal is to write good code for whatever "good" means to us in the moment. In 1999, I wanted the "it actually works!" kind of "good", although over time that expanded towards the "I don't hate it after I've written it" kind of "good" combined with the "Pretty much anyone who needs to change it can change it pretty confidently" kind of "good". I continue to be able to write that kind of "good" code, partly because of the lessons I learned from practising TDD and partly because when I get into trouble, writing some tests first tends to get me out of that trouble.

Even so, you might care about different kinds of "good" and you might make different kinds of mistakes, so maybe TDD isn't what you need right now. If you don't need it, then don't feel bad about not doing it. **And ignore anyone who tells you that not practising TDD amounts to some kind of malpractice or---universe help us---"unprofessionalism".** What bullshit!

If you don't know how to write low-defect code that's also inexpensive to change in the future, then you should probably learn how to do that. And maybe TDD would help, but if you find another way, then go for it!

## Point 2

**Even the act of trying to write one test is already enough to clarify your thinking about what the system (or some part of it) ought to do.** I'm continually amazed at what happens when I merely try to write one test from beginning to end in all its gory details, especially when it's the first test for an unfamiliar feature or feature area in the system. **Even if I never run that test**, the mere act of writing it leads me to clarify so many things floating around in my mind that any inaccuracies or unclear parts become magnified to the point that I can't ignore them. When I write such a test using pen and paper, about half the page ends up scratched out and rewritten. And that's the point! Writing even just one test, whether you automate it or not, whether you write any more tests or not, is already enough to help you see what's unclear in your mind about what you intend to build. Just try it!

Writing one test before you to try to write production code doesn't mean committing to practising TDD perfectly all the time. Often it's enough just to write one test, and then enough becomes clear that you feel confident that you can take it from there. Remember: if you get into trouble, then writing more tests and earlier might help you get out of that trouble!

## Point 3

**You don't have to do TDD 100% all the time perfectly in order to benefit from doing it some of the time and pretty well.** I got great benefits from practising test-first programming the first time I did it "in anger" on a real project at my day job over the period of about 10 days. I barely knew what I was doing. I was slow. I was literally changing as little as four lines of code _per hour_ half the time, because my tests were so slow! And it still helped me redo three months of flailing around in 9, 14-hour days. (If it weren't crunch time and if I hadn't put myself in a corner, that could have been three relaxed weeks. Live and learn!) I was writing horrifying integrated tests and I was already falling for the scam. My design was tangled in spots in ways that I would notice in an instant today. **And it still went much better than what I'd been doing before.** That's the point: you can reap benefits from writing the test first even before you know how to do it well, so let yourself do it as well as you can. Ask questions. Just keep going.

You won't know what you're doing until you've written about 2000 tests, so get started!

## Point 4

**You might find tests helpful when it comes time to change the code after you've written it the first time.** Senior programmers routinely tell me that they want to throw their tests away after they've written the production code. I still don't really understand why they accept remaining imprisoned by design choices of the past, especially when I also hear them routinely complain about how difficult it is to work in legacy code and how nice it would be if they could just write it all over again.

I want to be able to refactor and I tend to find that safer when I have tests, even if I have to refactor the tests as well. If I don't have helpful tests, I can use microcommits as a way to limit the damage of making a mistake while refactoring. Even so, I _built_ my refactoring skill by feeling free to move code around and break things, and **I don't know how I would have felt that freedom without tests to sound the alarm when I made a wrong move**. If you have another way to create a safe learning environment for changing the design decisions you regret, then you should do that, but I found tests indispensable while I was developing my skills and judgment.

# A Conclusion

Just because you'd like to do it better doesn't mean you're doing it _wrong_ or even _poorly_. And even if you are doing it poorly now, repetition leads to ease leads to chunking and you'll gradually do it better. For most people most of the time, their brain doesn't give them a choice: it gathers experience and improves skill, even when they don't notice it happening. It is enough to keep practising, and when it doesn't go well and you need to stop, don't worry about it. Just start again.


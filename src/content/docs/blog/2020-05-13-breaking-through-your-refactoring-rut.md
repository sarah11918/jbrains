---
title: "Breaking Through Your Refactoring Rut"
date: 2020-05-13
tags:
    - Simple Design
    - Microtechniques
    - Refactoring
summary: >
    You understand the benefits of refactoring, but you still feel a
    strong impulse to rewrite larger pieces of your system. You believe
    that refactoring would be safer and more effective,
    but it feels too slow for you to choose to do it under the pressure
    of an industrial-strength situation. What does that mean? What 
    can you do?
image: https://blog.thecodewhisperer.com/images/breaking-through-your-refactoring-rut/better-refactoring-through-chunking.png
---

Refactoring, the activity, involves the following things.

- improving the design of existing code
- ... in a sequence of small transformations
- ... that preserve the important behavior of the system
- ... which you can complete relatively quickly
- ... and which gives you inexpensive options to change direction.

Effective refactoring combines the value of Real Options thinking with the care and attention of engineering. It reduces volatility in the marginal cost of adding features.  It reduces the overall risk of changing code. As I become more comfortable refactoring, I felt freer from the restrictions of _if it ain't broke, don't fix it_. So why doesn't everyone do it all the time?

In short, many of them don't make it past the scary part of the learning curve. More to the point, **many of them don't reach the point where they can think effortlessly about rewriting code as a sequence of high-level refactorings**. They remain stuck in a rut: a positive feedback loop that trains them to believe that they'll never refactor effectively enough to make it worth their investment. I think I know at least one reason to become stuck in the this rut and a way to break through it.

Not enough programmers let the fundamentals of refactoring become effortless. They need to practise or risk forever feeling like "it's too hard" or "it's too slow". Accordingly, they never feel the power of being able to think about big design changes as a sequence of tiny, safe changes. This results in legacy code sooner than it needs to happen. **The programmers who break through this rut give themselves a big advantage in their work**. Let me tell you more about how I believe this happens.

## Chunking

<img class="paragraph-eyecatcher" src="https://images.jbrains.ca/icons/noun_head with a target_2011503.png"></img>

Cognitive psychologists talk about [_chunking_](https://en.wikipedia.org/wiki/Chunking_(psychology)), a phenomenon in which people can remember things more easily by grouping them in a way that allows them to extract meaning. Chunking uses highly-constrained working memory more efficiently, both making certain tasks less difficult and freeing the person to have more complicated and sophisticated ideas. Not chunking causes the person to remain stuck giving their attention to smaller details, which interferes with the person's ability to remember the bigger picture and causes them to "solve" the same simpler problems over and over. I hope it seems intuitively reasonable that intentional chunking becomes a useful strategy for developing cognitive skills. Not sure? Think about one of the most elementary and critical skills you ever developed: understanding written language.

### Learning to Read Involved a Lot of Chunking

Look at the glyphs on this screen that represent the letters in these words. Do you even remember the days when you didn't immediately recognize them? Do you even remember the days when you weren't sure that this glyph "a" and this glyph "A" represented the same letter? If you don't, then I encourage you to try to read words in an alphabet/abugida/adjad you don't already know, such as [Armenian](https://en.wikipedia.org/wiki/Armenian_alphabet) or [Ge`ez](https://en.wikipedia.org/wiki/Ge%CA%BDez_script) or [Hebrew](https://en.wikipedia.org/wiki/Hebrew_alphabet). Even before you understand the meaning of the words, you likely have to spend a lot of effort just to decipher the symbols glyphs and map them to their basic sounds. You have to pay attention to every detail. You might not recognize that two glyphs represent the same letter, where we only ever use one of those glyphs when the letter comes at the end of the word. When I try to read Hebrew words, it takes all my effort and I mostly don't know how to even recognize the letters. And yet some people read Hebrew effortlessly.

Now become aware of not only how easily you recognize these glyphs in the Latin alphabet, but the sounds typically associated with them in English, then the sounds typically associated with various common combinations of them (like -tion). Become aware of how little effort you put into decoding the glyphs into letters, then into words, then into phrases, then into sentences, then even into overall themes and concepts! **If you can skim this article and get the general idea, then you should thank chunking!** I can't skim a text in French very well and I mostly can't skim a text in Swedish at all, but in English I do it quite effortlessly. All this depends on chunking at various levels: glyphs into letters, letters into sounds, letters and sounds into words, words into phrases... and I built all that up over time with practice. So did you!

Some people believe that children have a knack for chunking as it relates to language. I don't know enough to judge, but I see two reasons that children would experience a lot of chunking related to language: they have a very strong motivation to learn language and they really have nothing else to do. The two of these together make it natural for them to **practise recognizing and producing language most of their waking time** and maybe even in their sleep! Adults could probably achieve the same results if they could approach learning a new language with the single-minded focus of a very young child. (Yes---it's probably much more complicated than that. The mind is a strange place.)

I digress. Please permit this generalization: you (neurotypicals) learned how to read your native language well to (mostly) effortlessly skim the average text written in that language. Chunking almost certainly played a central role in this achievement. I propose that we use this idea in how we approach refactoring in particular and evolutionary design in general. First, let's see developing refactoring skill in terms of chunking.

## Learning to Refactor Involves a Lot of Chunking

I've watched hundreds of programmers try to improve at refactoring. Many of them continue to stumble when they try to refactor code. They remain stuck in performing the elementary refactorings safely; they have to pay close attention to almost every step as they go. **Even if they know the general direction in which to nudge the design, they feel awkward or unsteady trying to arrive there through a sequence of safe, reversible, behavior-preserving transformations**. Their experience doesn't seem much better even when they have automated refactoring tools to help them. They find it difficult to keep track of the intermediate steps while they perform the smaller ones. They're not chunking.

When I pair with such a programmer, I end up keeping track of the intermediate steps for them. It doesn't seem harder to me when I type compared to when I don't. I often have the experience of seeing 3-5 intermediate steps ahead while I'm completing the current elementary refactoring (like moving a function from one module to another, leaving a delegating function behind for safety). If the other programmer becomes lost, they finish a step, take a deep breath to recover some energy, then look at me to remind them which small refactoring step to take next. I don't have to work hard to do that. This is the result of all the chunking I've done over the years.

And therein lies the difference. **The programmers who haven't chunked get lost easily, grow tired sooner, and either need me to help them push on or give up entirely**. In the best case, they can't do it without me and in the worst case, they just give up, rip out the old code and rewrite it. That last strategy fails much more often or at least costs much more than they believe it will. All this because they haven't chunked enough. Specifically, they haven't chunked the _nanosteps_ into _microsteps_ or the _microsteps_ into _moves_. This doesn't just slow them down, but it holds them back.

### Some Helpful Terms

<img class="paragraph-eyecatcher" src="https://images.jbrains.ca/icons/noun_paraphrase translate_3159905.png"></img>

In my lexicon, a _nanostep_ is something like adding a new field to a class. Another nanostep is finding code that wrote to an existing field and adding code that writes the corresponding value to the new field, keeping their values synchronized with each other. Yet another is remembering the keystroke for "extract variable" so that you can simply type the expression (right-hand value) that you have in mind first, then assign it to a new variable (and let the computer compute the type of the variable for you).

A _microstep_ is a collection of related nanosteps, like introducing an interface _and_ changing a few classes to implement that interface, adding empty/default method implementations to the classes that now need it. Another is pushing a value up out of the constructor into its parameter list. Yet another is remembering that you can either extract a value to a variable before extracting code into a method or you can extract the method first, then introduce the value as a parameter, and which keystrokes in NetBeans make that happen.

A _move_ is a collection of related microsteps, like inverting the dependency between A and B, where A used to invoke B, but now A fires an event which B subscribes to and handles.

### Why Programmers Need To Chunk

The programmer who doesn't chunk nanosteps into microsteps and microsteps into moves needs to focus their energy on executing the nanosteps safely. They don't have enough working memory to remember the sequence of moves that leads to improving the design. They might not have enough working memory even to remember any sequence of microsteps that achieves one of those moves safely and effectively. They burn their energy more quickly, make more mistakes, and give up sooner. Moreover, they don't train themselves to think of changing big portions of the design as a sequence of safe moves that progress steadily.

**The programmer who chunks in this way feels little resistance to making a useful improvement in the design, because they see a sequence of moves that will work**. They feel little resistance to performing the moves because they see sequences of microsteps that will get there. They feel little resistance to performing the microsteps because they perform the nanosteps unconsciously. Piano players call this "having the notes under one's fingers". I can change a method signature in Java using IntelliJ IDEA while looking away and talking to someone, because I have chunked!

I can think of even intricate moves a single thing, because I've chunked enough at the level of nanosteps, microsteps, and even moves. Many of the programmers who practise with me struggle to think of Replace Inheritance with Delegation as a single thing, so it happens quite often that they fight to get through a few steps, make a mistake or two, and then ask me, "Where were we? What's the next step?" They simply can't remember what to do next. They haven't chunked enough at the level of nanosteps and microsteps and so they've exhausted their working memory. **This lack of chunking causes them to remain stuck at the level of nanosteps and microsteps indefinitely**. They don't progress. And they certainly don't grow comfortable seeing large-scale changes as a sequence of moves that they can perform confidently, safely, and quickly.

<div class="aside" markdown="1">
The classic book [_The Pragmatic Programmer_](#references) includes advice on learning one editor really well. This leads to chunking. Some people think of it as "muscle memory", but it's more than remembering how to perform the steps of moving text around, but also the act of performing the nanosteps without effort so that you can think about the microsteps and moves instead.

</div>

## Let Yourself Design By Shaping Clay

I remember learning from Ward Cunningham the metaphor of changing designs like shaping clay. Software "is soft", he would say, precisely in the way that we can shape it as we need to when we need to. If it costs "too much" to change the design of the software, then often the limit lies in our ability to work the clay. The software has hardened; we might as well be printing circuit boards. I believe that as we chunk at the levels of nanosteps, then microsteps, then moves, we achieve quantum leaps in our ability to work the clay. More to the point, I feel quite confident that those who don't chunk at those levels will find that software remains forever "hard" to them. We can do better!

## Practise the Microsteps

By now you have either stopped reading or you urgently want to know how to chunk these nanosteps and microsteps. I did it by practising, reflecting, and writing. Don't worry: it sounds worse than it is.

Most programmers remain stuck in a feedback loop that starts with "I should refactor here" and goes through "I think I need this move", then "I think I need those microsteps", then "How do I do step 4 again?!", followed by "This feels too slow", and finally giving up. **They never chunk because it feels too slow and it feels too slow because they never chunk**. Therefore, they need to practise so that they can execute the nanosteps with little conscious effort, making the microsteps easier to repeat. They need to practise so that they can execute the microsteps with little conscious effort, making the moves easier to repeat. And so on. You can do this.

It also helps to write about what you're doing. You can do this by answering elementary questions about refactoring on web sites like Stack Overflow, Quora, in Slack channels, and various other bulletin boards, message groups, or forums. You can also do this by asking questions in those places, describing what you've tried, so that others can judge where you've gone wrong or got stuck. It doesn't matter whether anyone's reading, so long as you're writing! When you write about your practice, you reflect on it. As you do this, chunking happens. You couldn't even stop it if you tried!

If you don't feel comfortable practising "for real", because you don't want to mess up code from your day job, then you can try practice drills like this one. (And yes, I've done this with real clients who paid me real money and it helped them!)

### Practice Drill: Replace One With Many

<img class="paragraph-eyecatcher" src="https://images.jbrains.ca/icons/noun_computing_1876210.png"></img>

We often need to replace one implementation of a thing with another one. We follow the safe approach of adding the new thing, migrating the clients, then removing the old thing. We can practise this by generalizing a single thing to a collection of things. We can start small by changing a function parameter, but later we could try the same thing with a field (member variable). First, let me describe the nanosteps and microsteps, then I'll describe a way to practise them.

1. Identify a function parameter `x` which is a single thing. You'll replace this with `xs`, a collection of the same kind of things. I'll call the function `f()`.
2. Add parameter `xs` to function `f()` safely, so that all the code that invokes `f()` passes in the equivalent parameter to the one it passes now. For example, if it passes `12` for `x`, then add another argument `[12]` for `xs`. (Here, `[12]` is a collection of one item, `12`. In Java, this might be `Arrays.asList(12)`). **Change all the code that invokes `f()` before moving to the next step.**
3. Focus on the body of `f()`. Find the first place that reads `x`. Replace that with code that reads from the only element of `xs`. In Java, this might be `xs.iterator().next()`, whereas in Ruby this might be `xs.first` or `xs[0]`. Repeat this step for every place inside `f()` that reads `x`.
4. Find the first place that writes to `x`. Add code that also writes the same value to `xs`. Be careful! You will find it safer to reassign a new value to `xs`, rather than changing the value of its only element, if you work in a language that passes collections by reference! Repeat this step for every place inside `f()` that writes to `x`.
5. It should now be true that `f()` does not touch `x`, but rather only `xs`. Verify this. Once you do that, delete all the code that touches `x`, but do not delete the parameter yet.
6. Go to all the code that invokes `f()` and stop passing a value for `x`. If your language lets you pass `null`, do so. If not, then pass any kind of nonsense value. **Change all the code that invokes `f()` before moving to the next step**.
7. Remove `x` as a parameter from `f()` and remove the corresponding argument from all the code that invokes `f()`.
8. Focus on the body of `f()`. Find the first place that explicitly assumes that `xs` has only one element and replace it with iteration (a loop, `map`, `forEach`, `filter`, `reduce`... whatever you need). Repeat this step for every place inside `f()` that explicitly talks to the only element of `xs`.
9. It should now be true that `f()` only uses `xs` by iterating over the collection somehow. The generalization should be complete. Verify this. Once you verify this, you have finished the refactoring.

Now try to follow these steps in some code. Any code. It doesn't matter which code you choose.

### Round 1

Practise this for **10 minutes**. Use a timer.

Pick a function, pick any parameter to that function, then follow these instructions to replace a single thing with a collection of things. **The resulting code does not need to make sense nor be better**. You will throw your changes away at the end. Perform this move by paying close attention to the microsteps. Focus on precision and safety, not speed. Focus on finishing each step before starting the next one. If you finish refactoring your function, pick another one.

When the timer signals that 10 minutes are up, consider reading your code, but don't feel obliged to do that. Take a moment to recover. Throw away your changes, such as with `git reset --hard`. Step away for a few minutes. Maybe even come back to this tomorrow.

### Round 2

Repeat round 1 for 10 minutes. **Pick the same function that you started with last time**, if you can remember it. Practise in the same way as before. If you finish refactoring one function, pick another one. Continue until you finish 10 minutes. Recover. Throw away your changes. Step away.

### Rounds 3 and 4

Practise again for **only 5 minutes** each time. Take a short break between rounds.

### Rounds 5 and up

Practise as many times as you like for 5-15 minutes per round. Start at 5 minutes, then as that feels comfortable, try a longer session. Start anywhere in the code. Throw away your changes each time. Take a short break between rounds. **Do this until you feel like nothing is changing**.

### Debrief

As you complete each practice round, **become aware of how much conscious effort you need to bring to this work**. You might notice going more quickly, but **I care more that you notice going _more easily_, meaning with less effort**. Become aware of becoming more comfortable thinking ahead, remembering where you are in the steps, remembering what's left to do, and taking shortcuts while remaining safe. With enough practice, you'll feel confident doing this refactoring in an industrial-strength situation. More importantly, you'll feel _almost no resistance_ to refactoring like this in an industrial strength situation. **The lack of resistance signals beneficial chunking**.

### Future Work

Once you've done this with my sample drill, you can probably invent similar drills for other refactoring moves, like Replace Conditional with Polymorphism or Replace Inheritance with Delegation or Replace Action with Pub/Sub Event. Gradually you'll feel more comfortable just working this way at your day job. Gradually **you'll take on bigger restructurings** by thinking of them as a sequence of safe, reversible moves that you can make steadily and confidently.

## Summary

Refactoring benefits the programmer who develops habits that make refactoring effortless. You can achieve this by chunking at the level of nanosteps, then microsteps, then moves. If you do this, then you'll see how to guide your system's design to evolve safely and steadily. If you don't, then you'll likely remain the trap of wishing you could rewrite it, but never being able to justify that---at least not until a crisis hits. A little practice goes a long way to doing much better than that. **Repetitive deliberate practice leads to chunking** leads to confidence leads to a lack of resistance **leads to better results**.

# References

Wikipedia, ["Chunking (psychology)"](https://en.wikipedia.org/wiki/Chunking_(psychology)). A reasonable overview of the concept, including how it relates to using working memory more efficiently.

J. B. Rainsberger, ["Test-Driven Development as Pragmatic Deliberate Practice"](https://blog.jbrains.ca/permalink/test-driven-development-as-pragmatic-deliberate-practice). I see TDD as a pragmatic way to deeply understand modular design through deliberate practice.

Andrew Hunt and Dave Thomas, [_The Pragmatic Programmer: From Journeyman to Master_](https://link.jbrains.ca/WNg8Se). Still one of those classics that demands a place on every programmer's bookshelf.

# Attributions

The icons in this article came from [The Noun Project](https://thenounproject.com).

- **head with a target** by _Veremeya_
- **paraphrase translate** by _Eucalyp_
- **computing** by _ProSymbols_
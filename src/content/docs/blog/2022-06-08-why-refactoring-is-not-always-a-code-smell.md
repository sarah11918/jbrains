---
title: "Why Refactoring Is Not Always a Code Smell"
date: 2022-06-08 12:49 -0300
tags:
    - Simple Design
    - Refactoring
summary: >
    Refactoring means rework, which means that we didn't "get the
    design right the first time". This can indicate a problem. It
    can also indicate a natural process of convergence towards a
    suitable design. Calling it "a code smell" seems to overstate
    the matter.
---

Someone is circulating a talk&mdash;a _concise_ one, which I appreciate&mdash;entitled
"Refactoring is a code-smell" (sic). Before I continue, let me make a few things clear:

- I do not wish to shame nor criticize the speaker. Their talk triggered this article,
  but...
- I have not seen the talk; I've only been given one viewer's impression it and...
- I am not trying to rebut/refute this talk, but rather I want to say a few things about
  the claim as I understand it.

Please take a moment before you comment in anger. I want to read your comments, but not your fury.

# Before We Begin

When I read "Refactoring is a code smell", I imagine at least three ways to understand this statement.

- Refactoring is never a good idea. ("Refactoring is _always_ a code smell")
- Refactoring is a risk and therefore not a universal good. (Code smells, after all, are risks.)
- If we're refactoring, then we're not satisfied with the design.

I don't know which of these the speaker intends.

# Refactoring -> Not Satisfied

I am never entirely satisfied with any of my designs, at least not the ones that emerge in industrial-strength situations under the stress of delivering to (helpfully) impatient customers. **This is intentional.** If I were entirely satisfied with every aspect of the design of a system, then likely one of the following would be true:

- The system is so small that the design doesn't much matter.
- I have over-invested in designing the system.
- I have been working on the system for so long and it's so valuable that I could safely over-invest in designing the system without significant risk to profit on the project.

How else might it happen? Nothing comes immediately to mind. Please feel invited to share your story.

When I guide designs to evolve, I try to invest as little as possible in reducing volatility in the marginal cost of features. In other words, I try to design just well enough to avoid nasty surprises in the cost of adding the next feature. Refactoring helps me do this, because I can defer design choices until I feel very confident that a feature would benefit from them. (Of course, some design choices require so little extra effort that _a little_ premature design optimization won't hurt much. It's like buying very cheap lottery tickets that win more often.) By adopting a strategy of refactoring, I can confidently design in a way that doesn't rely on accurately predicting the sequence of future features. This gives my customers more flexibility to choose features while incurring a less-surprising (and often quite low) extra cost.

**Now is a great time to say this**: If you know the next 20 features with near-certainty, then you can safely "design ahead". Go for it! Big risk, big reward. Go with your gut. I'm not going to tell you not to do it, although I would probably ask you many questions about how you arrived at that near-certainty. If you could convince me that you weren't dreaming, I'd go with you.

Since I'm never quite satisfied with the design, I refactor continuously. This allows me to pretend that I always made "just the right design decisions" at every step of the process.

When I say "refactoring continuously", I don't mean intentionally making the same design "mistakes" over and over, then refactoring towards a more-sensible design. Instead, I mean "continuously challenging my assumptions about whether I need these extra elements of the design and erring on the side of deferring decisions". Some people who first learn about refactoring react like this: "Why should I ignore all my accumulated wisdom? Sometimes the right design is obvious!" Yes. If you know that MVC will fit this feature, then I see no need to force yourself to "go the long way" and guide MVC to emerge for the 718th time in your career. In that case, I'll usually start with an MVC design and use Client-First Design with Test Doubles to build that part of the system... as long as I feel perfectly comfortable refactoring _away_ from MVC when I sense that it's more trouble than it's worth.

And that's the key: when I refactor, I'm allowing myself to be wrong about my design choices without disastrous consequences. And when I'm allowed to be wrong, I don't need to agonize up front about making the right choice. I can make confident progress sooner, secure in the knowledge that the design rarely falls off a cliff. From time to time, I sigh at some of the refactorings I need to perform, but I start absolutely crying when I realize that I've made a fundamental design mistake **and** I've duplicated it all over the place. Some refactoring along the way would have limited the damage.

That's what refactoring is for: to limit the damage of making a design decision with imperfect information; to limit the damage of making even a design _mistake_; to allow us to break free of paralyzing doubt due to uncertainty about which features are coming next.

That really doesn't sound like a code smell to me.

Unfortunately, it also means that I'm never satisfied with the design: there are always ways to improve the design and I never polish it to perfection because I have more-urgent things to do.

**Now is a good time to point out** that "there are always ways to improve the design" seems to say something very similar to "there are code smells". From here, it might not be so difficult to conclude "refactoring is a sign that there are code smells". And from there, it is not so hard to imagine shortening this to "refactoring is a code smell". I think the last step loses quite a lot in the translation, but I could see myself making that mistake and not noticing it.

# Refactoring Itself Carries Risk

Indeed so. Refactoring means changing code and that is inherently risky, so we'd better have at least two things:

- A clear understanding of and agreement about the reasons to refactor this code right here right now.
- Good refactoring skill, meaning that we can refactor swiftly, safely, and accurately.

It would be safer to get the design right the first time. Unfortunately, **I don't know how to do that**&mdash;at least not always. Certainly, there are some situations where simply installing a design pattern works better.

<section class="highlight">

I wrote some parsing software in 2022 and I wanted to guide my design to evolve in the direction of Parser Combinators, because I had watched some videos about them and thought they would fit the design well. I chose to experiment with refactoring towards Parser Combinators, but I made an elementary mistake about the universal type signature of the `parse()` function. (I had the `Either` in the wrong place.) Correcting this required delicate surgery that felt stressful and took too long. If I had done this for a paying customer, I'd have regretted the choice and felt like I'd wasted some of their money. It would have been better to start with the Parser Combinator pattern up front.

Fortunately, this was a volunteer project and I chose to use it as an opportunity to experiment and learn. On that basis, I don't regret my decision, in part because I saw how to refactor towards the Parser Combinator pattern and because I sharpened my skills at removing duplication, which will probably help me in the future.

Now I know with confidence how to design parsers in a way to make them freely composable. I _understand_ it. This happened, in part, because I let myself get it subtly wrong. Exercising good judgment comes from experience, which emerges from exercising bad judgment.

</section>

If we absolutely can get the design right the first time, then I don't mind taking a bigger step, jumping to the conclusion, and engaging in some slightly bigger design up front... **as long as I feel comfortable changing my decisions in light of new information**. This is where I see programmers often become stuck. They make a plan, it seems right, it's maybe 80% right, but then when that other 20% becomes a problem, they stubbornly refuse to change their plan. Call it Sunk Cost Fallacy, call it whatever you want. **Refactoring skill means developing confidence in changing the design and acceptance that changing the design is inevitable.** There are other ways to develop that confidence and attitude, but refactoring is one way to do it.

**Now is a good time to point out** the difference between refactoring as a way of safely changing design decisions and always "taking the long way". I don't want programmers to insist on letting every element of the design evolve from first principles, simply because "otherwise it's not evolutionary design". **I encourage programmers to learn this way, but not to practise forever this way**. Most programmers benefit from a period of unlearning bad habits and becoming aware of unstated assumptions they make about the design. In the process, they start by challenging their intuition, even denying it at times, volunteering to "take the long way". But not forever! As your habits and perspective change, I encourage you to experiment with a little more design up front, bigger steps, and jumping to conclusions. You don't have to reprove every theorem you use in mathematics from first principles and you don't have to guide every element of the design to evolve from scratch.

It's a good idea to know how to do that. It's even a good idea to make that your default way of working when under extreme stress. But **refactoring is not a purity discipline**. You get points[^points] for delivering features sooner and more predictably, not for making the design as lean as theoretically possible.

[^points]: In the context of professional software development, we call those points "currency units". Your local country or territory has a special name for them. I'm happy with dollars (the Northern ones) and euro.

And maybe that's a way that refactoring could become seen as a code smell: it's a sign that we're constantly taking the long way even thought we know a shortcut and have taken the shortcut successfully many times before. Why refuse the shortcut if it's safe?! Take it! I would probably call this something other than a "code smell", but since it's related to code, I can imagine someone describing it as a "code smell" in the semse of "smell related to code". The code smell, in this case, would be the need to improve the design of code that we already knew how to design well.

# "Refactoring Bad!"

This one's easy, because it's trivially wrong. Refactoring is absolutely positively not a universally bad thing. At a minimum, refactoring provides a mechanism for learning and deeply internalizing the principles of "good" software design much in the same way that one can learn to speak a language. It's a form of the "Natural Method": starting with trial and error and gradually accumulating patterns that help speed up the process. Learning "good" software design using the Natural Method isn't universally good, but it's also clearly not universally bad. It might not be optimal, but it's widely successful.

**Now is a good idea to point out** that I might be falling prey to Survivorship Bias, Cargo Cult thinking, and plenty of Retrospective Rationalization. I agree. I guess we'll never know. That also means that I'd better not present refactoring as a guaranteed path to success. And so I don't. I commit to not presenting refactoring as a universal good and I hope you commit to not presenting refactoring as a universal evil.

Deal?

# So...?

So... is refactoring a code smell? No, but also yes. I can understand why someone would label refactoring a code smell, but I worry that that label reflects an overly-broad meaning of "code smell" or an overly-narrow meaning of "refactoring" or reflects common failure modes and attributes those failures to the technique instead of to the programmer's stage of learning/competence. To say that refactoring **is** a code smell seems more imprecise than wrong, but damaging due to its seeming certainty.

Let me put on my giraffe ears[^giraffe-ears] for a moment. Refactoring is a code smell in the sense that:

[^giraffe-ears]: Search the web for "giraffe ears nvc". Here, "nvc" refers to "nonviolent communication".

- the need to refactor means that the code has smells in it;
- refactoring carries risk, because we change the code more often than we would otherwise need to; 
- some programmers never seem to progress past the Advanced Beginner stage of refactoring

I offer the following replies:

- When _doesn't_ the code have smells in it?
- If we refactor frequently, don't we ever learn to change the code more safely?
- I've seen the same phenomenon, whose causes often lie in the working environment, and in particular in the programmer's shyness about struggling, making mistakes, and asking for help.

Refactoring isn't a code smell and it isn't magic. I've used it as a learning mechanism, as a source of freedom in making design decisions, and ultimately as a way to reduce volatility in the marginal cost of features. And I believe you can, too.

And if you can get those things another way, you should do _that_ instead. No problem at all; I get paid the same.



---
title: "TDD: For Those Who Don't Know How to Design Software"
date: 2024-01-08
tags:
  - Simple Design
  - Refactoring
  - Evolutionary Design
  - Programming Without Blame
summary: >
  TDD is for those who don't know how to design software,
  which doesn't have to mean that we're all dopes who are
  doomed to perpetual failure. Let's explore
  this idea through the lens of an experienced practitioner
  suddenly confronted with some sharp words from a luminary
  in our field.
---
I've been reading [Kent Beck's writing on Substack](https://substack.com/@kentbeck) and on the occasion of the death of [Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth), he shared part of a conversation he'd had with the professor when Kent had arranged to sit next to him on the flight home from a conference they'd both spoken at.

> Extreme Programming was just starting to crackle & pop, so I’m sure I was a bit over-enthusiastic. After I had given an impassioned  explanation of incremental design & refactoring, he paused, looked  at me with those eyes, and, “I suppose that’s all very well if you don’t know how to design software.” Mic. Drop.

Two thoughts immediately came to mind:

- He's not wrong.
- I wish he hadn't framed that with such blaming language!

Since I became acutely aware of my own tendency to blame others, I started seeing it everywhere. As part of changing my own habits, I've spent much energy both analyzing and reframing comments like these with the goal of making them "more helpful" in some way to the people who might read them. I would not like someone reading or hearing the professor's comment to become discouraged or to see TDD as something merely for software designers who don't know what they're doing.[^lest-you-think]

[^lest-you-think]: I'm not merely manufacturing drama here. I routinely help programmers work through feelings of inadequacy and self-doubt as part of managing their careers. [After several years of doing this](https://experience.jbrains.ca), I'm forced to conclude that a significant segment of the population takes comments like these to heart, they feel hurt, and they need support.

Even so, once I let my immediate feelings about these words settle, I noticed a more hopeful reframing of the professor's words, without the need even to change them. Indeed, **TDD can help people who don't (yet) know (everything they need to know about) how to design software**. I think this is true of Evolutionary Design more generally, whether we guide our incremental design with tests or some other way.

And while it would be generally easy to interpret this as a professor looking down their nose at "lowly students", I can interpret it as **a sensible strategy** for those of us, the "mere mortals", who don't always and immediately see the right design before we sit down to write code.[^strawman-alert] Or the ones who are forced to write "better"-designed code alongside "worse"-designed code that is nevertheless too profitable to throw away. Or the ones who happen at the moment to be struggling with a complicated or difficult problem and need to spend their precious brain energy on _that_---the ones who don't have as much energy left over to conceive of an obviously sensible design for the code that solves the problem. I'd say there are several reasons why one might choose to practise Evolutionary Design---even TDD---**that reflect a (temporary) need to compensate for not knowing (exactly) how to design (this particular piece of) software (just yet)**, rather than some permanent(-seeming) lack of ability to design software.

[^strawman-alert]: I'll bet that at least one of you reading this is screaming "Strawman! Strawman!" I understand. No, I don't think this is exactly what Professor Wirth meant by his comment. I don't have the context; I didn't know the man's habits; I'm not trying to guess what he meant. I'm concerned with how innocent bystanders reading this comment are likely to think of it. I've seen enough people internalize remarks like these in a way that creates lasting damage. That's what gives me the idea to write these words today.

Moreover, for the ones of you who look at architects or senior programmers and marvel at how quickly they produce solutions, who then feel inadequate or incapable of doing what they do---think again! You might be able to [use Evolutionary Design in general and TDD in particular to build](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer) the very skills that you worry you don't have or can't develop.[^growth-mindset] I made TDD a centerpiece of how I developed my skill to design software and I feel fairly confident that you can, too!

[^growth-mindset]: If you like the "growth mindset"/"fixed mindset" framing, then you can think of Evolutionary Design as a way to work that reflects a growth mindset by developing both knowledge and facility in software design, rather than assuming that you "should have known all this by now".

These thoughts change the way I interact with Professor Wirth's comment.

Indeed, there are times when I sit down to write code and I know enough about what I'm trying to do and I'm working in an environment that I know well enough and I'm interfacing with technology that I know well enough and a beautifully modular design arises in my mind without much effort. I like that feeling. And when that happens, I don't waste my time writing the code test first. Indeed, I might not write many tests at all! Or, if I'm feeling a bit uncertain, I'll practise test-first programming, where I write the tests first, but only as a way to detect mistakes early while I type into the computer the design that's already fully-formed in my head. And when I do these things, I feel productive and fast and even _powerful_.

I got there, I'm quite sure, at least in part by **redesigning software _a lot_**. Most of that came in the form of refactoring: improving the design of existing code. (And sometimes not improving, but changing design to understand better why it's not getting any better.) And **that refactoring became much safer** because I was building a habit of writing tests that helped me notice mistakes sooner. And **building that habit was made easier** by volunteering to write those tests first, when it became significantly more likely for me to remember to write them. Could I have got there another way? Maybe, but it's enough for me to say that this path got me there, and I'd be shocked if I were unique in that way.

In addition, I don't feel particularly inferior on the days where it's not so clear and I stumble around and find myself refactoring relentlessly to reach an unexpected design that I feel satisfied with. On the contrary, **I feel supported** by a practice that helps me get to "a good place", even when I can't see the finish line in my mind at the start, when the Insight Fairies don't visit, when I am confronted with strange technology or a thorny problem or gnarly legacy code. **When I'm not sure what to do** the moment I sit down---which is what happens most of the time---then I'm happy to know that it's enough to stick with the three safe moves:

- write a failing test
- remove some duplication
- improve a name

Does this mean that I don't know how to design software? Would Professor Wirth look down his nose at me? I'll never know. And either way, I don't mind.

This is how I produce better results than I would otherwise produce. This is how I get more out of my knowledge. This is how I continue to develop valuable experience. And I think that works quite well for me.

It makes me wonder how Professor Wirth got there, but it doesn't fill me with self-doubt about how I got here.

And it might help you, too.

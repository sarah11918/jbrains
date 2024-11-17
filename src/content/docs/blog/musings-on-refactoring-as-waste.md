---
title: "Musings on Refactoring as Waste"
date: 2014-04-22
tags: []
---
Recently Bob Marshall opined that [refactoring code is waste](https://link.jbrains.ca/1i63dIG). This reminds me of passionate discussions from a decade ago about testing: should we classify testing as a value-added activity or as an unavoidable waste? I'd like to change the question a little, but first, allow me to play the ball where it lies.

If you haven't read Bob's article yet, then do so now. You'll find it quite short; I read it in a few minutes. *I composed this as a comment to Bob's article, but it expanded to the point where I chose to promote it to a short article. You might say that I refactored my writing. With that segue manufactured...*

Is editing waste for a writer? Why don't writers simply write the right words/articles/books/sentences the first time? So I think it goes for programmers. I think of refactoring as editing for programmers. Since I plan to refactor, I don't have to program like Mozart and "get it right" in my head before writing it down. This helps me, because often I don't see trouble with code until I've written it down, even though sometimes drawing its structure helps me enough to spot trouble.

*Sometimes problems don't emerge until long after I've written it down and the situation changes, putting pressure on an old choice or negating an old assumption. Absolutely/permanently right-first-time seems to require clairvoyance. Writing any code entails risk.*

Even so, I agree that we programmers don't need to deny our own experience just to fit some arbitrary goal of taking tiny steps and refactoring towards abstractions. (This has got me in trouble with some people who declare what I do "not TDD". As they wish.) Sometimes I can see the abstractions, so I go there sooner. Sometimes that doesn't work out, so I refactor towards different abstractions. Often it works out and I've skipped a handful of tedious intermediary steps. One could measure my "expertise" in design by measuring the additional profit I can squeeze out of these trade-offs compared to others. (No, I don't know how to measure that directly.) I think we broadly call that "judgment".

## A Question of Intent

I find refactoring wasteful when I do it out of habit, rather than with a purpose. Nevertheless, I don't know how to have developed the judgment to know the difference without making a habit of refactoring. (Of course, I like to think that I do everything always with a purpose.) I encourage novices (in the [Dreyfus Model](https://bit.ly/dreyfus-novice) sense) to force code into existence primarily through refactoring with the purpose of developing that judgment and calling into question their assumptions about design. That reasoning sounds circular, but I have [written and said elsewhere](/permalink/the-eternal-struggle-between-business-and-programmers) how refactoring helps programmers smooth out the cost of maintaining a system over time. I can only assert that I produce more maintainable software this way, compared to what I used to do, and that refactoring plays a role. I really wish I knew how much of that improvement to attribute to refactoring. Refactoring still saves my ass from time to time, so it must pull some of its own weight.

I would classify refactoring as waste in the same way that I'd classify verification-style testing as waste: since we don't work perfectly, we need feedback on the fitness of our work. Not only that, but I refactor to support not having to future-proof my designs, because of the waste of building structures now that we don't intend to exploit until later. Which waste costs more? I find that open question quite interesting.

## References

Bob Marshall, ["Code Refactoring"](https://link.jbrains.ca/1i63dIG). In his article, Bob surmises that programmers can't quite "get it right" in their heads, and highlights refactoring as potentially a self-fulfilling waste: if we assume that we have to live with it, then we will choose to live with it. I leave the parallel with [\#NoEstimates](https://link.jbrains.ca/1i66gRd) as an exercise for the reader.

Gemma Cameron, ["Is Refactoring Waste?"](https://link.jbrains.ca/1i66mIg). I noticed Gemma's article on Twitter and it led me to read Bob's. She mentions that she plans to experiment with a TDD microtechnique that I use often: noticing while 'on red' that a little refactoring would make it easier to pass the test, and so ignoring (or deleting) the test to get back to 'green' in order to refactor safely. I don't always do this, but I consider it part of the discipline of TDD and teach it in my training courses.

["The Dreyfus Model of Skill Acquisition"](https://bit.ly/dreyfus-novice). Wikipedia's introduction to the topic. All models are wrong; some models are useful. I find this one helpful in explaining to people the various microtechniques that I teach, when I follow them and when I don't.

J. B. Rainsberger, ["The Eternal Struggle Between Business and Programmers"](/permalink/the-eternal-struggle-between-business-and-programmers). The article in which I make the case for refactoring as a key element in reducing the cost of adding features to a system over time.

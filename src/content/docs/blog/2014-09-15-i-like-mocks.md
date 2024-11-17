---
title: "\"I Like Mocks, But I Distrust Spies\""
date: 2014-09-15
tags: 
---
Some time ago a client asked me some questions about spies and mocks. I wanted to share what we discussed with you.

> So here's the issue my mind has been toiling over...
>
> The project I'm on is using Jasmine for BDD. Technically though, I think most people aren't actually executing real TDD/BDD. As in, they're not letting the tests guide their design, but instead are sticking on unit tests at the end, after writing most of the code... this is what their tests suggest, at least.
>
> I see, in their tests, a lot of spies and mocks. This tends to worry me,... especially the spies.
>
> I see a lot of it as unnecessary, and even damaging. They appear to be reducing the module that they're testing to nothing more than a series of spies and mocks. The thing they're testing seems to bear little resemblance to the real run-time module. 
>
> From my perspective, mocking is very good and even essential in the cases of module dependencies that:
> 
> 1. Would add too many extraneous variables to the testing environment
> 2. Add lag to the tests
> 3. Are not semantically tied to the thing we're testing
> 
> Examples I like are database mocks, ajax mocks etc. 
> 
> But spies.... I'm very unsure of the value of spies. 
> 
> The tests I'm reading are creating a series of spies... in fact, every method of the module is spied.. even private methods. The tests will call some public method (fir example `initiatePriceFeed()`), and then assert success by ensuring that certain *spied* methods have been called. This just seems to be testing the implementation... not the actual exposed behavior, which is what I thought BDD/TDD was all about.
> 
> So finally, I have a few questions:
> 
> * What is the best way to decide whether a spy is necessary?
> * Is it ever acceptable to test the implementation, instead of exposed behavior? (for example spying on private methods)
> * How do you decide what to mock and what not to?
> 
> I am sorry for the length of this email. There seem to be so many things I'd like to say and ask about TDD.

*Note! In the Javascript world, it's common to talk about "spies" rather than "stubs". A spy and a stub do the same thing. They only differ in intent. In what follows, you can treat "spy" and "stub" as synonyms with, I think, no risk of confusion.*

That sounds common. I started doing test-first programming, rather than test-driven development. I probably spent two years focusing on tests as tests before I felt comfortable letting my tests guide my design.

I think the people writing all these spies and mocks do this because it "seems right". People they respect do it. They need to spend some time practising the technique, so they do it at every opportunity. This corresponds to the Novice/Advanced Beginner stages of the [Dreyfus Model](https://bit.ly/dreyfus-novice): either they just want to practise the technique (Novice), or they feel comfortable using spies/expectations[^expectation-equals-mock], and treat every opportunity as an equally (Advanced Beginner) appropriate time to use them. Good news: this is a natural part of learning.

[^expectation-equals-mock]: In order to avoid confusion with the generic concepts of "mock objects" (better called "test doubles"), I use the term *expectations* to refer to what many people consider a *mock*: function `foo()` should be called with arguments `1, 2, 3`.

Where to go next? Find one example where a module would benefit from depending on data, rather than another module. I go back to the difference between Virtual Clock (spy on the clock so that you can make it return hardcoded times) and Instantaneous Request (pass timestamps directly, rather than the clock, pushing the clock up one level in the call stack). Perhaps this will help people start to question where they could change their approach.

**IMPORTANT!** Instantaneous Request isn't necessarily always better than Virtual Clock. Which you choose is less important than the discussions and thoughts that lead you to the choice. Also: starting to use Instantaneous Request over Virtual Clock means that the programmer is evolving, not the code. What matters is not "use fewer spies", but rather "don't let spies become a Golden Hammer". Spies still help, I use them frequently, and I wouldn't give them up.

*I wrote about this approach in some detail in ["Beyond Mock Objects"]({% link _posts/2013-11-23-beyond-mock-objects.md %}).*

Regarding the value of spies, I don't consider spies and expectations much different from one another. A spy is merely an expectation that doesn't verify which methods were called&mdash;instead it waits for you to do that. In some tests, it's not important to verify what happened, but rather to provide a hardcoded answer for any method our Subject uses. One rule of thumb: **spies for queries, but expectations for actions**. This works because we tend to want more flexibility in our queries, but more precision in the actions we invoke. Think of the difference between `findAllOverdueBalances()` and `findAllBalances().selectBy("overdue")`&mdash;it doesn't matter how I find all the overdue balances. Spies simply make it easier to hardcode 0, 1, a few, or a large number of overdue balances, as each test needs.

So: spies for queries, but expectations for actions.

## Spy, then Spy, then Spy...

I understand your concern about series of spies, but let me check that I understand what you mean. When you say a *series* of spies, do you mean spying on `A.getB()` to return a spy `B`, whose `B.getC()` returns a spy `C` so that you can spy on `C.theMethodIFindReallyInteresting()`?

As for ensuring that spied methods have been called, those "spies" become expectations, and it can feel like those tests only check the implementation. That's OK. If the implementation is so simple that we can check it with a simple test, then that's good! It's like double-entry book-keeping in accounting. If the tests are complicated *and* only check implementation, then that usually points to a missing abstraction, or at least, obsession with unnecessary details (could be a missing abstraction or could just be an unnecessarily complicated API). This last point is an example of not listening to what the tests are trying to tell you.

Programmers generally have this feeling *eventually* that expectations mean "I'm just checking the implementation". I had the same feeling once, so I asked myself, "assuming that this actually makes sense, what am I missing?" Well, if the interactions between objects were simpler, then this "checking the implementation" issue wouldn't cause any real problems, would it? In fact, it would only clarify what we're trying to do. Maybe, then, when checking the implementation feels weird, we could ask about potential underlying design problems, and if those problems disappeared, then we'd feel less weird. This is one of those cases.

Go to a few tests where you feel weird in this particular way, and look for duplication between the examples. You might be surprised!

## When Is A Spy "Necessary"?

You ask about "the best way" to decide whether a spy is necessary (maybe appropriate). I don't know of One Best Way. I use them, then let duplication drive changes. I especially look for [duplicating unnecessary details in the test]({% link _posts/2010-01-14-what-your-tests-dont-need-to-know-will-hurt-you.md %}). If I have to duplicate details in a handful of tests, just to be able to check some other part of the system, then perhaps I have two things in one place, and when I separate them, the corresponding spies become much simpler, and sometimes I can replace a spy with data (from Virtual Clock to Instantaneous Request).

## Is It Ever Acceptable...?

You also ask whether it is ever acceptable to test the implementation instead of the behavior. "Is it ever acceptable…?" questions almost always have the answer "yes", because we can always find a situation in which somewhat becomes acceptable. On the other hand, I don't typically spy on private methods. If I need to know that level of detail in a test, then the test is trying to tell me that `A` cares too much about the internals of `B`. First, I try to remove unnecessary details from `A`'s tests. Next, I look for duplication in `A`'s tests. Especially if I spy on the same functions in the same sequence, that duplication points to a missing abstraction `C`.
 
## So When to Mock?

I have two answers to this question. First, when do I use spies/expectations compared to simply using "the real thing"? I like to program to interfaces (or protocols, dependingon the language) and I like to clarify the contracts of those interfaces, something that expectations help me do effectively. To learn more about this, read the articles I list at the end related to contract tests. Especially read ["When Is It Safe to Introduce Test Doubles?"]({% link _posts/2010-09-14-when-is-it-safe-to-introduce-test-doubles.md %}).

Finally, when I'm not sure whether to use a spy or an expectation, I go back to the rule of thumb: **spy on queries, but expect (mock) actions.**

## References

Wikipedia, ["Dreyfus model of skill acquisition"](https://bit.ly/dreyfus-novice). Not everyone likes this model of how people develop skills. I find it useful and refer to it frequently in my work.

c2.com, ["Virtual Clock"](https://c2.com/cgi/wiki?VirtualClock). An overview of the Virtual Clock testing pattern, with further links.

J. B. Rainsberger, ["Beyond Mock Objects"]({% link _posts/2013-11-23-beyond-mock-objects.md %}). I use test doubles (mock objects) extensively in my designs and they help me clarify the contracts between components. Even so, using test doubles mindlessly can interfere with seeing further simplifications in our design.

I apologise *again* for not having collected my thoughts about collaboration and contract tests into a single work. I need to find the time and energy (simultaneously) to do that. In the meantime, I have a few articles on the topic:

* ["Contract Tests: An Example"]({% link _posts/2011-07-07-contract-tests-an-example.md %})
* ["In Brief: Contract Tests"]({% link _posts/2005-03-02-in-brief-contract-tests.md %})
* ["Who Tests the Contract Tests?"]({% link _posts/2018-07-09-who-tests-the-contract-tests.md %})
* ["Writing Contract Tests Differently"]({% link _posts/2011-07-17-writing-contract-tests-in-java-differently.md %})

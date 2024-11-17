---
title: "Which Kinds of Tests Should I Write? Revisited"
date: 2023-09-17
tags:
  - Programming Without Blame
summary: >
  "TDD or BDD?" or "Functional Tests or Unit Tests?"
  Write any tests! The more clearly you understand the
  purpose of those tests, the more these apparent
  dilemmas will fade into the background.
---

I see so many programmers tying themselves up in knots, trying to find "the right" testing strategy. I'd like to offer them a simple idea intended to make at least one of these knots loosen itself and disappear.

This issue shows up in a few forms:

- Which is better: TDD or BDD?
- Which should I write: functional tests or unit tests?
- The testing pyramid is wrong and I have invented a new shape for tests that will solve all your problems!
- "Beware the Integrated Tests Scam!" (wait... that one is my fault)

# A True, But Useless Answer

Write whatever tests make you happy. Test until fear is transformed into boredom. Do what seems to help until it doesn't seem to help any more, then stop. It'll be fine.

I genuinely believe in this answer, but it doesn't really help a confused programmer (or technical leader) feel comfortable about what they're doing, now, does it?

# An Insufficient, But More-Useful Answer

Among these apparent dilemmas and conundrums, we find the people who claim that they'd rather write Customer Tests than Programmer Tests. After all, they want to please their Customer[^customer], so it makes sense to focus on Customer Tests. These seem much more important than Programmer Tests.

[^customer]: I use Customer in the XP sense of the term. I also use it in the singular, even though very often, we have more than one Customer. If you prefer to think of the term as plural in your mind, that works fine and doesn't change my points here.

Oh... you don't use these terms? No problem. You might know Customer Tests as something like "functional tests" or "end-to-end tests" or "Cucumber tests" or "Selenium tests" or "Capybara tests" or whatever the cool kids use these days. Similarly, you might know Programmer Tests by names such as "unit tests" or "microtests". These terms don't correspond perfectly, but when we compare what I mean by "Customer Tests" to what they usually mean by "functional tests", these things turn out in practice almost always to be very close to equivalent. Something similar happens for "Programmer Tests" and "unit tests". I'll call them by my preferred names, because I specifically mean to classify tests by their purpose and not by their scope nor their tools.

**I see no dilemma here**, except perhaps the notion that they pay us to deliver features and not write tests, therefore we can't write all the tests we want, and so we must choose carefully. (Even that's not quite right, but it's close enough for now.)

Customer Tests help me assure the Customer that we have understood what they've asked for and that we will deliver what they consider "valuable" for their particular meaning of "value".

Programmer Tests help me assure myself and my fellow programmers that the code does what we thought we asked it to do.

When we try to use the same set of tests for both purposes, all kinds of dysfunctions follow. Notably, senior technical staff get into heated debates about which kinds of tests to write. (That's how we got here.)

**Therefore, let us choose the kind of test that corresponds to our current needs**.

I lean on Customer Tests when I want more confidence that we're tackling the problems that our Customer wants us to tackle. I lean on Programmer Tests when I want to understand just what the hell is going on with this code.

That's it.


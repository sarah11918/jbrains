---
title: JMock v. Mockito, but not to the death
tags: []
---
<p class="update" markdown="1">Although I originally wrote this to describe how/when I use JMock compared to Mockito, you can easily read this as an article comparing the use of mocks (expectations) to the use of spies. JMock operates by default in "expectation" mode, while Mockito operates by default in "spy" mode. In short: expectations and spies have exactly the same expressive power and so I use both in different contexts.</p>

I grew up using EasyMock, but near the end of the first draft of JUnit Recipes, I wrote this:

<blockquote>"In the time between writing this essay and sending the book to be printed, a new dynamic proxy-based mock objects package has appeared on the scene, called jMock (www.jmock.org). It picks up where EasyMock left off, as the EasyMock project went through a temporary lull in activity, between October 2003 and May 2004. Being so new, we do not have any experience using it, and so we cannot say much about it, but it does look promising and bears a look. If you have used EasyMock, then it is worth experimenting with jMock to see the difference. You may find you prefer jMock's approach to that of EasyMock."</blockquote>

Since 2004 I have used JMock almost exclusively to drive my designs in Java. I even like the strange-looking JMock 2 syntax which, I know, puts me in the minority. In the last two years, other test double libraries have gained mindshare, among which Mockito has become quite prominent. While I can't give you a feature-by-feature comparison, I can tell you this:

When I want to rescue legacy code, I reach for Mockito. When I want to design for new features, I reach for JMock.

Different central assumptions of JMock and Mockito make each one better at its respective task. By default, JMock assumes that a test double (a "mock") expects clients not to invoke anything at any time. If you want to relax that assumption, then you have to add a stub. On the other hand, Mockito assumes that a test double (sadly, also a "mock") allows clients to invoke anything at any time. If you want to strengthen that assumption, then you have to verify a method invocation. This makes all the difference.

When I work with legacy code, I mostly write learning tests to discover how different parts of that legacy code behaves. Usually legacy code has obscene and overwhelming levels of interdependency, and Mockito helps me manage that, by allowing me to worry about one crazy dependency at a time.

When I design for new features, I mostly write design tests that describe the new behavior I want to implement. With the nice green field of a new interface, I need JMock to encourage me to clarify the interaction I need. Whenever my production code attempts to use a collaborator, JMock effectively reminds me to ensure that I want that interaction. Most importantly, JMock stops me from introducing dependencies that I don't need.

I really like Fred Brooks' use of the terms _essential complexity_ and _accidental complexity_. Briefly, a code base's _essential_ complexity reflects the complexity of the problem. Automating tax audits will result in high essential complexity. A code base's _accidental complexity_ reflects the complexity we programmers add because we don't design simply. In short, if it isn't essential complexity, then it's accidental complexity. Our job as designers includes minimising accidental complexity.

Mockito helps me tolerate high accidental complexity while I work to reduce it.

JMock tries its best to stop me from introducing accidental complexity.

That explains why I use JMock when designing for new features and why I'll recommend using Mockito for rescuing legacy code.

---
title: "Stub your data access layer; it won't hurt"
date: 2010-09-23
tags: []
---
I came across this question on the <code>testdrivendevelopment</code> Yahoo! group.

> Hi everyone,
> 
> I&#8217;d like some advice/opinions on how to test some existing code. It&#8217;s a web application using Spring and struts.
> 
> I have a class called the ProcessedFilesManager which contains a number of methods used by Struts Action classes. This manager communicates with five different DAOs to get the information that some of the Struts actions are interested in. Now, I want to test this manager class (ProcessedFilesManager). The way I&#8217;ve started doing it is stubbing up each of the five DAOs, however, this is proving to be quite painful. I didn&#8217;t want to use a mocking approach, nor did I want to use a DB solution like Hypersonic, but now I&#8217;m open to suggestions.
> 
> Seeing as there a number of approaches I could use, what do you think would be best for this situation?
> 
> It feels wrong to stub the DAOs because what if I&#8217;m introducing behaviour in there that differs from the actual DAOs? My tests will not be accurate.
> 
> Any advice/comments would be much appreciated.
> 
> <a href="https://groups.yahoo.com/neo/groups/testdrivendevelopment/conversations/topics/27079">Read the thread</a>

I used to have this fear, and I do something now that has eliminated that fear.

When I stub a DAO method, I make an assumption about what that DAO method does. I used to be worried about making the wrong assumption, but now I have a **contract test** for the DAO interface that tests for the assumption I&#8217;m making in my Service test. The contract test gives me confidence that any implementation of the DAO method passes the same tests, so every implementation of that DAO method behaves **in ways that the clients rely on**. Once I have this, I feel comfortable stubbing that DAO method that way in a Service test.

A contract test describes the behavior of an interface. I describe contract tests in some detail in <a href="https://www.amazon.com/gp/redirect.html?ie=UTF8&amp;location=http%3A%2F%2Fwww.amazon.com%2FJUnit-Recipes-Practical-Methods-Programmer%2Fdp%2F1932394230%3Fie%3DUTF8%26s%3Dbooks%26qid%3D1199051730%26sr%3D8-1&amp;tag=masterprogram-20&amp;linkCode=ur2&amp;camp=1789&amp;creative=9325">JUnit Recipes</a>, recipe 2.6, although back then I called them &#8220;abstract test cases&#8221; because I hadn&#8217;t yet discovered the better name &#8220;contract test&#8221;. If you prefer, I&#8217;ve provided a diagram showing some contract tests for a typical DAO class.

<img src="https://images.jbrains.ca/StubYourWorriesAway/ContractTests.jpg" style="width: 100%; align: center;" alt="" />

Since classes inherit methods from their superclasses, the <code>Hibernate Customer DAO Test</code> will inherit the <em>contract tests</em> from its superclass, as will the <code>JDBC Customer DAO Test</code>. This means that each implementation has to pass not only its own tests (like <code>testClosesSession()</code> or <code>testClosesResultSet()</code>) but also the tests inherited from <code>Customer DAO Contract Test Template</code>. (I call it a &#8220;template&#8221; because it plays the role of template in the Template Method design pattern.) When you test-drive a new implementation of <code>Customer DAO</code>, simply make the new test extend the contract test template and you&#8217;ll automatically inherit its contract tests. This way, I have confidence that any implementation of <code>Customer DAO</code> behaves the way I&#8217;d expect any <code>Customer DAO</code> to behave.</p>

Returning to our example, these contract tests give me confidence to stub the DAO when I test-drive the Service, and that confidence brings with it a happy side effect. I am confident that <code>findAllWithPendingOrders()</code> only returns customers with pending orders, so I don&#8217;t have to worry about that issue at all when I design the Service that reports all customers with pending orders. Now that I notice it, <code>Report All Customers With Pending Orders Service</code> is really just a <code>Report on Customers Service</code> that needs a <code>Customer Filter</code>, which could be a <code>Pending Orders Customer Filter</code>. I don&#8217;t think I would have felt comfortable with this level of generalization if I weren&#8217;t so confident in the way I&#8217;ve separated the responsibilities.</p>

The next time you want to avoid stubbing a method because you&#8217;re worried you&#8217;ll make a wrong assumption about what the method does, try writing enough contract tests to give you the confidence you need. I think you&#8217;ll like the results.

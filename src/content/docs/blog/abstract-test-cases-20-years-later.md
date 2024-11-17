---
title: "Abstract Test Cases, 20 Years Later"
date: 2021-02-23
tags:
    - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
excerpt: >
    Revised one of my earliest contributions to the evolutionary design
    community: abstract test cases and their evolution into contract tests
---

While writing something else entirely, I stumbled upon one of my earliest contributions to the evolutionary design/TDD community. I called them _abstract test cases_ at the time, but today we know them as _contract tests_. Has much changed in the 20 years since I first wrote about this in public? [No.](https://en.wikipedia.org/wiki/Betteridge%27s_law_of_headlines)

I use _contract tests_ to **gain confidence that a module implements its declared protocol**. If you prefer OOP terms, i use contract tests to gain confidence that a _class_ implements its declared _interface_. The **Liskov Substitution Principle** guides me here: we must be able to freely replace a supplier module with another supplier that claims to act as the same _type_. I prefer, therefore, to let clients depend on types (roles, interfaces, however you like to think of them) rather than classes (implementations, details). This restates the **Dependency Inversion Principle**. 

<p class="aside">I've been claiming for years now that we can reduce SOLID to LD and lose nothing of real value. (S, O, and I follow from L and D. I leave the exercise to whoever has the energy to write that book before I get around to it.)</p>

When I write contract tests, **I define the contract** of the module under test. The suite of tests _defines_ the _contract_, which is the behavior that clients can reasonably rely on. It defines the _type_ that the module implements, even when I don't explicitly extract an interface for it, as I might in Java. The contract tests don't merely check the behavior of the module under test, but **they also document the contract of that module by example**. When you see memes joking about "2 unit tests, 0 integration tests [sic]", I replace that in my mind with "2 implementation details tests, 0 contract tests". Many programmers still make the mistake of writing only collaboration tests, but no contract tests, which results in integration errors, leading many of them to fall into the [integrated tests scam](https://integrated-tests-are-a-scam.jbrains.ca).

## Two Styles; Both Work

**When I'm writing code supplier-first** (also sometimes called "bottom-up"), I test-drive the implementation, then identify the contract, then finally extract contract tests for it. I demonstrate this technique in [The World's Best Intro to TDD: Level 1](https://tdd.training). (Search the course details for "Contract Tests".) In this situation, I'm generally focusing on integrating something with an Expensive External Resource (like an HTTP API, a database, or a file system), so I tend to become absorbed by getting the thing to work at all. Once something works, I can step back, breathe deeply, and think about the interface (and contract) that it will expose to the rest of the system. In this flow, it feels natural to me to **let the supplier stabilize before trying to extract contract tests** and start advertising a contract to potential clients.

**When I'm writing code client-first**&mdash;usually with test doubles&mdash;I use the collaboration tests to define the contract of its intended suppliers by example. As I write more collaboration tests, I refine my understanding of what this object needs from its collaborators. When I write a test, I usually say to myself, "I need a _thing_ that does X", and when I say "thing", that means "type" ("role", "interface", whatever you prefer). **The stubs and expectations that I write for this _type_ gradually form the contract of the type.** Eventually the client's behavior stabilizes enough to move on, at which point the collection of stubs and expectations constrain and define the contract that I've invented. (Not perfectly, but enough to understand.) I can translate these into contract tests and they become the first draft of the test list for building a production implementation. I demonstrate this technique as well in [The World's Best Intro to TDD: Level 1](https://tdd.training).

## A Contract Is a Negotiation

Whichever approach I take&mdash;client-first or supplier-first&mdash;I treat these new contracts as _drafts_, subject to revision. This seems obvious, but I routinely watch programmers treat existing contracts like laws and assume that they have no authority to change them. When I ask the client to try to use the supplier's _type_ in a collaboration test, **I learn about the API from the client's point of view**. When I try to implement the supplier, I learn which constraints of the implementation might create obstacles to my ideal API. At this point I often learn that I need to replace fine-grained interactions with coarser-grained ones (or the reverse). I don't even need to integrate the client with the supplier _implementation_ yet. **The combination of collaboration and contract tests gives me enough confidence that the two will work together when I integrate them.**

I tend to limit integrated tests to the roles of checking performance, demonstrating progress to a Customer, integrating with the Horrible Outside World, and **blunder checking my contracts**. Smoke tests usually suffice to find out whether my understanding of the relevant contracts is far off from reality. If the Customer wanted exhaustive integrated tests&mdash;and I don't remember the last time they cared&mdash;I'd encourage them to engage dedicated testers to do that, then I'd work with those testers to compare notes and refine the contract. They could keep the integrated tests and, as they found problems, I'd extract missing or misaligned collaboration and contract tests to augment my programmer test suite. **All integration problems come down to either a misunderstanding or disagreement about the contract of a type.**

## The Trouble With Contract Tests: Semantic Drift

Finally, we have the classic question: _How do I keep my collaboration tests and contract tests in agreement with each other?_ If we experience semantic drift between them, then we risk the situation where our microtests pass 100% and we nevertheless have a relatively obvious integration defect. (Why are you returning `null`?! You're supposed to raise an error!!) That threatens to lead us back into the arms of the [integrated tests scam](https://integrated-tests-are-a-scam.jbrains.ca). **Even after 20 years, I still don't have a better answer than to rely on the human to pay attention and check.** Various projects have tried to automate this, but I've not yet seen one publish results from an industrial-strength programming project using their system. Instead, I rely on these two rules:

- A _stub_ in a _collaboration test_ corresponds to an _expected result_ in a _contract test_.
- An _expectation_ in a _collaboration test_ corresponds to an _action_ in a  _contract test_.

The first of these rules says "If the Supplier might return `12`, then check the Client to see how it reacts to the answer `12`". The second of these rules says "If the Client might tell the Supplier to `foo()`, then check the Supplier to see what `foo()` does". When I write a collaboration test, I know which contract tests I need to write next. If I write a contract test, then I know which collaboration tests to look at in order to check for agreement. Without sophisticated static analysis tools, I don't know how to automate this. Worse, thanks to dynamic metaprogramming, it seems in principle impossible to trust these tests enough to find them of value. **I merely follow these two rules, attend to the tests, and try to be less wrong today than I was yesterday.**

## One Significant Change

I can identify one significant change to my _contract tests_ practice since we had these discussions 20 years ago: someone showed me a second way to structure contract tests, which I've adopted as a second option.

The _traditional_ approach involves **extracting an abstract superclass** for the test case class, pulling up the tests as _template methods_ while leaving behind the implementation details of the _primitive operations_. The concrete test subclass inherits the tests from the abstract test superclass. The test runner runs only the concrete test subclass. The abstract test superclass acts as an _abstract factory_ for instances of the _type_ being tested and the concrete test subclass implements that factory to provide instances of the implementation being tested in various required states. When we want to add an implementation, we use the abstract test superclass as a template for all the contract tests we need to make pass.

The _newer_ approach **favors composition over inheritance**. It involves writing a concrete class that provides the tests, but **whose fixture includes an abstract factory object that creates instances of the objects to test**, in the style of the [Object Mother pattern](https://www.martinfowler.com/bliki/ObjectMother.html). We add tests by implementing the abstract factory for our new Supplier implementation, then adding an instance of that factory to the list of factories that the tests run against, using the [Parameterized Test Case pattern](https://www.baeldung.com/parameterized-tests-junit-5). This approach works especially well using property-based testing tools _and_ has the advantage of not needing to inherit implementation. In languages like Java, we can collect all the tests for a class in one place, even if that class implements more than one type, each with its own isolated set of contract tests.

## The Classics Never Go Out Of Style

I've changed how I think about and talk about contract tests over the past 20 years, but **the concepts and goals haven't changed at all**. I still favor contract tests over integrated tests. I still think in terms of contract tests, even f I don't extract literal abstract test cases from the tests for the Supplier implementation. I still fix defects by working gradually from a failing integrated test to some number of missing or incorrect collaboration and contract tests. (The Saff Squeeze helps me here.)

Many programmers still find this overkill, even though **they'll happily copy and paste excessive setup code to 20 more integrated tests every week**. They still fool themselves into believing that they can successfully use third-party libraries and frameworks without attending to the details of the contracts of those dependencies. They continue to struggle with remembering how _that thing_ worked, because they didn't write it down in a _learning test_ nor in a _contract test_ when they originally wrote that part of the integration with the Horrible Outside World. They continue to be caught flat-footed when someone on another team publishes a breaking change, causing a defect, raising an alarm, and **violently plunging the group into yet more unplanned work**. I frequently encounter clients who fail to heed my warnings as over-engineering, but then complain about problems that these techniques address. I understand: it's not easy to see some traps until you become caught in them.

No worries. I'll sit here in the corner, writing my contract tests. In 20 years, they haven't let me down yet. I've left an empty seat for you when you'd like to join me. No judgment, I promise. When you're ready, I'm ready.


<details class="external-excerpt">
<summary>Click here to read the original "Abstract Test Cases" discussion, rescued from <a href="https://wiki.c2.com/?AbstractTestCases">Ward Cunningham's WikiWikiWeb</a></summary>
<section class="details-content">

<p class="note">This discussion took place mostly in the period 1999-2001, but with some additions as late as 2009.</p>

## J.&nbsp;B. Rainsberger

I have begun calling these "Contract Tests", because they describe the contract that all implementors or inheritors must respect. Violating those contracts violates the Liskov Substitution Principle, and we all know that's just bad.

I use Contract Tests very aggressively to support Isolation Testing (testing objects in total isolation from the implementation details of their collaborators). I tried to write a good example, but it wasn't good. I'll try again later. The expected results in the Contract Tests for interface X become the assumptions I use when testing class Y that uses interface X. This is especially useful in one general area: business logic and the database.

I generally introduce a Repository interface to hide the database. I test-drive the database-aware implementation, but pull up the general "push and pull data" tests up as Contract Tests for Repository. These Contract Tests now describe the assumptions I'm allowed to use when I introduce fake or mock Repository objects into business logic tests.

Dale Emery once wrote that when he uses only Isolation Tests he sees disagreements between what objects do and what their clients/users expect them to do. Good Contract Tests help me avoid this problem so much that I rarely use Integration Tests or end-to-end tests for myself any more. I let my Customer write them, but I generally don't care.
    
---

An Abstract Test Case is a Test Case for an Abstract Class that ensures that concrete implementations of the abstract class behave as expected.

The Abstract Test Case will have abstract methods to enable it to obtain concrete subclasses of the Abstract class under test, to obtain appropriate arguments for tests and expected results.

J.&nbsp;B. Rainsberger put it well when he said:

> This kind of test case ensures that concrete classes do not violate the contracts of their superclasses.

A suite of Abstract Test Cases are available here: <https://sourceforge.net/projects/junit-addons>

## Channing Walton

Contrived Java Example:

```java    
/**
 * A source of messages (serializable objects).
 * Implementations may be JMS queues, file systems, etc.
 */
public abstract class Source {
    /**
     * Receive a Message from the Source.
     * @param timeout length of time in ms to wait for a message
     * @return a message or null if the source timed out
     */
    public abstract Serializable receive(long timeout) ;
    }

    public abstract class AbstractSourceTestCase extends TestCase {
        /**
         * Get the Source to test
         */
        public abstract Source getSource() ;

        /**
         * Prepare and get a message expected from the Source.
         * e.g. put a message on to a JMS queue so that 
         * a JMS Source will then produce it.
         */
        public abstract Serializable prepareAndGetExpectedMessage() ;

        public void testMessageReceived() {
            Serializable expected = prepareAndGetExpectedMessage();
            Serializable received = getSource().receive(1000);
            assertEquals(expected, received);
        }

        public void testNoMessageReceived() {
            Serializable received = getSource().receive(1000);
            assertTrue(received == null);
        }
}
```

OK, so the above example is a little contrived but is based on something I have written and found very useful. My 'real' Abstract Test Case has about 9 test methods which would have been replicated for all the tests for my implementations - lots of effort saved and it has caught a number of subtle bugs.

Given that an abstract class defines the behaviour of concrete implementations, an Abstract Test Case tests that behaviour and ensures that implementations behave as expected. It also helps developers build new implementations - the new test case implementing the Abstract Test Case helps them to do it much more easily.

## Discussions

This technique is not applicable to all Abstract Classes as one expects different behaviour in concrete implementations that might make it impossible to use this technique. &mdash;Channing Walton

If you follow the Liskov Substitution Principle, then this should not be a problem. &mdash;Anonymous/uncredited

Indeed. In fact I am struggling to find a case where Abstract Test Cases wouldn't work, it would be nice to have a list of exceptions if any. &mdash;Channing Walton

This kind of test case ensures that concrete classes do not violate the contracts of their superclasses. Assuming there is no extra behavior to test, this is sufficient. If there is more to test in the concrete class, then there needs to be an additional test case for that extra behavior. &mdash;J.&nbsp;B. Rainsberger

Exactly so! That's what I wanted to say and was unable to find the words :-) When I have a class that implements two interfaces, I have had to write two or maybe three Test Cases for it, one for each of the interfaces it implements (a `TestFooAsX` and `TestFooAsY`), and another test for anything else. &mdash;Channing Walton

Real-life example: I wish IBM/Visual Age for Java had been more careful. I was working with EJBs/Access Beans and wrote a test.

```java
public void testFindOnlyOne() throws Exception {
    MyAccessBean finder = new MyAccessBean();
    Enumeration e = finder.findByUniqueIndex();	// Expect one row
    assertTrue(e.hasMoreElements());
    MyAccessBean first = (MyAccessBean) e.nextElement();
    assertTrue(!e.hasMoreElements());	// Shouldn't be any more.
    try {
	    e.nextElement();
    	fail("There's more?! You just said there wasn't!");
    }
    catch (NoSuchElementException success) {}
}
```

This test failed. Why? `com.ibm.ivj.ejb.runtime.AccessBeanEnumeration` does not respect the contract of `java.util.Enumeration`. When `hasMoreElements()` returns `false`, `nextElement()` returns `null` instead of throwing `NoSuchElementException`. In short, their "enumeration" is not an `Enumeration`, even though they implement that interface.

An abstract test case enforcing the contract of `java.util.Enumeration` would have helped here. &mdash;J.&nbsp;B. Rainsberger

Perhaps API designers should include abstract test cases too ;) &mdash;Channing Walton

I completely agree with that last comment. I recently had to implement a JSR and frequently found myself wishing that it was specified in terms of tests rather than a large document that I had to repeatedly reference and make judgement calls about what the authors intended. &mdash;James Abley

</sectionk>    
</details>


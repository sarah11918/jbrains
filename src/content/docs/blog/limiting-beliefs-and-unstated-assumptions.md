---
title: "Simulating Failure in Collaboration Tests"
date: 2020-12-17
tags:
    - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
    - Test Doubles
    - Not Just Coding
excerpt: >
    The production implementation of an interface can fail, but
    the lightweight implementation that you use for testing can't
    fail in the same way. How do you check that the client is
    handling that kind of failure? Use another kind of test double.
---

Limiting beliefs and unstated assumptions interfere with our performance. This is not a trifling matter. Here is yet another story of how that happens.

<details class="tldr">
<summary>TL;DR</summary>
<section class="details">

We often test a module by connecting it to a _lightweight implementation_ of one of its collaborators, such as in-memory persistence. This works great for simulating happy paths, but it's usually impossible to make an in-memory database fail the same ways that an SQL database would fail running on some remote server somewhere. This leads to the question of how do we make the in-memory database simulate the remote database's failures? We can't, so I guess we're out of luck.

Well, no! Just use different simulators for different tests. Maybe use an in-memory database because it's convenient for the happy paths, then use a test double library or the Crash Test Dummy pattern to check the failure paths. Why not? Unstated assumptions and limiting beliefs are why not.

Programmers struggling to learn how to avoid the [integrated tests scam](https://integrated-tests-are-a-scam.jbrains.ca) often assume that they "should" (or worse _have to_) use only one kind of test double for all their tests. **They're so worried about "doing it right" that they don't have energy left over** to think about the big picture. Or maybe they're **so focused on the details that they can't see the forest for the trees**. This is normal. That's why I don't try to learn something until I know where to find support.

Knowing where to find experienced people who can answer your questions doesn't only help you get answers to your questions, but more importantly, **it frees you to focus on the details and allow yourself to struggle**, but of which are essential for effective learning. You don't have to worry both about how to do the thing and whether you're doing "the right" thing. You can get something working, then take a breath, then ask for advice. We all need help like this from time to time, so it helps to have a safe place to ask these kinds of questions where someone with experience can answer them.

</section>
</details>

## The Story

Consider this common situation: a Controller uses a Repository to store data in a database---a good, old-fashioned relational database management system, such as MySQL.  The _production implementation_ of the Repository will use some MySQL client library to store data in the database. Since [integrated tests are a scam](https://integrated-tests-are-a-scam.jbrains.ca), you want to check the Controller without integrating it directly to the production Repository, so you connect it to a _lightweight implementation_ of the Repository, such as a in-memory lookup table of records. This in-memory Repository stores the records in a list or dictionary, making it easy to write Collaboration Tests for the Controller, such as this one:

```
describe "'All Users' report" do
  example "happy path" do
    let anyNonEmptyCollectionOfValidUsers = repeat(3, anyUniqueValidUser())
    let repository = InMemoryUserRepository(users: anyNonEmptyCollectionOfValidUsers)
    let controller = AllUsersReportController(repository: repository)

    let response = controller.handleRequest(anyValidRequest())

    response.users shouldEqual anyNonEmptyCollectionOfValidUsers
```

In words, this test says

> Assuming that the user repository has these 3 users, when the "all users report" controller executes successfully, its response should contain those 3 users.

You can imagine that some application framework will render the response and show those users in a list on a summary page. That behavior doesn't affect this test.

I'd write more tests for the Controller than this, but that's not what this article is about.

## A Contract Test For User Repositories

You can also imagine an interface `UserRepository` with a method like `findAllUsers()`, which the lightweight implementation (in-memory) and the production implementation (MySQL client) both implement. When everything behaves as expected, this Controller happily works with either implementation of `UserRepository`. The Controller doesn't care whether the `User` values came from the in-memory repository or a MySQL database. If you wanted, you could write a Contract Test  to document that any User Repository returns all its users when a client asks it for all its users.

```
describe "User Repository contracts" do
  describe "findAllUsers()" do
    example "happy path" do
      let anyNonEmptyCollectionOfValidUsers = repeat(3, anyUniqueValidUser())
      let repository = repositoryFactory.seedUserRepository(users: anyNonEmptyCollectionOfValidUsers)
      
      repository.findAllUsers() shouldEqual anyNonEmptyCollectionOfValidUsers
```

In words, this test says

> Any User Repository's "find all users" query should return all the users it currently has. 

Some of you might consider this test too simple to bother writing. In many situations, I'd agree. We might consider some aspects of an interface's contract so obvious and so simple to respect that we instead spend our precious energy checking other, more complicated parts of the contract.

## The Database Might Fail, You Know

Indeed, the database might fail. This sets up the quandary that I wanted to address in this article:

- The production implementation of `UserRepository` might raise an error when the underlying database client library detects a failure in trying to communicate with the underlying database. Maybe the database service isn't running or the network has failed.
- Since [integrated tests are still a scam](https://integrated-tests-are-a-scam.jbrains.ca), you might prefer to use Collaboration and Contract Tests to check the integration between the Controller and the Repository. You might prefer to use the in-memory lightweight implementation of the Repository, because you find it so simple and easy to use.
- Unfortunately, **an in-memory Repository can't fail in the ways that a database can**, which means that you can't see how to use it to check that the Controller gracefully handles the various failures that can occur in production.

Now what? Eleven years after I first answered a certain Stack Overflow question, I received notification of a comment in which someone asked this very question:

> What would one of the tests in your example look like for testing the behaviour when the backend server is down, and how would you set that condition up in tests? &mdash;&nbsp;[\@jrahhali](https://stackoverflow.com/questions/2096622/testing-a-interface-repository/2099727?noredirect=1#comment115400110_2099727)

## Uncovering An Unstated Assumption

Have you ever had the experience of feeling utterly surprised by a question? I mean that someone asks you a question that causes you to scream an "obvious" answer inside your head. The answer seems so obvious in fact that you wonder why someone would ever ask the question in the first place. Whenever I feel this way, I try to remember to look for an _unstated assumption_ in the question. The answer seems obvious _to me right now_ because I haven't assumed something that the questioner has assumed. If I find that unstated assumption, then all becomes clear.

Sometimes I can guess the assumption hiding inside the question; sometimes I can't. I could guess and try to answer _that_ question, but often that merely annoys the questioner. I try to remember instead merely to ask. **The questioner's actual assumption matters more to them than the twelve assumptions I can invent in my own mind**.

I asked. I got this response:

> Say `AdoBasedRepositoryUser.GetById()` throws a `FooException` when the "backend server is down".  Even though "the backend server is down" behaviour cannot happen in the in-memory version, isn't this throwing of  `FooException` part of the behaviour you would want to mimic for `MemoryRepositoryUser.GetById()`? &mdash;&nbsp;[\@jrahhali](https://stackoverflow.com/users/2668666/jrahhali)

Aha! I've seen programmers make this assumption before. It seems like a natural part of the learning process when trying to use Collaboration and Contract Tests to avoid the [integrated tests scam](https://integrated-tests-are-a-scam.jbrains.ca).

Indeed, no, **there is no need to use only one kind of test double to check the entire contract of that interface**. Since the in-memory User Repository can't fail because it has no "back end", we need a different way to simulate "back end failure". I affectionately refer to the Crash Test Dummy pattern: implementing the interface with methods that intentionally raise errors. For some tests, we use Crash Test Dummies to check how the client reacts to failure.

Although this solution seems fairly obvious, I can understand how programmers might not easily reach this conclusion, especially when they don't yet feel confident in their understanding of how to use test doubles ("mock objects") to write Collaboration Tests. Many of them find themselves distracted by the details of trying to write Collaboration and Contract Tests "correctly". In such a distracted state, people routinely make all manner of unjustified assumptions.

## To the Uncertain, Free Choices Can Look Like Rules

I've written extensively about Collaboration and Contract Testing since the early 2000s. For better or worse, some programmers follow my advice about how to write programmer tests. I'm certainly not the only such adviser. **What we advisers do, programmers try to copy in order to learn**. Many programmers adopt a Shu-Ha-Ri approach to learning, in which they start by following the recipe closely. Shu-Ha-Ri works best when the student and teacher can communicate directly: the teacher can attend to which details matter and which don't, while the student focuses on performing the steps correctly. **This works less well when the student can't ask the teacher a question**. When the student tries to follow the teacher, they often don't know which details matter and which don't. Unable to clarify, they err on the side of following more closely. This can lead the student to make unexpected assumptions about what they need to do.

I like test double libraries. (Some call them "mock object frameworks", but I prefer to say "test doubles" and they are mostly not frameworks.) I also prefer consistency. As a result, when I write tests and need test doubles, I tend to write them using a test double library (JMock, NSubstitute, rspec-mock...), even when writing them "by hand" is objectively easier. I tend to value the overall consistency of syntax over optimizing the syntax of any one test. I think of this as applying the Principle of Least Surprise. I freely admit this as a **personal preference**, rather than promote it as a context-free "best practice". (On the contrary, I've experimented in the last few years with using simple lambda expressions over writing stubs with the test double library. I like the results.) Anyone watching my videos, taking my training courses, or reading my articles could be forgiven for concluding that this consistency _matters_ in some greater sense---that they _should_ write their test doubles the same way all the time. If they use a lightweight implementation (like an in-memory database) in one test for one Repository, then they need to use lightweight implementations in all tests for all Repositories for all times.

And they'd have it wrong.

**A free choice, if made often enough and without explanation, can look like a rule**. You might recognize this as the Cargo Cult effect: observers who don't understand how causes link to effects invent causal relationships where none exist. In this case, the observer thinks, "since experienced person X always does Y, I should also always do Y". I see two problems here: the entire statement is wrong on its face _and_ X doesn't always do Y, but rather you've so far only seen X do Y, perhaps only because X feels comfortable doing Y and so does it most of the time. The observer has _assumed_ that X doing Y _matters_ right now, when instead X might merely have a free choice and has arbitrarily chosen do to Y. So it goes with me and test doubles in Collaboration Tests. I like consistency and I feel comfortable with dynamic test doubles, so I use them even in situations in which a simpler alternative would work equally well. And **this amounts entirely to arbitrary personal preference**. If you prefer to use lightweight implementations---we can argue the merits over coffee some time---then I want you to feel free to use them, but when you need the power of a test double library or a hand-written test double, then I want you to feel free to reach for them.

## Back To the Question

Do we need to mimic the "back end failure" behavior in the lightweight implementation of the User Repository? No. If its `findAllUsers()` method never raises an error to signal an underlying failure, then it trivially respects the part of the contract of `findAllUsers()` that says "I might raise an error of type X to signal that a failure happened in the course of doing my job". This design conforms with the LSP. No problems.

If you want to use an in-memory User Repository for the happy paths, then a Crash Test Dummy for the error paths, then do it. Of course, if these two test double implementations overlap in their behavior, then they have to do so consistently! Fortunately, the happy paths and the error paths seem disjoint to me, so I see no risk here of inconsistent behavior. The test double implementations of User Repository should _collectively_ cover every aspect of the contract of User Repository---at least up to the limits of your precious time, energy, and money. No single implementation, whether dynamic test double, hand-written spy, or lightweight implementation, must bear that responsibility alone.

I've seen some programmers use the in-memory User Repository as a starting point and then subclass and override `findAllUsers()` to intentionally raise an error for the one test that needs this. Doing this carries some risks, but it does the job. In general, this makes the test easier to write (by a tiny bit) in the moment, but creates confusion later to those reading the test. **I prefer to avoid irrelevant details in my tests as a design tool**, and the in-memory implementations of all the other User Repository methods are irrelevant details in the Collaboration Tests that want to stub `findAllUsers()`. In the bad old Java days before dynamic method invocation handlers (introduced in May 2000!), we needed such shortcuts, but not any more. I would rather just implement the User Repository interface directly (such as with a dynamic test double), since it communicates the intent of the test directly, both now and into the future.


# References

Stack Overflow, ["Testing a [sic] interface repository"](https://stackoverflow.com/questions/2096622/testing-a-interface-repository/2099727?noredirect=1#comment115471164_2099727). A question from Stack Overflow, which I answered, and which became the inspiration for this 
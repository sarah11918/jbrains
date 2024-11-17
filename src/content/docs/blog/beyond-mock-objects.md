---
title: "Beyond Mock Objects"
date: 2013-11-23
lastUpdated: 2019-03-18
tags:
  - "Test Doubles"
  - Dependency Inversion Principle (DIP)
excerpt: >
   I like test doubles/mock objects; I use them freely and happily. Even so, I sometimes use them
   as a stepping-stone to a more-suitable design that I can test without them. Here, I show one
   example, when I depend on a thing instead of the the thing that provides that thing.
---
You might call this title "clickbait". Yes and no. Of course, I want you to read this article, but at the same time, there is no bait and switch here. I use test doubles ("mock objects", since that term refuses to die) freely and happily. I use them prominently as design tools. I like them. I feel grateful to them. And even so, my design sometimes improves when I remove them. To paraphrase Ron Jeffries, **this is good news about the improved design and not bad news about test doubles**.

Herein, I rely on the general principle that **increasing testability tends to improve design, and in particular, helps us deliver features less expensively and with more predictable cost**. If you don't believe that, then what follows will likely not interest you.[^eternal-struggle] I tend to get better results by writing **repeatable** tests, meaning that **running the same test several times without any code changes gives the same result (pass or fail)**. Repeatable tests earn my trust by detecting potentially-breaking changes in my code rather than bothering me with incidental changes in the runtime environment. This leads me to adopt a guideline about repeatability.

<p class="guideline">Write more repeatable tests. (Tests with more repeatability *and* more of them.)</p>
[^eternal-struggle]: If you feel open to learning more about this point, please take a few minutes to read ["The Eternal Struggle Between the Business and Programmers"]({% include links/eternal_struggle.txt %}).

## Threats to Repeatability

Certain design decisions threaten repeatability, such as depending on externalized configuration data, databases, web services, the location of certain files containing expected content, and even the layout of the file system (Windows or Unix). All these external dependencies threaten to **change the results of a test run even though the underlying production code has not changed**. These choices make it more difficult to reason about the code, to find the source of a mistake, or to assess the impact of a change, because the behavior of the system could change without warning. **While [implicit dependencies]({% link _posts/2013-10-14-the-pain-of-implicit-dependencies.md %}) hurt, implicit dependencies on unstable resources hurt even more**. In order to write more repeatable tests, I limit the amount of code that depends on unstable resources.

<p class="guideline" markdown="1">Unstable dependencies threaten repeatability. Implicit dependencies threaten our reasoning about the code. Unstable, implicit dependencies threaten our sanity.</p>
## One Uncommonly Common Unstable Dependency

We work quite frequently with one common unstable dependency: the system clock. When we write code that depends on a random-number generator, we depend indirectly on the system clock. When we write code that needs a timestamp or two, we often write code that depends directly on the system clock. We find it so easy to use: it has become an informal, unspoken convention that creating a timestamp value defaults that value to "now" (or "today"). Programmers so routinely depend on this behavior that it bears responsibility for one of the most pervasive implicit dependencies in the world of software. Not merely pervasive but, as almost every programmer eventually discovers, insidious&mdash;at least when they decide that they'd like to write automated tests.

The average programmer will have written Transaction Scripts (see the [references](#references) below to learn more about this topic) in web applications that retrieve, for example, all the customers with orders placed in the preceding seven days, a straightforward version of which looks like the following Python-like code. (*Not intended to be working nor optimized code, but lovingly improved with the help of George Paci.*)

```{caption="A straight-forward implementation; you've probably also written this before" .python}
class CustomersWithRecentOpenOrdersController:
  def handle_request(self, request, response):
    now = Date()
    seven_days_ago = now - 7 * 24 * 60 * 60 * 1000 # in milliseconds
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, now))
    # The ModelAndView pattern, inspired by Spring Web MVC
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

The line `now = Date()` interests me, because I see at least two problems with it. Superficially, it obscures the way to compute `now`, and so I'd prefer at least to write it as `Date.today()` or `Timestamp.now()`. More significantly, however, it also creates a *direct, hardwired dependency on an unstable, global resource*: the system clock. **We can almost never run this code twice and get the same result**, at least not without considerable effort. (I'm waiting for the day that someone includes "set the time to 14:30" in their `puppet` instructions.)

"No problem!", you shout with delight. [Dependency Injection](https://link.jbrains.ca/1i3ts3H) to the rescue! We shall use the Virtual Clock pattern! Yes, we absolutely can, and I still think fondly of Paolo Perrotta's delightful article on the topic&mdash;an article which influenced my early understanding of testability and design. This article had disappeared for a while, but [Paolo republished it](https://ducktypo.blogspot.com/2013/12/the-virtual-clock-test-pattern.html) in 2013 and included [a reference to the original, courtesy of the Wayback Machine](https://web.archive.org/web/20031002130021/https://www.nusco.org/docs/virtual_clock_draft1.pdf). Even so, let me summarize the pattern for you.

## The Virtual Clock

Don't depend on the system clock directly, but instead inject an interface `Clock` that we can simulate in tests and implement in production to talk to the system clock. ISP and DIP together..

```{ .python caption="Using the Virtual Clock" }
class CustomersWithRecentOpenOrdersController:
  def __init__(orders_repository, clock):
    self.orders_repository = orders_repository
    self.clock = clock or SystemClock.new # in case clock is None

  def handle_request(self, request, response):
    now = self.clock.now()
    seven_days_ago = now - 7 * 24 * 60 * 60 * 1000
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= %d and created_at <= %d" % (seven_days_ago, now))
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

Here we introduce an interface (or protocol, in the case of languages without explicit interfaces, like Python) representing a clock with the appropriate methods.

```{ .python caption="The Clock protocol with both a test double and a production implementation" }
# One way to implement Clock in tests, especially for programmers
# who don't like test double libraries
class FrozenClock:
  def __init__(current_time_millis):
    self.current_time_millis = current_time_millis

  def now(self):
    Date(self.current_time_millis)

# A typical production implementation
class SystemClock:
  def __init__():
    pass  # I'll just talk to the system clock directly as a global resource, if you don't mind

  # Improving the name as well as breaking the dependency
  def now(self):
    Date()
```

With this new protocol, we can easily freeze the clock to any time that our various tests find convenient. *You could stub the `Clock` interface with your favorite test double library, if you prefer.* The Virtual Clock solves the repeatability problem.

## Something Smells

{% pullquote %}
In spite of this, something feels wrong about the design. The code has become more flexible, but also more complicated, and I don't feel[^intuition-mechanics] particularly good about the dependency that we've introduced. We've made an implicit dependency more explicit, and I value that a lot, but `Clock` somehow feels like **indirection without abstraction**. By this I mean that we've introduced a *seam*[^welc] to improve testability, but that {"the resulting code exposes details rather than hiding them"}, and **abstractions, by definition, hide details**. This looks like the kind of indirection that makes experienced designers look at testability nuts like us with suspicion. Rightly so, I have begun to conclude.
{% endpullquote %}

[^welc]: I learned the term *seam* from Michael Feathers' work on legacy code. A seam provides a place to plug alternative implementations of functions that initially make testing more convenient, but almost always end up improving the design of the system, too.

[^intuition-mechanics]: I have learned to pay attention to my intuition as a software designer, but mostly because [I've developed that intuition through over a decade of constant, careful practice](https://bit.ly/gmeMhh).

I used to think that "they" had it wrong. I even felt really confident about that. Now I see their point better.

<p class="guideline" markdown="1">If we want to introduce indirection, then we ought to introduce the smallest indirection possible. And we **absolutely must try** to introduce better abstraction.</p>
Indirection costs: it adds code, it adds cognitive load, it adds complications, and [complications kill]({% include links/eternal_struggle.txt %}). I prefer to keep those costs low. In this example, `Clock` feels to me like an artificial "abstraction", and as a result, I'd rather do something else. Many programmers, in this situation, blame abstraction in general for this situation, calling it "over-engineering", but I don't. Instead, I interpret it as a signal to look for a more-suitable abstraction, which I eventually find. A "more-suitable" abstraction hides the annoying details and exposes only the essentials. Sometimes a detail looks essential at first and later becomes annoying. **This reflects changes in my understanding of the code, the design, the domain, or the system, and not a failure of abstraction!**

### Where Are My Keys?

Imagine that I want to hand you my keys, and that you stand right next to me. In order to give you my keys, I walk to another room on another floor, put my keys on the table, walk back, then tell you, "You'll find my keys on the table in room 417." When we introduce `Clock` in order to provide a timestamp to our Transaction Script, we do this: we give that Transaction Script instructions to find the timestamp that it needs. I don't think that helps us here.

<aside class="aside" markdown="1">Wait a second... this dude has written about dependency injection in the past. We _know_ that he's a TDD nut. He can't possibly be telling us to [defactor](https://link.jbrains.ca/1653RlF) and write [integrated tests](https://integrated-tests-are-a-scam.jbrains.ca)!</aside>
## Don't Inject What You Could Ignore

You've probably heard this before: don't automate what you could eliminate. Similarly:

<p class="guideline" markdown="1">Don't inject what you could ignore.</p>
Do we want a clock? I don't. Do you? No. So why inject `Clock`? We don't want a clock; we want a timestamp. We really only want the clock because we want `now`. We could take a page from our functional programming friends and inject a function that eliminates the assumption that one obtains a timestamp from a clock.

```{ .python caption="Don't send a protocol to do a function's job" }
class CustomersWithRecentOpenOrdersController:
  def __init__(orders_repository, now = lambda: Date()):
    self.orders_repository = orders_repository
    self.now = now

  def handle_request(self, request, response):
    now = self.now() # self.now.call() in some languages
    seven_days_ago = now - 7 * 24 * 60 * 60 * 1000
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, now))
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

This seems like an improvement, but I think it really represents a mere difference in syntax. Yes, we avoid a class and a constructor, but a one-function protocol and a lambda expression can do exactly the same job, except that the protocol's function has an explicit name. The protocol describes itself better, but the lambda expression provides more flexibility and arguably follows ISP better. Whichever we choose, injecting the behavior provides the real value, by allowing clients to do whatever they need: tests inject a lambda that returns a hardcoded timestamp, while the production implementation injects a reference to the system clock. In C\# we would use a delegate and even Java has had lambda expressions for years now. Even so, I think we can do better.

## A Minor Problem

This code respects the [Interface Segregation Principle](https://en.wikipedia.org/wiki/Interface_segregation_principle) better, but it still suffers from a serious design problem that could trip you up during a heated, future refactoring session. Imagine what would happen if you tried to inline the temporary variable `now`.

```{ .python caption="That's a mistake" }
class CustomersWithRecentOpenOrdersController:
  def __init__(orders_repository, now = lambda: Date()):
    self.orders_repository = orders_repository
    self.now = now

  def handle_request(self, request, response):
    seven_days_ago = self.now() - 7 * 24 * 60 * 60 * 1000 # inlined here
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, self.now())) # and here
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```
When you invoke `now()` more than once, you'll get a different value for `now` each time. At some point, this will cause a problem. This is exactly the kind of situation that motivates programmers to conclude that "mocking means depending on implementation details". Well, yes and no. Even deeper than this: storing state breaks the Substitution Model of computing. Sometimes we need to store state, but as our functional programing friends continually remind us, we benefit from doing that _as little as we can_.

<aside class="aside" markdown="1">
Before you label this an artificial problem, consider how frequently we extract and inline code when we refactor, and that because we do this so often, we sometimes forget that inlining a temporary variable introduces mistakes when the operation that we assign to that variable doesn't behave with referential transparency[^define-referential-transparency]. This particular code will almost always work correctly, but as soon as those two invocations of `self.now()` straddle midnight, we risk having *eight* days of orders rather than seven. We don't know that this represents a bug, but it definitely represents an issue.[^bolton-definitions-bug-issue] Even if the risk remains low, we don't need to have introduced this risk at all. We can do better.
</aside>

[^define-referential-transparency]: We call an operation *referentially transparent* if it evaluates to the same value every time. Functionally-minded programmers make a big deal out of this for good reason, as it contributes to repeatability.

[^bolton-definitions-bug-issue]: My good friend Michael Bolton defines "bug" as "something that bugs someone" and "issue" as "something that threatens the value of the system".

Of course, we solve this problem by introducing a temporary variable to store the value of `now` right at the beginning of the function.

**There's a clue in that sentence!**

You pass me a clock, and I immediately ask it for the one timestamp that I need, and then never talk to the clock again. So why exactly did you pass me a clock?!

## Don't Inject What You Could Ignore Redux

Why inject a function returning `12` when we could merely "inject" `12`? Yes, in the future, we might need to inject something that computes `12`, but for now, we just need the `12`, so we owe it to ourselves to try injecting `12` and seeing how that changes our perception of the design.

`12`. (Annoyed yet?)

I'll *defactor* this code just a little more and you'll probably find it strange.

```{ .python caption="Don't send a function to do a value's job" }
class CustomersWithRecentOpenOrdersController:
  def __init__(orders_repository, now):
    self.orders_repository = orders_repository
    self.now = now or Date() # in case now is None

  def handle_request(self, request, response):
    seven_days_ago = self.now - 7 * 24 * 60 * 60 * 1000
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, self.now))
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

I find it strange, too. I've simplified the dependency in one respect, and complicated it in another: clients have to instantiate a new controller on each request, or said differently, the controller has *request scope*. This sounds wrong.

Moreover, one typically doesn't "inject" values; one simply passes them as parameters.[^ten-dollar-phrase] It should pose no problem, then, to reduce the scope of `now` to the method... except that we live in a framework&mdash;didn't I mention that?&mdash;where we have to implement the method `handle_request(self, request, response)` in order to register our controller to receive requests for the URI `/customers/recent_orders`. This limitation creates tension: I want `now` as a parameter to the request handler, but the framework doesn't want to (and couldn't possibly) know this domain-level detail. (Or could it? Think about it.) This encourages me to extract a new method as a compromise.

[^ten-dollar-phrase]: This illustrates why some people pompously label dependency injection as an overblown consultant-driven marketing phrase. "Real programmers just pass parameters", they say. Indeed, but I find some value in differentiating passing values to a function and passing collaborating services to a service. I pass values, but I inject collaborators. I don't see the problem.

```{ .python caption="" }
class CustomersWithRecentOpenOrdersController:
  def __init__(orders_repository):
    self.orders_repository = orders_repository

  def handle_request(self, request, response):
    return handle_request_as_of(self, request, response, Date())

  def handle_request_as_of(self, request, response, now):
    seven_days_ago = now - 7 * 24 * 60 * 60 * 1000
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, now))
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

Brace yourself: **I probably wouldn't test `handle_request()`**. [Don't panic](https://junit.org/junit4/faq.html#best_3). I would test `handle_request_as_of()` with great care and attention and then trust that I typed `Date()` correctly. This change would improve the design in one obvious way: I could test `handle_request_as_of()` quite easily, by passing a variety of values for `now`. Moreover, we could improve the name `now`, replacing it with something less context dependent, and call it `instant`. (This reflects Joda Time's influence on me, an accident of history, rather than some deep understanding about the domain of timekeeping.)

```{ .python caption="We can name this parameter with an eye towards reuse" }
class CustomersWithRecentOpenOrdersController:
  def __init__(orders_repository):
    self.orders_repository = orders_repository

  def handle_request(self, request, response):
    return handle_request_as_of(self, request, response, Date())

  def handle_request_as_of(self, request, response, instant):
    seven_days_ago = instant - 7 * 24 * 60 * 60 * 1000
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, instant))
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

I choose to ignore for the moment the issue with assuming that `instant` is a number representing time in milliseconds. If you and I paired on this for a real client, we'd have fixed that by now, so that the code could read something more like `instant.minus(Days(7))`.

I like that this new method now finds "customers with recent open orders, relative to any date you choose", rather than specifically relative to **now**. Come to think of it, "recent" now feels a little out of place. So does "ago", which should become "prior" or "before". I digress. The names matter, and we would fix them, but I want this article to focus on the emerging abstraction.

## The Instantaneous Request

We have given birth to a new abstraction in our web application framework: **the instantaneous request**. This object represents a request that we handle by pretending that it happens all at once (instantaneously). I expect us to find this abstraction useful in other parts of the system. We might even extract it into a request handler Decorator that we could use more widely. Of course, I would encourage us to wait until we had three instantaneous requests before we extracted the duplication, and when we did, we'd have something like the following.

```{ .python }
# Reuse me!
class InstantaneousRequestController:
  def __init__(instantaneous_request):
    self.instantaneous_request = instantaneous_request

  def handle_request(self, request, response):
    self.instantaneous_request.handle_request_as_of(self, request, response, Date())

# I belong to the domain
class CustomersWithOpenOrdersAsOfInstantController:
  def __init__(orders_repository):
    self.orders_repository = orders_repository

  def handle_request_as_of(self, request, response, instant):
    seven_days_ago = instant - 7 * 24 * 60 * 60 * 1000
    recent_open_orders = self.orders_repository.find_all_open_orders("created_at >= date(%d) and created_at <= date(%d)" % (seven_days_ago, instant))
    response.attributes["customers_with_recent_open_orders"] = recent_open_orders.map(lambda order: order.customer).uniq
    response.view = "RecentOpenOrdersReport"
```

When it came time to register this controller to respond to the appropriate request URI, that would look like this:

```
InstantaneousRequestController(
  CustomersWithOpenOrdersAsOfInstantController(
    ProductionCaliberOrdersRepository()))
```

If you'd feel more comfortable giving this a name, then feel free.

```{ .python caption="Giving a name to our newest creation" }
class CustomersWithRecentOpenOrdersController(InstantaneousRequestController):
  def __init__(orders_repository):
    super(CustomersWithOpenOrdersAsOfInstantController(orders_repository))
```

## The Whole Point

Did you notice the comment `Reuse me!`? Did you notice the key word in there?

**Reuse**.

{% pullquote %}
When we build modules (functions, objects, whatever) with less knowledge of their surroundings, which depend less on their context, then we naturally build modules more fit for reuse. **No more excuses**. {"If you want more reuse, you have to make it happen"}, and building modules with **context independence** in mind achieves that aim. We got there by **noticing indirection without abstraction**, then **inverting the dependency** (which happened to remove a mock object), then **spotting duplication**, then extracting that duplication into a **context-independent, reusable module**.
{% endpullquote %}

*We did that*. No magic. "Objects" didn't even matter here. We could have done the same thing in Haskell with functions. (Remember: a one-method interface and a lambda expression are functionally equivalent.)

So please stop telling me that *object-oriented programming hasn't fulfilled its promise of increasing code reuse*. **Programmers haven't taken advantage of their opportunities to extract more-reusable code.** We don't have to anticipate all our future needs at once; we can instead notice them as they start to happen, and then extract them when they might help. Some senior programmers call this "over-engineering", but I see it as engineering just enough and just in time. Extracting frameworks from real production use amounts to doing the same thing in retrospect and in bigger batches as I've done here, incrementally, and just in time.

<p class="guideline" markdown="1">Write code more independent of its context. I find this code easier to test, easier to understand, easier to maintain, more stable, and easier to reuse.</p>
Try it!

## One More Thing...

{% pullquote %}
If you just don't like passing `instant` as a parameter here, and prefer something more flexible, then I'd like to suggest an alternative to the `Clock` protocol. `Clock` feels like a leaky abstraction: although it provides some flexibility in the implementation details, its name reflects an unnecessary assumption about what matters to the code. {"The code doesn't want a clock; it wants a stream of timestamps."} So give it a stream of timestamps. You could pass an `InfiniteIterator` of `Timestamp` objects (or whatever you call them in your programming language of choice). _This_ represents a true abstraction, because it says, "My code needs some timestamps. I don't know how many it needs and I don't even care what they represent. My code just needs an endless stream of timestamps."
{% endpullquote %}

A frozen clock? That's just an endless stream of the same timestamp over and over again. A system clock? That's just an endless stream of calls to `Date()`. Tempted to use TimeCop to control the system clock? No need. Just provide an endless stream of whatever timestamps you need. And it all just works like an iterator.

_That's_ abstraction with power.

## References

Martin Fowler, ["Transaction Script"](https://link.jbrains.ca/19QhAba). I often implement my controllers as Transaction Scripts, then as I notice duplication, I start to separate application logic from business logic, moving the application logic up the call stack into "filters" and moving the business logic down the call stack into a Domain Model.

Martin Fowler, [*Patterns of Enterprise Application Architecture*](https://link.jbrains.ca/TEkD2M). A catalog of fundamental patterns in enterprise applications that you likely take for granted by now.

J. B. Rainsberger, ["Injecting Testability Into Your Designs"](https://link.jbrains.ca/vN1IiF). An older article in which I describe a simple example of injecting dependencies new to the concept.

Michael Feathers, [*Working Effectively with Legacy Code*](https://link.jbrains.ca/1bZXmRc). This remains the standard reference for maintaining and living with legacy code.

## Reactions

<blockquote class="twitter-tweet" lang="en"><p>Mocks in tests are good, but even better is thinking about what you are trying to accomplish <a href="https://t.co/RFSF8rpabj">https://t.co/RFSF8rpabj</a> /via <a href="https://twitter.com/jbrains">@jbrains</a></p>&mdash; Chris Hartjes (@grmpyprogrammer) <a href="https://twitter.com/grmpyprogrammer/statuses/404263296083062784">November 23, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

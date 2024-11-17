---
title: "Getting Started with Contract Tests"
date: 2017-06-25
tags:
  - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
  - Test Doubles
excerpt: >
  If you're thinking about starting to use Contract Tests, don't look for tools,
  because they don't help you with the most important aspect of Contract Tests,
  and they might even distract you from it.
---
Today's article answers a question that I received recently.

>   Hey, I attended a talk of yours about continuous delivery. One of the main takeaways from that was the mention of Contract Testing. In my team we're thinking about trying it out, starting first with one of our features and testing the contract Frontend<->Backend. We've seen some tools that might help like Pact, but are not sure if that's the right way to go. If you could give us any help, it would be highly appreciated.

In short, don’t look for tools. More important, for now, is to document each module’s expectations of its collaborators. I prefer to document them as running examples, meaning tests. For example, if a controller expects a model’s update function to throw an exception in case it can’t find the entity to update, then write a test for the model interface like this:

```ruby
# Something like RSpec/Ruby

describe “no entity exists matching the ID” do
  model = model_without(entity) # maybe stub the storage not to find the entity by its ID

  expect(() -> { model.update(entity) }).to_raise(EntityNotFoundException) # entity is a snapshot of the state that you want to save
end
```

Here, you have deferred the implementation of `model_without(entity)` to implementations of the `Model` interface/protocol. 

<aside markdown="1">

Of course, you don't literally have an interface/protocol called `Model` nor a class called `Controller`. These are placeholders.

</aside>

Whoever implements `Model` has to provide a way to initialize a `Model` instance that can't find/doesn't have `entity`. An in-memory version could just delete it from its internal collection. A database version would do `delete from customers where customer_id = ?`. The Contract Test doesn't care about this detail—it describes behavior that clients rely on without referring to a specific implementation of the collaborator.

It’s quite common, in fact, to start with a concrete test for the production implementation of the collaborator, and then extract a Contract Test by extracting a factory function for creating the subject of the test.

## A Simple Example in Java

Before:

```java
public class FindPriceInMemoryCatalog {
  @Test
  public void productFound() throws Exception {
    InMemoryCatalog catalog = new InMemoryCatalog(Collections.singletonMap("::barcode::", "::price::"));
    assertEquals("::price::", catalog.findPrice("::barcode"));
  }
}
```

After:

```java
public abstract class FindPriceInCatalogContract {
  @Test
  public void productFound() throws Exception {
    Catalog catalog = catalogWith("::barcode::", "::price::");
    assertEquals("::price::", catalog.findPrice("::barcode"));
  }

  public abstract Catalog catalogWith(String barcode, String matchingPrice);
}

public class FindPriceInMemoryCatalog extends FindPriceInCatalogContract {
  public Catalog catalogWith(String barcode, String matchingPrice) {
    return new InMemoryCatalog(Collections.singletonMap(barcode, matchingPrice))
  }
}
```

## Semantics and Syntax

These tests check the _semantics_ of the contract—the meaning. They check that implementations of `Model` behave the way that clients of `Model` expect them to. They check _behavior_. Tools like Pact (and Bogus and Chado and whatever else is out there) only check the _syntax_ of the contract—the shape. They check that implementations of `Model` have the method signatures that clients expect. In languages with compile-time type checkers (Java, C#, Haskell, C++), the compiler runs these tests for you. Checking the syntax tells you that the pieces will fit together, but that’s often less than half the story. Check the semantics tells you that the pieces will _work_ together. As far as I know, Pact doesn’t help with that.

## Step Away From the Tools

I would recommend that you just start writing Contract Tests as best you can. Follow these simple rules:

+ If Client `A` stubs `B.foo()` to return value `X`, then write a Contract Test for `B` that shows when to `expect(foo()).toEqual(X)`.

+ If Client `A` expects (should receive) `B.foo(a, b, c)`, then write a Contract Test for `B` that runs `foo(a, b, c)` (as the action of the test) and documents the result.

In other words, if `A` assumes that `B.foo()` can return `X` (or raise error `Y`), then you need a test for `B` that shows _when this happens_; and if `A` needs to invoke `B.foo(a, b, c)`, then you need a test for `B` that shows that it responds to `foo(a, b, c)`. Pact might help you with the second kind of test, but I recommend writing those tests yourself for a while, before looking for a tool to streamline that for you.


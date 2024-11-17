---
title: "Choosing Tools for Test Doubles"
date: 2020-04-08
tags:
    - Simple Design
    - Test Doubles
summary: >
    If you're wondering about whether you should hand-roll your test doubles (mock objects) or
    use a library, then this article will help you.
---

When I teach evolutionary design, participants still often ask me which tools they ought to use to introduce test doubles into their projects. Yes, I nudge them gently in the direction of focusing on principles and techniques and away from fixating on tools, but [they still need a place to start](#references). This question often comes in the following form:

> Do you favor hand-rolling test doubles or using a library (like NSubstitute, Mockito, or rspec-mock)?

I choose the option that balances [removing duplication](https://blog.jbrains.ca/permalink/the-four-elements-of-simple-design) with requiring the least effort, just as I make a large number of my design decisions. The question of test doubles here doesn't change my general approach. I use a library if I can trust it and if it will reduce the cost of changing code over time.

## A Tie-Breaker: Arbitrary Personal Preference

I like the syntactic uniformity of using a library like JMock or NSubstitute. I read code more easily when I can anticipate the syntax it uses to express an idea. In particular, I find it easier to _skim_ when I correctly anticipate the syntax it uses to express an idea. **I prefer making code easier to skim in general, since that reduces the effort one needs to read and mentally process it.** This nudges me towards uniformity when I feel no other significant need for variety. Therefore, if I would use a test doubles library somewhere in the project, then I would tend to prefer to use it everywhere in the project. **I freely admit this as an arbitrary personal preference** and I consider it my responsibility not to advocate for my personal preference in situations where there might exist objectively more-appropriate or less-appropriate choices. Otherwise, all else equal, I'd use the test double library everywhere.

This raises an obvious question: which contexts might lead to more-objectively appropriate choices? I offer two as examples: stubs in Java and expectations everywhere.

## Example: Java, Lambda Expressions, and Stubs

Java 8 added lambda expressions and decided to make one-method interfaces and lambda expressions interchangeable. This means, for example, that a function accepting a parameter that's a one-method interface can also accept a lambda expression with the same _shape_ (same input parameter types and same return value type). The compile-time type checker doesn't mind. I can choose whichever syntax better fits the situation: a one-method interface or a lambda expression. This opens up an opportunity for conciseness and flexibility that hadn't existed previously and this prompted me to go against my arbitrary personal preference.

### Before...

Before Java 8, a hand-rolled stub required an anonymous implementation of an interface with non-trivial extra syntax. I found it easy to justify using a test double library in this situation, because it removed duplicate meaningless (boilerplate) syntax.

```java
@Test
public void productNotFound() throws Exception {
    Catalog catalog = new Catalog() {
        @Override
        public Option<Price> findPrice(String barcode) {
            return Option.none();
        }
    };
    
    SellOneItemController controller = new SellOneItemController(catalog);
    
    String responseText = controller.handleRequest("99999");
    
    Assertions.assertEquals("Product not found: 99999", responseText);
}
```

Yes, I _understand_ it, but I have a little trouble _skimming_ it. By using a test double library, I feel less resistance trying to read the test at a glance. And yes, it feels like a perfectly surmountable obstacle in this small example, but if I add enough pebbles to the basket you're carrying, you'll eventually no longer manage to carry it.

```java
private final Catalog catalog = mock(Catalog.class);

@Test
public void productNotFound() throws Exception {
    when(catalog.findPrice()).thenReturn(Option.none());
    SellOneItemController controller = new SellOneItemController(catalog);
    
    String responseText = controller.handleRequest("99999");
    
    Assertions.assertEquals("Product not found: 99999", responseText);
}
```

I find this more concise: I skim it more easily. This version hides irrelevant details, namely the syntax of overriding a method in Java. I judge `when` and `thenReturn` to better express the intent of the object. All these nudge me in the direction of using the test double library, which aligns with my arbitrary personal preference, which I like.

### ...After

I get the best of both worlds by taking advantage of interchanging lambda expressions with one-method interfaces, resulting in syntax that hides irrelevant details without requiring a library.

```java
@Test
public void productNotFound() throws Exception {
    Catalog catalog = barcode -> Option.none();
    SellOneItemController controller = new SellOneItemController(catalog);
    
    String responseText = controller.handleRequest("99999");
    
    Assertions.assertEquals("Product not found: 99999", responseText);
}
```

I don't consider this a _clear_ improvement, but I certainly feel open to it. I skim it reasonably well, but when reading it for the first time, I might find the lambda expression a bit jarring: it hides irrelevant details well, but it might hide relevant details, too. This version hides the fact that `Catalog` only does `findPrice()`, at least for now. I would feel _much better_ if I renamed the interface to `FindPrice` and let go of the artificial preference for a noun over a verb. ("Nouns are more object-y!")

```java
@Test
public void productNotFound() throws Exception {
    FindPrice findPrice = barcode -> Option.none();
    SellOneItemController controller = new SellOneItemController(findPrice);
    
    String responseText = controller.handleRequest("99999");
    
    Assertions.assertEquals("Product not found: 99999", responseText);
}
```

I quite like this: easy to skim, [hides irrelevant details](https://blog.thecodewhisperer.com/permalink/what-your-tests-dont-need-to-know-will-hurt-you), [expresses intent](https://blog.jbrains.ca/permalink/the-four-elements-of-simple-design). It likely looks strange to someone not familiar with the functional programming style of passing lambda expressions around, but then this might provide to the reader a gateway to learning about function programming. I wouldn't consider that a primary goal, but as a pleasant side-effect, I might like it.

<div class="highlight" markdown="1">
I could happily hand-roll stubs in languages with concise-enough syntax that the test double library's uniformity doesn't express intent significantly better than the language's built-in features do. I might even prefer it.

</div>

## Expectations: I Probably Always Prefer a Library

Writing method expectations by hand means duplicating code, [which I generally prefer to avoid](https://blog.jbrains.ca/permalink/the-four-elements-of-simple-design). For this reason, I routinely use a test double library---even a library like JMock whose syntax not everyone likes. On average I don't see the value in repeating this kind of pattern in my code:

- Add a field to check whether the subject under test invokes the expected method. Remember to initialize it to `false` or empty or whichever value represents "not yet invoked".
- Maybe add details to that field to store the parameters that the expected method received, so that I can check them.
- Add one or more assertions to verify the expectation. Should we fail fast, checking the parameters at the moment the test invokes the expectation? Should we respect the traditional sequence of a test and store those parameters so that we can check them at the end? We have to decide and we should probably do it consistently.

Worse, in some languages and situations I might implement this differently, depending on how much of the method expectation I need to check.

- If I don't need to check the parameters, then I use a boolean field called something like `blahblahWasInvoked`, but if I do check the parameters, then I use a Maybe List of arguments passed.
- If the subject might invoke the expected method multiple times, I replace the boolean/Maybe with an explicit collection.
- In some languages, I use old-fashioned Log String pattern because it suffices and requires less-involved syntax.

This already feels like too many decisions. Worse, the kind of tiny decisions that too often devolve into bikeshedding. Meh. A uniform syntax with enough flexibility pushes all that nonsense to the side. Moreover, I'd rather implement the concept once, uniformly, and _correctly_, then hide the details in a nice reusable library. We programmers get into trouble when our tests become complicated enough that we might get them wrong. I've seen it even in the last five years that a programmer hand-rolled an expectation, leading to a test that could never fail. (It checked the parameters to the expected method, but not whether anything ever invoked the method.) Everyone who hand-rolls expectations gets this wrong at least once, **including me**. To avoid this mistake, we either delegate this behavior to something we trust or we end up wanting to test the tests. Who tests the tests? And who tests the tests that test the tests?! Let's not go there.

As regards method expectations, using a test double library represents an almost-certain win for me compared to hand-rolling them, so I default to using a library until I see a compelling reason to do otherwise. I don't mean that as code for "don't ever do it": I hand-rolled a method expectation during a demonstration where I didn't plan on needing one, judged that the audience would become confused by trying to add a library to the project, and realized that I wasn't likely to need a second expectation. Hand-rolling the expectation felt like the path of least resistance in the moment. Here, I found myself in a very peculiar situation. **I don't remember the last time that, in an industrial-strength, professional project situation, I preferred hand-rolling method expectations to using a library.** In the worst case, I could imagine hand-rolling the first two method expectations, then invoking the Rule of Three to refactor towards using a library.

## That Leaves Me One Key Question

Why do some of my peers---most of whom I respect---insist on advocating loudly against test-double libraries and in favor of hand-rolling? I don't think I understood this until recently. This question reminds me of the [long-time mystery of why Corey Haines and others insist on enumerating the four elements of simple design in the wrong order](https://blog.thecodewhisperer.com/permalink/putting-an-age-old-battle-to-rest). If I could solve that mystery, then maybe I could solve this one. The act of drafting this article led me to do exactly that.

## One Pattern I've Noticed

I've noticed programmers who advocate hand-rolling all their test doubles all the time always. Such absolute rules tend to make me nervous, although I can think of two reasonable explanations for this advice. First, as a Novice Rule, it might help the programmer in the usual Novice Rule ways:

- Remove an element where they need to exercise judgment while they focus on correctly executing the technique.
- Defer consideration of a higher-level concern while they focus on understanding the lower-level concern. They will more-easily consider the higher-level concern when they've "chunked" the ideas at the lower level.
- Provide clear direction in order to reduce resistance towards starting to use the technique.
- Provide a small, recurring sense of completion with just-enough challenge.

Not everyone likes the Novice Rule approach, but it has helped enough people often enough to earn a place in my bag of tricks. More significantly, however, I have noticed a pattern in programmers who advocate hand-rolling all their test doubles all the time always which has nothing to do with Novice Rules nor any other pedagogic technique. For those programmers, they advocate hand-rolling test doubles as a side-effect of a more-significant pattern in how they design.

### Warning: Strong Generalizations Ahead

Forgive me.

Let me use the phrase "object-oriented programmer" to mean someone who broadly thinks natively in terms of object-oriented design terms, but in the best possible way. Think Alan Kay and his famous advocacy for thinking about encapsulation and message-passing, rather than the pejorative sense of a programmer who uses objects as arbitrary collections of global functions manipulating global variables wearing bow ties as singletons and nakedly-mutable, arguably-cohesive `struct`s.

Let me also use the phrase "functional programmer" to mean someone who broadly thinks natively in terms of functional programming design terms, but in the best possible way. Think of a strong bias towards immutability and pushing state to the edges of the design, rather than the pejorative sense of a programmer who wields abstractions with arcane names as a cudgel to beat poor object-oriented programmers around the head with.

Object-oriented programmers and functional programmers tame side effects differently, resulting in object-oriented programmers using expectations much more often than functional programmers. Functional programmers invert dependencies more aggressively than object-oriented programmers. who weaken some of those dependencies as an intermediate step towards inverting them. This results in functional programmers having an accidental bias towards hand-rolling test doubles **because they actually do what I do, but since they almost never use expectations, they never invoke the "remove duplication" reason to prefer test double libraries over hand-rolling**. Functional programmers rarely use expectations _and_ they work in languages with concise syntax for lambda expressions, so _by coincidence_ they find it very comfortable to hand-roll (almost all) their test doubles.

Mystery solved.

## Summary

- I tend very strongly to use test double libraries for method expectations, in order to remove duplication. I need a compelling reason to hand-roll method expectations.
- I freely both hand-roll and use test double libraries for stubs, depending on the context. I fall back on more-general design principles to make this decision in a specific situation.
- I believe that programmers who advocate loudly for hand-rolling test doubles all the time just happen to work most often  in a style and a context where I would happily hand-roll most of my test doubles anyway, so I view their advice as a special case of my own.

# References

J. B. Rainsberger, ["JMock v. Mockito, But Not to the Death"](https://blog.thecodewhisperer.com/permalink/jmock-v-mockito-but-not-to-the-death). One case where the choice of tool depends on my conscious intent in addition to accidents of history and arbitrary personal preference.

Chip Heath and Dan Heath, [_Switch_](https://link.jbrains.ca/TeSr30). A manual on guiding people to changing their behavior, which includes a chapter on "scripting the critical first steps"---that is, describing a clear way to start.
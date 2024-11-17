---
title: "What's Not To Like About This Code? An Experiment."
date: 2022-12-20
tags:
    - Refactoring
    - Simple Design
    - What's Not To Like About This Code?
summary: >
    What happens when I try to review code in small steps and in public?
    Let's find out.
---

Code Reviews have a bad reputation. It seems easy to do them poorly, to create friction, to hurt people, and to waste both time and energy doing them. For this reason, I developed a simple serious game: ["What's Not To Like About This Code?"](https://www.jbrains.ca/sessions/whats-not-to-like-about-this-code)

I'm going to practise criticizing code in public. I've decided to do this for two key reasons:

- It might help readers by making concrete some of the abstract-sounding advice that I provide.
- It might increase the amount of _civility_ in code criticism in the world, which I hope we can agree sounds like a worthwhile goal.

Let's see what happens.

<style type="text/css">
figure.interstitial img { max-width: 80%; max-height: 2cm;  }
</style>

<figure class="interstitial"><img src="{% link images/icons/noun-dislike-2199212-E36877.png %}" /></figure>

# Episode 1

In a discussion in [The jbrains Experience](https://experience.jbrains.ca), someone asked about patterns for handling incoming messages out of sequence, especially when processing Message 1 (the message arriving first) might lead to making data obsolete that Message 2 (the message arriving second) tries to refer to. Another member helpfully mentioned the "Saga" pattern, which I hadn't seen before, but which seems simple enough: a state machine that governs holding incoming messages in queue until they can be applied. Helpful Person shared [this tutorial about Sagas in NServiceBus](https://docs.particular.net/tutorials/nservicebus-sagas/1-saga-basics/#exercise-sagas-as-policies) in order to illustrate the pattern.

I don't intend to criticize the pattern, but I noticed something about their code sample that I didn't like.

```csharp
private async Task ProcessOrder(IMessageHandlerContext context)
{
  if (Data.IsOrderPlaced && Data.IsOrderBilled)
  {
    await context.SendLocal(new ShipOrder() { OrderId = Data.OrderId });
    MarkAsComplete();
  }
}
```

Two things jump out to me right away.

1. The name `ProcessOrder` seems both accurate and misleading at the same time.
1. This design choices makes arguably the most important code in this Saga annoyingly difficult to test.

## The Name

An accurate-but-misleading name **gives me a false sense of understanding the code, but ultimately betrays my trust**. This code seems to have an intent related to processing an order, but it doesn't always process an order! It might process an order, if it thinks it should process the order; otherwise, it doesn't process any order.

I chose the phrase "betrays my trust" in order to be intentionally overly-dramatic for humorous effect, but there lies a kernel of truth in that. **A name having this effect on me trains me not to trust other names in the code.** This effect builds over time, adding stress and reducing energy, which tends to lead to further deterioration of the code, which leads to more mistrust. I see a positive feedback loop of pain and suffering, leading at best to numbmess. I prefer not to live like that.

## Holding Business Rules Hostage

Although written in Tell, Don't Ask style, this implementation of `ProcessOrder()` holds as hostage the part of the code that I imagine we'd care most about testing: the Guard Clause that protects us from trying to process an order before it's ready to process. When I imagine writing those tests, I imagine before forced to choose between two alternatives I dislike more-or-less equally:

- An integrated test that actually tries to process an order.
- An isolated test that sets an expectation on `SendLocal()`.

The integrated test would force me to know about the details of how to detect that this code actually tried to process an order, even though I don't care about the outcome of processing an order (and I might even need to avoid actually processing the order, because that sounds like a destructive operation!).

The isolated test would force me to choose between exposing an implementation detail (`SendLocal()`) and hiding that behind an abstraction that I might not otherwise want yet. I might actually _like_ to hide sending a local message behind an abstraction and I might even _like_ that this design choice has forced me to confront that decision, but even with a nice abstraction to hide `SendLocal()`, the resulting tests become more complicated than they need to be: they become coupled to a side-effect and they use "cause side-effect X or not" as little more than a boolean value in a tuxedo. (Where's that meme when I need it?)

> As I look at this code again, just before publishing this article, I am reminded that `ProcessOrder()` takes as an argument the "Message Handler Context" collaborator that it sends `SendLocal()` to. I infer that this makes `ProcessOrder()` an Adapter to the NServiceBus framework that exposes `IMessageHandlerContext` and that this interface already is the intended abstraction. I would definitely _not_ want to wrap the framework's abstraction in a homegrown abstraction inside a function whose purpose seems to be as an Adapter to the framework. That would seem to defeat part of the purpose of a framework Adapter.
>
> I digress.

I would rather check the business rule more directly, both because it would seem more resilient to change and it would reveal its intent more clearly. This seems especially important, given that this business rule seems to lie at the center of this code's existence: to avoid trying to process an order when that operation is doomed to fail. Moreover, this feels like a Broken Window risk: if we don't attend to this risk now, future changes will only intensify the suffering from the unneccessary coupling/indirectness. The tests will only become more brittle and costly to maintain. This example seems to illustrate the common pattern that we rarely find the time and energy to improve it now, but **we will surely find the time and energy to whine about it in two months**.

## There's More Not To Like...

Even though I could find more not to like about this code, I don't need to do that now. I've said what I wanted to say and I feel ready to move on. If you'd like to mention more things not to like, then please feel invited to do that, but please also remember this:

> If you comment in public, remain civil; if you can't remain civil, then comment in private.

Please.

## Even So...

In spite of finding these things not to like about the code, I followed this tutorial about the Saga pattern quite easily, so the tutorial did its job well enough for me today. Please remember that I don't offer any of this as a criticism of the overall article nor of its authors.

I merely wanted to point to an example of small code with small risks that I consider worth addressing before they become serious problems. What do you think?


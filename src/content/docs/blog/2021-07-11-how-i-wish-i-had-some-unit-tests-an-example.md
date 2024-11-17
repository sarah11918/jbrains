---
title: "How I Wish I Had Some Unit Tests! An Example"
date: 2021-07-11
lastUpdated: 2021-08-12
tags:
    - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
summary: >
    The integrated tests scam goes beyond "merely" making
    tests slow and brittle. Sometimes they render impossible
    an otherwise straightforward test.
---

Today I ran into an example of where I'd _really_ have liked to have some way to write a unit test. Let me clarify: by _unit test_, I only mean _any test with a smaller scope than the entire system_. I don't want a microtest. I would even have felt satisfied with clearer, more up-to-date documentation, although perhaps I might not have trusted it.

## So, There I Was...

Today, I saw this task pop up in Todoist:

> Write a [Netlify Function](https://functions.netlify.com/) to schedule removing a participant from [The jbrains Experience](https://experience.jbrains.ca) in [Teachable](https://online-training.jbrains.ca) when they cancel their subscription in [Thrivecart](https://thrivecart.com).

Before I do that, I try building an automation with Integrately, just to see how far I can get. You never know. In doing this, I notice something new and potentially helpful. In the payload of the sample "subscription canceled" event from Thrivecart, I notice a property called "Billing period end" with a timestamp. This might be what I'm looking for.

Unfortunately, I've seen this film before. I couldn't be sure that "Billing period end" means "the end of the current billing period" as opposed to "the end of the first billing period". I'd _like_ to trust their name, but I'd rather _verify_ that Thrivecart and I stand on the same page.

I went looking for details in their documentation and didn't find it, so I did the next-best thing: I devised a Learning Test.

## Wait... How Do I Test This?!

I mean... I can go to <https://webhook.site> and subscribe to Thrivecart for "Subscription Canceled" events, then "buy" a subscription for a Product in Test mode. Great! I tried that and didn't receive any events. For Products in Test mode, Thrivecart does not seem to generate webhook events. I inferred that I need to buy a "real" Live subscription. No problem! I create a subscription product whose price is $0.

Well... _almost_. Thrivecart doesn't let me create a subscription product with a cost of $0. The best I can do is a subscription product whose recurring price if $1, but whose first-month price is $0. **I wish I could run a unit test, because then I wouldn't care about the price of the subscription product**. Alternatively, I could give myself a 100% off coupon, but that adds a step to an already complicated manual test, so I accept this limitation and create a subscription product at the price of $0 for the first month, then $1/month thereafter. I find this mildly annoying, but I can deal with it.

I use my Webhook URL to subscribe to Thrivecart webhook events. I "buy" the "real" $0/$1 subscription product using PayPal, so that I can easily confirm when I will have canceled the $1 recurring payment. I then cancel the subscription, including the PayPal recurring payment. After I do all this, which requires about 10 steps in total, I look at the incoming event in Webhook and I see something promising:

```json
{
  "event": "order.subscription_cancelled",
  "mode": "live",
  "mode_int": "2",
[...]  
  "base_product": "10",
  "base_product_name": "Test subscription product",
  "base_product_label": "Test subscription product",
[...]    
  "subscription": {
    "type": "product",
    "id": "10",
    "product_id": "10",
    "name": "Test subscription product",
    "label": "Test subscription product",
[...]
    "frequency": "month",
    "frequency_days": "30",
    "remaining_rebills": "null",
    "billing_period_end": "1628712591",
    "billing_period_end_iso8601": "2021-08-11T20:09:51+00:00"
  }
}
```

The salient part is `billing_period_end` (and its human-readable companion `billing_period_end_iso8601`). The value is what I would expect: 1 month (to the second!) after the purchase instant. Well... that's _great_, but it doesn't help me confirm that I can safely interpret this "billing period end" value the way I expect to. In order to do that, I'd need to cancel a subscription that's more than 1 month old.

And _that's_ where **I wish I had some unit tests**! I wish I had a sandbox environment in which I could retroactively create a subscription from 32 days ago. If I had access to the Domain code, suitably decoupled from the Technology Integration code, then I could write a single unit test to answer my question. **But I can't**. And that makes me just a little bit sad.

## So What?!

This situation illustrates the down side of assuming that "sensible usage patterns" are the only usage patterns that need to be available to your customers. In production, of course, we probably don't want to let customers retroactively create subscriptions that started in the past---_or do we_? I could imagine wanting this feature in order to migrate subscriptions from a legacy platform into Thrivecart. Even if you, the Director of this Product, want to restrict users from doing this in production, consider making this behavior available in a _sandbox environment_, in which your customers can play whatever "what if?" game they need to play in order to test their stuff. Your sandbox environment benefits from not being bound by the same constraints as the production system.

The same is true of your code. Let the programmers arrange objects, modules, or values into any graph that one could possibly need and that respects the business rules of the system, _even if_ you want to stop end users from doing those things. Let them create a new Subscription that "started" 6 months ago. Let them create a Shopper that already has a Purchase History with 23 Purchases in it without needing to run the purchasing workflow 23 times. Not only does this help them write clearer tests, but you might get certain features "free of charge", like pause/resume or import/export.

Either way... please keep your published documentation up to date as APIs change. And when one of your customers asks you to notify them when you add a feature in the future, then please notify them when you add that feature. If you don't have a _trusted system_ to help you do that, then maybe you need to [get started with Getting Things Done](https://blog.jbrains.ca/permalink/getting-started-with-getting-things-done).

## Epilogue

Thrivecart confirmed the meaning of this "billing period end" attribute by telling me directly. I appreciate them for doing that. I asked them to update their documentation. I hope they find the time to do that. Overall, **Thrivecart has delighted me as a customer** and I recommend them to anyone who needs to sell products and services online. (Isn't that everyone now?)

## Epilogue to the Epilogue

One month after writing this article, I got my first real-life customer who canceled who had been subscribing for longer than one month, and for whom I received confirmation that "billing period end" means what I expected and hoped it would mean.

That's a long feedback loop.


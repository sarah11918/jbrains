---
title: "Learning Tests for POSTing Email from Mailgun"
date: 2014-10-26
tags: []
---
I had intended to write a nice article showing a concrete example of _learning tests_ in action, then something wonderful happened: all the code disappeared.

## The Situation

I love [Typeform](https://www.typeform.com), especially because it integrates with [Stripe](https://www.stripe.com) for processing payments. Sadly, Typeform does not allow my customer to pay-what-they-think-it-was-worth unless I anchor them by presenting a handful of price options, similar to what you see here.

<figure><img src="/images/LearningTestsForPostingEmailFromMailgun/TheClosestWeCanGetToPayWhatYouWant.png" /><figcaption>Not the way I want to let my customers choose the amount they wish to pay. How many buttons should I give them?</figcaption></figure>

## The Plan of Attack

After reviewing my options, I settled on letting a customer enter the amount they want to pay in a Typeform form, which will send an email to a custom application that responds with a link to a Stripe checkout form for the amount they chose. It feels a little convoluted, but it will work. I know how to create the Stripe checkout and I know how to create the Typeform form, but I have not handled incoming email with Ruby and Sinatra and Heroku before, so I need to learn that.

<figure><img src="/images/LearningTestsForPostingEmailFromMailgun/ForwardingEmailFromMailgunToSinatra.png" /><figcaption>The Architecture Diagram</figcaption></figure>

## An Hour of Pointless Coding Later...

After writing code (and documenting what I did so that I could publish it for you to read), I found out that I didn't need to do any of it. Instead, I could use existing tools to learn what I needed to know. Specifically, I needed to know the format of what Mailgun will forward to my Sinatra application's `POST` handler.

In reading [Mailgun's REST API documentation](https://link.jbrains.ca/1oMOCHt), I discovered a wonderful tool: [https://bin.mailgun.net/](https://bin.mailgun.net/).[^requestbin] When you visit bin.mailgun.net, you receive a URL to which you can send requests and see the results all nicely formatted for you.

[^requestbin]: Evidently I could have used <https://requestbin.com> for the same purpose.

<figure><img src="/images/LearningTestsForPostingEmailFromMailgun/SampleOutputBinMailgunNet.png" /><figcaption>Pretty, no?</figcaption></figure>

With this, I have documentation of one half of the contract between Mailgun and my Sinatra application, namely the contents of the `POST` request representing the incoming email, but what about the contract of the response? I found this in the documentation.

> For Route POSTs, Mailgun listens for the following codes from your server and reacts accordingly:
>
> + If Mailgun receives a 200 (Success) code it will determine the webhook POST is successful and not retry.
> + If Mailgun receives a 406 (Not Acceptable) code, Mailgun will determine the POST is rejected and not retry.
> + For any other code, Mailgun will retry POSTing according to the schedule below for Webhooks other than the delivery notification.
>
> If your application is unable to process the webhook request but you do not return a 406 error code, Mailgun will retry (other than for delivery notification) during 8 hours at the following intervals before stop trying: 10 minutes, 10 minutes, 15 minutes, 30 minutes, 1 hour, 2 hour and 4 hours.

Excellent. I have enough information about the contract between Mailgun and a `POST` handler that I can design my Sinatra application. I can even test-drive it! (Don't mind the diagram. I promise that I'll return the appropriate HTTP status code when things go wrong.)

<figure><img src="/images/LearningTestsForPostingEmailFromMailgun/MailgunSinatraIntegrationDesignSketch.png" /><figcaption>I loves me some Plain Ruby!</figcaption></figure>

## Uh... Where Are the Learning Tests?

I ran them manually. I suppose I could have automated them, but I don't see the value. If I notice behavior that seems not to conform to the contract I've discovered here today, then I'll fire up RSpec; for now, this will do.

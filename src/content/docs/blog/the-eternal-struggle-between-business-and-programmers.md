---
title: "The Eternal Struggle Between Business and Programmers"
date: 2013-11-11
lastUpdated: 2017-11-21
tags:
  - Simple Design
  - Surviving Legacy Code
  - Not Just Coding
excerpt: >
  The business wants more features, but the programmers want to refactor. What if I
  told you that both groups want the same thing?
# image: "/images/7m26s-sketchnote-DerekGraham.jpg"
---
At Øredev 2013, I asked managers to tell me what makes their job difficult. I spoke to one manager who told me that they face immense pressure on two fronts: from the board of directors to deliver more features more often and from the programmers to give them more time to refactor. I've heard dozens of stories like these over the years and I've found a trick that helps. It doesn't _resolve_ the problem, but it helps take a significant step in the direction of a resolution.

Warning. You almost certainly have more to deal with in your exact situation than this advice can cover. You might need some more direct help. I can offer that to you, but for now, read on.

<!-- more -->

I call it the *eternal struggle between the Business and Programmers*. Specifically programmers, because I almost always hear the specific complaint coming from them. It goes like this.

> Business: More features! Now!

> Programmers: More refactoring! Now!

It usually involves more colorful language, more intense emotions, and repeats a few times, but it boils down to this. I notice a few things about this particular exchange.

First, the Business can easily justify their position: they need profit, and profit comes from sales, and sales come from features, and features come from, among other people, the Programmers. Without more profit, nobody keeps a job.[^enough-profit] Clearly, the Business has this one right.

[^enough-profit]: I'll leave aside the question of "enough" profit for another time.

Next, the Programmers can easily justify their position: they need to deliver more features, and they can't deliver features if they don't understand the code, and almost nobody writes code clearly the first time, so the Programmers need to edit their work, and they call that editing "refactoring". Without refactoring, features don't flow, the Business has nothing to sell, we can't generate profit, and nobody keeps a job. Clearly, the Programmers have this one right.

Unfortunately, the Business only sees that the Programmers used to deliver features more quickly, and now they want to slow down. This creates obvious tension. This tension slowly pervades every aspect of the relationship between the Business and the Programmers. It obscures something important. I'll come back to that.

<p class="aside" markdown="1">Somehow everyone has ignored that the Programmers are slowing down _anyway_, because the code gradually forces them to slow down. Interesting.</p>

So the Business needs features to sell, but the Programmers want to slow down. The Business needs to feed a market that expects more features sooner, but the Programmers need to feed a design that demands cleanliness as a condition for adding new features as a steady pace. Thus, the eternal struggle, because **it has always been thus**.

## Help Us Help You!

The Programmers plead: "If only you'd let us refactor! We have a sick design; it actively prevents us from adding features sensibly. It encourages us to do the wrong things. It encourages us to duplicate code, which makes mistakes seem inevitable. It has code that nobody understands any more, and so when we have to change it, we need weeks to read, to research, to gain confidence that changing it won't anger our existing customers. If you'd let us refactor, then we could spot design improvements that would unblock new features, that could reduce the cost of new features by 20%, 30%, 40%, and more! Why don't you let us refactor?!" They appear to have a point.

The Business pleads: "If only you'd stop with this refactoring nonsense! The economy has to grow. We have to grow. The board of directors yells at the vice presidents, who yell at the third-line managers, who yell at the second-line managers, who yell at us. More features! More features! They only want more features! Not only can they not afford for you Programmers to slow down, but they need you to speed up! *I* need you to speed up! What do you go faster?!" I don't envy their situation.

## The Central Conflict

If you're a Programmer, then imagine yourself in the position of the Business. The Business relies completely on Programmers (among other people) for its survival. I imagine the Business finds this imbalance uncomfortable, even threatening. Without the Programmers, the Business has nothing to sell. Worse, at the source of this tension we find a haphazard, slow stream of half-working, not-quite-what-we-wanted features. It doesn't matter that the Programmers can easily justify their behavior, because the Market doesn't like the results, and as soon as the Market has an alternative, it disappears, and nobody keeps a job.

What can we do?

<p class="aside" markdown="1">I have to admit that the programmer in me loves that a cyclic dependency lies at the center of this conflict.</p>

## The Phrase That Pays

**Refactoring reduces the volatility in the marginal cost of features!** It smooths out the design, distributing the problems more evenly. It helps the Programmers make many small easy-to-clean-when-needed messes, rather than several small-to-large we-have-to-stop-the-line-to-go-any-further messes. It also helps the Programmers identify game-changing structural improvements that they might not otherwise see&mdash;the kind that reduce the cost of future features by 20%, 30%, 40% and more. Refactoring even helps eliminate many classes of annoyingly-costly mistakes. (You might call them "bugs".) **As certainty in the cost of features goes up, the overall cost of features tends to go down**. This short talk describes how refactoring and the cost of features relate to each other:

<figure class="body-text-block">
<div class="embedded-video-container">
<iframe class="embedded-video" src="https://www.youtube.com/embed/WSes_PexXcA?rel=0" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
</div>
<figcaption><a href="https://www.youtube.com/watch?v=WSes_PexXcA">7 minutes, 26 seconds, and the Fundamental Theorem of Agile Software Development</a> from <a href="https://www.jbrains.ca">J. B. Rainsberger</a></figcaption>
</figure>

<script type="text/javascript">
// Fucking absurd hack, because I don't know how to make
// Node.js modules import "plain" (non-Node) Javascript
// source files
var module = { exports: [] };
</script>
<script type="text/javascript" src="/javascript/toggle.js"></script>
<script type="text/javascript">
var sketchnoteDisplayPeer = { displayState: "none" };
var transcriptDisplayPeer = { displayState: "none" };

function toggleSketchnoteFor7m26s(document) {
  toggleDisplayFor(document.querySelector("#sketchnote_7m26s"), sketchnoteDisplayPeer);
}

function toggleTranscriptFor7m26s(document) {
  toggleDisplayFor(document.querySelector("#transcript_7m26s"), transcriptDisplayPeer);
}
</script>

(If you prefer to read a transcript of this talk, [click here](javascript:toggleTranscriptFor7m26s(document)).)

(If you'd like to see a sketchnote of this talk, [click here](javascript:toggleSketchnoteFor7m26s(document)).)

<div id="transcript_7m26s" style="display: none">
<pre>
{% include 7Minutes26Seconds/transcript.txt %}
</pre>
</div>

<div id="sketchnote_7m26s" style="display: none">
![A sketchnote from [Derek Graham](//twitter.com/deejaygraham)](/images/7m26s-sketchnote-DerekGraham.jpg)
</div>

## Why "The Problem" Is A Problem

Over time, the Business has coerced the Programmers into stealing future capacity by pressuring them to not cultivate a healthy design. They have probably done this for a long time. Don't blame the Business for this: the Industry has largely taught them to do it. On the other hand, the Programmers haven't used a particularly meaningful defence: they've appealed to arguments based on some abstraction notion of craftsmanship. Some Businesses want to buy craftsmanship; others need features *now*![^fn2]

[^fn2]: Let me be very, very clear: I support the software craftsmanship movement, because it takes a pragmatic view of craftsmanship. Just because they call it "craft" doesn't give them licence to take all the time in the world, and a competent, caring software craftsperson will not do this. Even so, a typical Business reaction to the notion of "craft" is "artisan", a Greek word meaning "slow and expensive".

Now, we can realize something significant: **The Business and the Programmers want the same thing**. They want the same thing: to deliver a more predictable stream of important features that will make the market happy&mdash;or, at least, knowing the fickle market, that will risk disappointing them the least.

This. Is. Glorious.

## Mending The Rift

The Business and the Programmers need to agree on two things, **each conceding a key point to the other**. The Business needs to agree that the Programmers have been going **more quickly than they really can**, that they cannot sustain this pace, and that trying to do it leads to disaster. We are driving in a car accelerating towards a brick wall. The Programmers need to agree that the Business has a legitimate need to deliver more features, that everyone's livelihood depends on this, and that **"it's the Business' job" to ask for more than the Programmers can ever deliver**. The market compels them to do this&mdash;if it doesn't, then where does the revenue come from? In this equation, the Programmers have the responsibility to do whatever they can to maximize their **ongoing** delivery speed, and that includes regular, aggressive refactoring.

Finally, both the Business and the Programmers have to agree that they have wasted too much time arguing about this and need to move forward. They want the same thing! They can have it!

Thus, I propose a kind of detente. The Business agrees to remember that the Programmers always try their best to go at a fast-but-sustainable pace. The Programmers agree to remember that the Business also feels threatening pressure to perform, and that they don't feel comfortable relying so much on the Programmers for their success. Each group needs the other desperately, and together they all want the same thing.

...and let's not forget the Testers and Operations and other departments. If we listen to each other, we'll realize that we all want the same things, and together, we can make things so much better.

{% include jbrains-experience-offer.markdown %}

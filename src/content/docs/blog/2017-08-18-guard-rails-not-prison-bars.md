---
title: "Guard Rails, Not Prison Bars"
date: 2017-08-18 12:00 -0400
tags:
    - Simple Design
excerpt: >
    By following a few simple design principles,
    you can make code safe to use without making
    it difficult to examine nor adapt to new
    purposes. Give me guard rails, not prison bars!
---

A recent experience with a hotel coffee machine illustrated one primary difference of philosophy related to software design. It's a Keurig machine and my wife Sarah was figuring out how to use it to make coffee. She noticed that when she inserted a K-Cup (the little containers of coffee), then the lid for the water reservoir popped open, so that she could fill it with water. At first, that seemed helpful, but immediately, I wondered about being able to open that reservoir even without inserting a K-Cup. As far as we can tell, it can't be done. Not only that, but since Sarah needed to walk across the hotel room in order to fetch water from the bathroom sink, by the time she returned to the coffee machine to finish the _approved Keurig machine workflow_, the machine did nothing. She immediately told me that she couldn't tell the difference between the machine heating up slowly and doing nothing. What had she done incorrectly? We presumed that she had taken "too long" (Why should this matter? Why is there a time limit on making a cup of coffee?) and that the machine needed to start the _approved Keurig machine workflow_ again. This meant turning the machine on (Why?), opening and closing the K-Cup compartment _only in order to then_ close the water reservoir lid _only in order to then_ push the "brew" button. From what I can tell, for no good reason, we needed to run the _approved Keurig machine workflow_ twice in order to compensate for some design element (the machine "timed out", we guess) that seems to me entirely irrelevant to the task of brewing coffee.

And I immediately thought of programmers making in-house workflow frameworks or multi-step UI wizards for their enterprise. And I sighed.

## Give Me Guard Rails, Not Prison Bars

When you design a workflow of any kind, please design the workflow as guard rails--protective guidelines for how to compose the individual steps into a useful way--instead of as prison bars--locking the individual steps into place either through data hiding or, worse, through tangled dependencies on shared memory. If you design the workflow as guard rails, then I get the best of both worlds: automatic protection against making a mistake when putting the steps together, but the freedom to execute and evaluate (test! check!) the individual steps without being forced to execute them in the workflow. _This last difference matters most to me._ When you give me prison bars, you force me to run the workflow in order to check the steps. This leads me towards integrated tests, which we know [are a scam](https://integrated-tests-are-a-scam.jbrains.ca). When you instead give me guard rails, you let me execute the individual steps outside the workflow, which gives me two benefits: the ability to learn how the steps work without dragging the entire workflow into the exercise _and_ the option to use the steps to solve other problems outside the originally-intended workflow. _You_, the programmer designing the original workflow, can take advantage of both these benefits! Imagine if you find out that clients are using your steps in novel ways, then that might give you ideas for new features to sell to your market. Moreover, not having to run all your tests through the workflow makes it cheaper to gain more confidence in the correctness of the steps.

Finally--and I know I'm late to the party on this--focusing more on the correctness of the steps and less on the overall workflow might nudge you in the direction of using really simple mechanisms to collect steps into workflows, such as the dependable "compose functions" operation that lies at the heart of functional programming. You don't need to program in Haskell to build dependable function pipelines: you can do it with methods in Java, too. Many of your "workflows" can easily be turned into method pipelines, and once the steps seem solid, the simplest workflows become [Too Simple to Break](#references).

## The Keurig Without Prison Bars

Returning to our ersatz-coffee machine, I asked Sarah whether there was any way to open the water reservoir without closing the K-Cup compartment. She found none. We could remove the prison bars by adding a little button to pop open the water reservoir, while still making it possible for closing the K-Cup compartment to have the same effect. (I'm no engineer, but I don't think I'm significantly underestimating the effort involved in designing the machine to do this.)

If I've put a K-Cup in the compartment, then waited "too long" (Why?!?) to pour water in the back, I don't want to have to re-open the K-Cup compartment just to convince the machine that it's safe to pour in water! I've worked with similar machines where, when you try to open to the coffee-pod compartment, it assumes that you've just brewed coffee, and so it disposes of the unused coffee pod! Why should I waste any energy on figuring this out?! Just let me pour water whenever I think I need it without being forced to understand how the rest of the workflow works!

If you force me to use the machine only to brew coffee, then you force the hotel to provide a kettle for boiling water separately for other drinks. If you take away the prison bars, then I can use the same machine to dispense hot water, which I can use on those nights when I need to drink some powdered cold-symptom drugs in order to have enough relief from nasal congestion to fall asleep. Remove the prison bars and you get this extra behavior _free_. Keep the prison bars in place and either I need to duplicate the equipment or, more likely, the hotel simply makes it impossible for me to get to sleep. Sleeping is, you should know, the primary benefit I want from a hotel room.

## The Best Of Both Worlds

I recommend designing software elements so that:

+ We can execute them individually, so that we can check them thoroughly and rearrange them into useful systems.
+ We see a clear way to put them together into standard workflows, either using Template Method or by designing the steps to assemble into an obvious pipeline (the output each of function becomes the input to the next).
+ The elements depend less on their context, so that for example we don't assume that they all _must_ talk to the same shared data source, even if that's how we _expect_ to use them for now. (Some day someone will read about CQRS and want to split queries and commands into different data sources. Guaranteed.)

This way, you get the best of both worlds: we know how to assemble the elements into the workflows we need now without restricting how we might adapt them to future uses. If it seems to you that the elements will be difficult to use unless they are put together in the exact workflow that you have in mind, then I encourage you to interpret that as a sign that they depend too much on their collective context. In this case, apply the [Dependency Inversion Principle](https://dependency-inversion-principle.jbrains.ca) to improve the situation. I also encourage you to try to design the elements to be easily composed, in order to take pressure off checking the workflow. Also remember that, if you want to check the workflow, then you can always stub the steps that you're not checking and set method expectations on the step you're checking. This way, you can write a test like "if step 2 raises error X, then we don't run step 3, but instead skip to step 4" without worrying about any of the details of what steps 2, 3, and 4 otherwise do. This makes even the workflows potentially reusable!


## References

J. B. Rainsberger, ["Too Simple to Break"](https://junit.org/junit4/faq.html#best_3).

J. B. Rainsberger, [Articles on the Dependency Inversion Principle](https://dependency-inversion-principle.jbrains.ca). A series of articles describing the principle and its consequences.

J. B. Rainsberger, ["How Reuse Happens"](/permalink/how-reuse-happens). "If you want reuse, you have to make it happen." I describe an example of how following some basic low-level design principles helps lead me towards more reusable code. Reuse is not a fantasy, but it requires effort.

---
title: "Let Code Flow Towards Better Design"
date: 2014-08-22
tags: []
---
I think that programmers worry far too much about design.

No, I don't mean that they should care less about design. I think that programmers worry so much about design that they forget to just program. As they try to learn more about how to design software well, they become more reluctant to write code, fearing that "it won't be right". I think that we contribute to this reclutance by writing articles with a tone that implies _don't write code unless you write it my way_. I don't think we mean to do this, but we do it nonetheless.

What if we thought about design a slightly different way? Let's not think about design principles as constraints for how we write code, but rather as suggestions for _how code wants to flow_. Focus your energy first on writing correct code, then use the principles of design that you've learned to guide the flow of code from where you've written it to where it seems to belong. If you prefer a more direct metaphor, then imagine you're writing prose. Rather than obsessing over the rules of grammar on your first draft, use them to guide how you edit. Let yourself more freely write your first draft without fear of "getting it wrong", then use your editing passes to fix grammar errors, improve clarity and elevate style.

Now you've probably heard this before. "Make it work, then make it right, then make it fast." This constitutes the same advice. So why repeat it? You probably also know that sometimes we need to hear the same advice in a variety of forms before we feel comfortable using it. I've been talking in my training classes about "code flow" for a few years, and it seems to help some people feel more comfortable adopting an evolutionary design approach. In particular it helps some programmers avoid feeling overwhelmed by design principles to the point of not wanting to write any code at all, for fear of "doing it wrong". After all, the more we say that "code is a liability", the more people will tend to think of writing code as an evil act. That sounds extreme, but so does some of our rhetoric!

When I teach software design&mdash;usually through test-driven development&mdash;one or two people in the class commonly ask me questions like "Can I use set methods?" or "Can I write a second constructor?" which convey to me a feeling of reluctance to "break the rules". I really don't want my course participants to feel like I want to stop them from writing code; on the contrary, I want them to feel more comfortable writing code precisely because they can apply their newly-learned design pricniples to improve their designs easily and quickly over time. I expect them to feel *less* fear as their design skills improve, because no matter what crap they write in the morning, they can mold it into something beautiful in the afternoon. I have to remind *myself* to approach code this way, rather than worrying too much about "getting in right the first time".

## An Example

Consider [this article on the topic of encapsulation](https://link.jbrains.ca/1ohWsSr). I like it. I think it explains a few key points about encapsulation quite well. Unfortunately, it includes a line that, out of its context, contributes to this fear-based mindset that I've seen so often:

> If you ever use a setter or define an attribute of a component from the outside, you're breaking encapsulation.

I remember myself as an inexperienced programmer trying to improve at my craft. That version of me would have read this sentence and thought _I must not use setters any more._ This would invariably lead me to a situation where I would refuse to write a setter method, even when I have no other option. (Sometimes tools get in the way.) This way lies design paralysis. **When I've written over the years about design principles, I've certainly not wanted to make it harder for you to write code.** 

## What Should I Do, Then?

Later in the same article, the author writes this:

> It's common in Rails projects to use patterns such as `User.where("something = something_else")` from controllers or service classes. How do you know the internal of the database to be able to pass that SQL parameters? What happens if you ever change the database? Or `User`? Instead, `User.some_method` is the way to go.

I agree to the principle and the example. I would, however, like to highlight a different way to interpret this passage. **Rather than** thinking, "I should never write `User.where("something = something_else")`", **think of it this way instead**:

> *I'll write `User.where("something = something_else)"` for now, just because I know it should work, but I probably shouldn't leave it like that once it's working.*

Don't let design guidelines (like *improve encapsulation*) stop you from writing the code you need to write in the moment (as a first draft), but rather use them to guide the next steps (your editing). Don't let design guidelines stop you from getting things working, but rather use them to stop you from leaving freshly-written legacy code behind.

## So What's This About Code Flow?!

Many programmers offer suggestions (for varying meanings of "suggest") for where to put code. Some programmers write frameworks to try to constrain where you put code, lest you make (what they consider) silly mistakes. This eventually leads even experienced programmers into situations where they feel like they're stuck in some [Brazilesque bureaucracy](https://link.jbrains.ca/1AEvAEQ) preventing them from writing the one line of code they need to make something work. (You need a controller, a model, a DTO, a database client object, ...) Instead of thinking of "the right place to put things", I prefer to offer suggestions about how to move code closer to "where it belongs".

Going back to the previous example from that encapsulation article, I would certainly have no problem writing `User.where("role = 'admin'")` directly in a controller just to get things working, but I just know that if I leave the design at that, then I will have set a ticking time bomb for myself to explode a some unforeseen and, almost uncertainly, inopportune time. As a result, once I get my tests passing with this poorly-encapsulated code, then I can take a moment to look at that code, ask *what does this mean?*, realize that it means "the user is an admin", then extract the function `User.admin?`. In the process, the **details** in this code will have **flowed** from the controller into the model, where they seem to belong.

I have found this pattern repeating itself in all the major application frameworks I've ever used: while learning the framework I put code directly into the controller/transaction script/extension point, and after I've written several of these and found them difficult to test or change, the details flow into more suitable components, often representing a model or view (or a little bit of each). **By understanding my design principles in terms of where code ought to flow, I get the benefits of better design without the paralysing fear that I might "get it wrong".**

So if you need to break encapsulation, just for now, just to get something working, then do it. Just don't leave it like that.

## References

Alexandre de Oliveira, ["Complexity in Software 2: Honor Thy Encapsulation"](https://link.jbrains.ca/1ohWsSr). In this article, Alexandre talks about "real" and "perceived" complexity in software design, which seem to me to relate to Fred Brooks' concepts of "essential" and "accidental" complexity. He also includes a definition for *encapsulation* that I hadn't read before, and that I quite like. Enjoy the article.

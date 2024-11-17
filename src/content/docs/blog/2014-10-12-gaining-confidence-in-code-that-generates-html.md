---
title: "Gaining Confidence in Code that Generates HTML"
date: 2014-10-12
tags: []
# excerpt_separator: <!--more-->
---
How do I gain confidence in code that generates HTML, such as tag libraries or view templates?

Well, it depends on what I'm trying to do. 
<!--more-->

**Am I learning how an existing tag library works?** If so, then I create a bare project, install the tag library, use it to generate some HTML, then use something like HTMLUnit[^age] (any HTML parser will do) to check the results. This way, I can explore all the features that the tag library has without mixing those tests up with the tests for my project's core behavior. I can use what I learn from these Learning Tests[^learning-tests], meaning the **contract of the tag library features that matter to me**, to write tests for my core behavior that make safe&mdash;well, _safer_&mdash;assumptions about what the tag libraries do.

[^learning-tests]: Tests that I write to document how a library behaves. When they pass, then I understand what the library does; when they fail, I don't. Michael Feathers also refers to _characterization tests_, which characterize what the code does, rather than specify what we want the code to do.

[^age]: I know that I'm showing my age here, but I was there when HTMLUnit was born, so I like to mention it every now and then.

**Am I creating my own tag library?** I typically create custom tags by extracting duplication from HTML, so whatever tests I already have for HTML indirectly test my custom tags. Once I extract enough behavior into a little group of custom tags, then I begin to feel like I have a proper, reusable library[^reusability-happens], and then I treat it exactly like I do any existing tag library, so this reduces to my answer above.

[^reusability-happens]: Reusability happens when we make it happen.

**Am I testing other view code that generates HTML, meaning not a tag library?** In this case, I make sure to separate that code from the rest of the system. In particular, I don't want to have click-click-click in order to get to the right page so that I can check the resulting HTML. If I have to click-click-click, then I've clearly [violated the Dependency Inversion Principle](https://link.jbrains.ca/1vWUxKA), since the view depends on its invoker, the controller.

<aside markdown="1">Please note that automating this click-click-click with something like Selenium doesn't make this problem go away; it merely makes it easier to tolerate the problem... for a while.</aside>

This means finding a way to render my HTML template directly without invoking the rest of the application. How to do this varies from framework to framework, or from library to library. It's one of the reasons that, way back in the 2000s, I preferred using an HTML template engine like [Apache Velocity](https://velocity.apache.org/) over using JSP. I never did figure out how to reliably render a JSP without involving the rest of the web container and its nonsense. Are there any standalone JSP engines now? I don't know.

I know that [RSpec does this well for Rails](https://github.com/rspec/rspec-rails). I can simply render a view template with whatever data I desire, and I never have to invoke a controller nor run the rest of the system. Now *how* RSpec-Rails does this amounts to killing kittens, but that's mostly because Rails likes coupling everything to everything else and expects you to like it, too. I try to ignore the mewling of dying kittens as I run my view specs.

## The Two Key Points

**To check the HTML that X generates, run X without running the things that invoke X.** (Dependency Inversion Principle.) This is true for X = JSP processor; X = HTML template engine; X = whatever. Write a test like this:

```
htmlAsString = render(template, dictionaryOfDynamicDataToDisplayOnTemplate)
htmlDocument = htmlParser.parse(htmlAsString)
assert whatever you like about htmlDocument
```

As you do this, you **describe the contract of the view**. You can use this information to check that the controller puts the right data in the right view template variables without having to run the controller and view together.

For example, if you know that your view expects the scripting variable `customers` with a collection of `Customer` objects, then your controller tests can check that it puts a valid (non-`null`) collection of `Customer` objects wherever the view rendering engine will look for the scripting variable `customers`. In the Spring WebMVC world&mdash;and I realize I'm old&mdash;this meant the `customers` key in the model `Map` inside the `ModelAndView` object that the controller returns from its `handleRequest()` implementation.

**Don't test a tag library by testing your application**. If you want to test the tag library, then test it in isolation. This also applies to learning about the tag library by writing Learning Tests for it.

When you want to use a tag library, you think about which features of it you want to use and how you expect those features to behave. You can probably explore those more thoroughly by not limiting yourself to the exact context in which you plan to use that tag library feature right now. You'll probably learn more than simply trying to get the current thing working that you want to get working. This helps you better understand which part of the tag library's contract your application will depend on. You will find this useful, I promise.

<aside markdown="1">Notice that, in what I've just written here, you can substitute "tag library" for other generic services like "database driver".</aside>

## References

J. B. Rainsberger and Scott Stirling, [_JUnit Recipes_](https://manning.com/rainsberger/). In particular, chapter 12, "Testing Web Components" covers a lot of this ground. Even if you don't use JUnit, the principles apply.

J. B. Rainsberger, ["Demystifying the Dependency Inversion Principle"](/permalink/consequences-of-dependency-inversion-principle). A few different ways to think about this principle, as well as what it means for your ability to test your code.

Michael Feathers, [_Working Effectively with Legacy Code_](https://link.jbrains.ca/jdXMTy). Still the classic text on legacy code, in which he discusses characterization tests. Some modern libraries make it easier to write these kinds of tests, like [TextTest](https://texttest.org) or [ApprovalTests](https://blog.approvaltests.com/).

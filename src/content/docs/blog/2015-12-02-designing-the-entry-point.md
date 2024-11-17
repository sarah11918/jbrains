---
title: "Designing the Entry Point"
date: 2015-12-02 14:58 +0200
tags:
  - Dependency Inversion Principle (DIP)
---
The entry point. Sometimes it's `main()`. Sometimes it's an extension point in some complicated framework. Most importantly, it is the border where Their Stuff runs Your Stuff. When I see entry points in other applications, I don't see a lot of evidence of having thought about the design much. It becomes a kind of junk drawer for code. This happens especially when programmers are working in environments they don't feel particularly comfortable in. (I don't know where to put things, so I'll put them here, since that seems to work.)

<p class="highlight" markdown="1">I use the entry point of an application (or a component, but it's the same) as the place to wire up my graph of modules (these days, usually objects) and connect my request handlers to the incoming pipeline of requests.</p>

That sounds fancy, but in the case of a command-line interface, the incoming pipeline of requests is simply text over standard input, and in the case of a web application, the incoming pipeline of requests is however the framework presents incoming HTTP requests to my code: somewhere between raw requests and nice little bundles of data, neatly structured and sometimes already well-parsed into meaningful data types!

But really, that's it. Nothing else happens in the entry point in my designs. I connect my request handlers (often there's only one, but sometimes many) to the "inbox" of requests, so that I can handle requests. In order to do this, I need to "assemble" my application by connecting all the concrete modules to each other. In object-oriented programming terms, that means instantiating all the services and connecting them together. My entry points do nothing more complicated than that. (That's plenty complicated as it is.)

## An Example

I recently taught the World's Best Introduction to Test-Driven Development "live and in person". (I still do that, but my [online training](//tdd.training) is a great option for people who don't want to wait for me to get on a plane and visit them.) Here's a diagram to show the structure.

<figure><a href="//images.jbrains.ca/DesigningTheEntryPoint/diagram-1.png"><img src="//images.jbrains.ca/DesigningTheEntryPoint/diagram-1-600w.png" /></a><figcaption>The entry point only wires all these objects together, then "presses go" (invokes `process()`)</figcaption></figure>

Once we extract the anonymous implementation of `Display` into the production class `ConsoleDisplay`, we see that `main()` does nothing except wire up the objects and connect `Thing` to `System.in`. In my opinion, as it should be.

What's in _your_ entry point that probably doesn't need to be exactly there? Remember: if it's in the entry point, then you need to run the whole application (and maybe even redeploy it) in order to check it!

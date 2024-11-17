---
title: "Injecting dependencies doesn't have to hurt"
tags:
  - Dependency Inversion Principle (DIP)
---
I have noticed a recent swell of comments about the pain of dependency injection, and if this has caused you problems on your project, then I think I can help you by offering a few simple guidelines and a single goal for injecting dependencies.

<h2>The guidelines</h2>

<p>I have formulated these as <a href="https://bit.ly/sYj5Y" target="_blank">Novice or Advanced Beginner</a> rules, and so I have worded them more strongly than I tend to word my advice.</p>

<ul><li>When in doubt, inject each dependency directly into the method that requires it.</li>
<li>Only when you inject the same dependency into multiple methods of the same class, move the parameter into the constructor.</li>
<li>Do not use so-called &#8220;setter injection&#8221; except as an intermediate step in a refactoring aimed at injecting the dependency into a method or the constructor.</li>
<li>Stop using the Service Locator pattern, and instead inject the service into the client.</li>
<li>Stop instantiating collaborating services (in the <a href="https://bit.ly/gyLuWK" target="_blank">Domain-Driven Design sense</a>), and instead inject those services into the client.</li>
<li>When a constructor parameter list becomes uncomfortably long, split the class so that the new classes&#8217; constructor parameter lists don&#8217;t overlap.</li>
<li>If you notice a class using the same dependency through two different object graph routes, split the class so that the new classes receive the dependency directly in their constructors.</li>
<li>If you notice a class using groups of dependencies at different times, split the class so that the new classes only use each cohesive group of dependencies.</li>
</ul><p>All these guidelines have their roots in &#8220;remove duplication&#8221; and &#8220;fix bad names&#8221;, two of the <a href="https://bit.ly/g9P6Jw" target="_blank">four elements of simple design</a>.</p>

<h2>So why inject dependencies at all?</h2>

<p>Some people inject dependencies in order to stub, mock or spy on a method for testing. I used to use that as a primary motivation, but over the years that motivation has evolved into something more widely useful. I inject dependencies for one reason: to move the things that change in the direction of the client and the things that don&#8217;t in the direction of the supplier. Or, if you prefer, &#8220;abstractions in code, details in data&#8221;. Or, if you prefer, to avoid abstractions depending on details. Any of those will do.</p>

<h2>You don&#8217;t buy it?</h2>

<p>No problem. I&#8217;ll write more articles in this space showing examples of each of the guidelines, and you&#8217;ll have plenty of opportunity to share your opinions about them.</p>

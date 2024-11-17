---
title: "Use Your Singletons Wisely: Ten Years Later"
date: 2011-03-01
lastUpdated: 2022-09-22
tags:
  - Dependency Inversion Principle (DIP)
---
<p>I recently received this comment at IBM DeveloperWorks about my now-very-old article, <a href="/assets/use-your-singletons-wisely-original.pdf">Use your singletons wisely</a>. I really like knowing that people continue to read that article, since it was the first I published online somewhere other than my own web site.</p>

<p>Brent Arias, also known as <strong>mystagogue</strong>, wrote:</p>

<blockquote>
<p>There is such a thing as singletons, in some languages, that can be “property” dependency injected, which essentially nullifies the suggested reason (viz. testability) for avoiding them (I do this with C#). Also, Liskov Substitution is not violated by singletons, because Liskov Substitution does not apply to constructors (which in part is why there is no such thing as “virtual constructors”). Finally, dependency injection is not without its own hazards. For example, many interim classes are forced now to take dependencies they don’t need, simply to pass them on to child classes which do need them. As such, dependency injection actually increases coupling between classes!!!</p>
</blockquote>

<p>I’d like to thank Brent for his comment. Of course, I didn’t know then what I know now, so I  didn’t mention the points that Brent raised in his recent comment. I’d like to address those points now.</p>

<h1>The Testability Problem</h1>
<p>First, Brent says that since he can inject a dependency through a property in C#, there is no testability problem. I disagreed with this in JUnit Recipes, recipes 14.3 and 14.4, which cover testing singletons and their clients. I agree that being able to inject the singleton instance makes run-time substitution in the tests possible, it defeats the purpose of designing the class as a singleton. Yes, you can resort to making the <code>setInstance()</code> method or <code>Instance</code> property writable only in the tests, but this serves only to complicate the design, rather than simplify it, and so I’d typically prefer to use this as an intermediate step towards a simpler design.</p>

<h1>About LSP...</h1>
<p>Next, Brian says that since the Liskov Substitution Principle does not apply to constructors, then a singleton-based design does not violate the principle. I had never thought about this before, so I researched the topic a little. The principle states that any property provable about a type must also be true of any subtype of that type. I suppose that, since constructors belong to the type class and not objects of the type, then Brent is correct: LSP does not apply to constructors. Even so, I had written this:</p>

<blockquote>
<p>[…] any change in how the supplier class is instantiated ripples into the client class. This violates the Liskov Substitution Principle, which states that you should allow any application the freedom to tell the client class to collaborate with any subclass of the supplier.</p>
</blockquote>

<p>I had written about the consequences of LSP, and not the principle itself, in rather a sloppy fashion. While one can subclass a singleton in a way that respects LSP, in order to use that subclass, one would have to make a choice between two poor alternatives: change clients to invoke <code>Subclass.getInstance()</code> instead of <code>Superclass.getInstance()</code> or change <code>Superclass.getInstance()</code> to become a proper Factory (in the Design Patterns sense) for the <code>Superclass</code> hierarchy. <strong>Choosing the first option violates the benefit of LSP</strong>, if not LSP itself: when you violate LSP you make changes that ripple out into your client, and so to avoid affecting your client, among other things, respect LSP. Choosing the second option leads you to a Singleton/Factory hybrid in which <code>Superclass</code> knows about <code>Subclass</code>, violating even more fundamental design principles, like Open/Closed. I don’t like either choice. <strong>I wish I had written this instead of what I wrote in the original article.</strong></p>

<h1>I Just Don't Have This Problem</h1>
<p>Finally, Brent says that, with dependency injection, “many interim classes are forced now to take dependencies they don’t need, simply to pass them on to child classes which do need them”. I agree with Brent, but strongly point out that dependency injection uncovers symptoms like these of deeper design problems, rather than creating these design problems in the first place. Unfortunately, I don’t have a concrete example to offer you, so I have to resort to one of those hopelessly abstract examples. I hope you’ll bear with me. If I find a better example, I’ll use it.</p>

<p>Consider three classes, unimaginatively named <code>A</code>, <code>B</code> and <code>C</code>. In our design, <code>A</code> uses <code>B</code>, and then <code>B</code> uses <code>C</code>. Since this design doesn’t yet inject dependencies, we have something like this:</p>

<pre><code>class A {
  public A() {
    this.b = new B();
  }
}

class B {
  public B() {
    this.c = new C();
  }
}
</code></pre>

<p><strong>So far, so good.</strong> (Well, not really, but good enough for now.) Now we want to switch to a dependency injection-based design to make it collaborators more pluggable. (I won’t bother with the reasons here; in a purely abstract example, there are no reasons.) This means that I first inject <code>C</code> into <code>B</code> through its constructor:</p>

<pre><code>class B {
  public B(C c) {
    this.c = c;
  }
}
</code></pre>

<p>Now <code>A</code> needs to give <code>B</code> a <code>C</code>, but where does the <code>C</code> come from?</p>

<pre><code>class A {
  public A() {
    this.b = new B(new C());
  }
}
</code></pre>

<h2>The Problem, as Brent Describes It</h2>
<p>This doesn’t look right, so we <em>could</em> decide to make the client give <code>A</code> a <code>C</code>, so that <code>A</code> can pass that on to <code>B</code>:</p>

<pre><code>class A {
  public A(C c) {
    this.b = new B(c);
  }
}

class Client {
  someMethod() {
    A a = new A(new C());
  }
}
</code></pre>

<h2>If Injecting Worked Once...</h2>
<p>But now, of course, we have the case where <code>A</code> knows about <code>C</code> even though <code>A</code> doesn’t use it directly. If I understand Brent correctly, then this is his objection. One problem: why does <code>A</code> create the <code>B</code> directly? Why not inject that, too?</p>

<pre><code>class A {
  public A(B b) {
    this.b = b;
  }
}
</code></pre>

<p>Now the client, which was already creating a <code>C</code>, simply creates a <code>B</code>, too:</p>

<pre><code>class Client {
  someMethod() {
    A a = new A(new B(new C()));
  }
}
</code></pre>

<p>This way, <code>A</code> need not know anything about <code>C</code>, although if <code>A</code> eventually does need to use <code>C</code> directly, it can easily do so:</p>

<pre><code>class Client {
  someMethod() {
    C c = new C();
    A a = new A(new B(c), c);
  }
}
</code></pre>

<p>This duplication, however, leads me to ask a few questions:</p>

<p><strong>Do <code>A</code> and <code>B</code> use <code>C</code> differently?</strong> If they do, then maybe I should split <code>C</code> into two classes, <code>D</code> and <code>E</code>:</p>

<pre><code>class Client {
  someMethod() {
    A a = new A(new B(new D()), new E());
  }
}
</code></pre>

<p><strong>Do <code>A</code> and <code>B</code> use <code>C</code> for a similar reason?</strong> If they do, then maybe <code>A</code> and <code>B</code> duplicate some effort. Since <code>A</code> is <code>B</code>’s client, I would probably move that behavior from <code>B</code> to <code>A</code>, so that <code>B</code> no longer uses <code>C</code> at all:</p>

<pre><code>class Client {
  someMethod() {
    A a = new A(new B(), new C());
  }
}
</code></pre>

<p>Is there some combination of both? If so, then likely I need to do both. Fortunately, that’s just another formulation of the first possibility.</p>

<p>There might be more questions, but that will do. While injecting the dependency appeared to make the classes more tightly coupled, it simply <strong>revealed the coupling that already existed</strong>. <code>A</code> was already tightly coupled to <code>B</code> and <code>B</code> to <code>C</code>. When we tried to inject the dependency, we made that coupling more explicit and easier to remove.</p>

<p>So thanks, Brent, for your comment, as it gave me an opportunity to follow up on my thinking about Singletons and design. I hope this response helps you understand why I don’t worry about the issues you brought up. Thanks, as well, for pointing out the error in my exposition about the Liskov Substitution Principle. I freely admit that, as a new face at the time, I mostly wanted to sound smart.</p>

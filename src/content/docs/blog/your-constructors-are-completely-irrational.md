---
title: "Your Constructors are Completely Irrational"
date: 2015-03-23
tags: []
---
When clients ask me to [help them with legacy code](https://link.jbrains.ca/1tC0bDa) it generally takes less than 30 minutes for me to run into a _debilitating constructor_&mdash;a term I use to describe a constructor that does too much. You might think me melodramatic for calling it "debilitating", but these constructors not only slow us down when we try to understand the code, but block our every effort to improve it. These constructors often hardwire a dependency either to some horrifying external resource (a database or a web service end point) or into a framework (even something as "simple" as threads or a lifecycle manager). These constructors also often grow to dozens, and in some extreme cases hundreds, of lines. These constructors kill code bases and, by extension, suck the life out of programmers.

Do not underestimate the power of the debilitating constructor. If you need convincing, then [take ten minutes now and click here](https://link.jbrains.ca/1tC0DRV) to read a more in-depth description of the damage these constructors do.

## Let Me Tell You What I'm Looking For in a Fucking Constructor...

<aside markdown="1">
If you don't recognize this reference, then you don't know the comedy of Ron White, then shame on you. Go find some now and listen to it. I'll wait.
</aside>

A constructor has one job: build objects. You can see that right in the name. I want constructors to build objects.

### An Anti-Pattern, While I'm In the Neighborhood

Every so often I stumble across a test that looks like this:

```
assertNotNull(new EnterpriseCodeBaseSingletonProxyFactory(parameter, parameter, ...));
```

When I see this, I have the typical alpha programmer impulse to belittle the programmer who wrote this test. I take a few deep breaths to let that feeling pass. True, in Java, the language specification guarantees that every constructor either return a non-null reference or throw an exception; however, in languages that let you do whatever you want with `new` (like C++), you can't make that assumption. Moreover, **after you've seen enough debilitating constructors, you assume that every constructor you touch wants to kill you**. Rightly so. This makes `assertNotNull(new X())` almost look reasonable. (It still isn't reasonable in Java, so please just stop doing this in Java. You have bigger problems.)

## Constructors Can't Reveal Intent

I limit constructors to building objects (as opposed to connecting to databases) in part because constructors in many languages can't reveal intent. In Java, C#, C++ and its cousins, you must name the constructor after the class to which it belongs. You may not change the name. Those languages expressly forbid constructors from expressing their intent to do anything more complicated. **As a defence mechanism, I limit constructors to very specific behavior, so that I never have to guess what a constructor will do.**

## What Should Constructors Do, Then?

<p class="highlight" markdown="1">
I expect constructors to initialize new instances to a "rational" state.
</p>

When I encounter a constructor that doesn't do this, I end up having to grope around in the dark looking for the magic sequence of method invocations that allows me to put the object in a suitable state so that I have even a modicum of confidence that I can safely invoke the method that I really need to invoke. Taking a cue from the Pragmatic Programmers, I too call this [_programming by coincidence_](#programming-by-coincidence)&mdash;although sometimes I call it programming by accident.

Programmers routinely and drastically underestimate the time, effort, and energy wasted by dealing with constructors that leave new instances in some half-initialized, irrational state.

Initializing instances to a rational state means assigning values to enough fields to avoid spurious runtime errors like null pointers/references or illegal/unexpected states. If you've initialized an instance to a rational state, then I feel confident that I can invoke any method on the object without fear of it belching red smoke in my face. I find this expectation entirely reasonable, don't you?

<p class="highlight" markdown="1">
I also expect constructors to **only** initialize new instances to a rational state.
</p>

{% pullquote %}
Erik Dietrich covered this case particularly well in his article, so I won't repeat all that detail here. We can agree that a constructor *always needs* to initialize new instances, and we might even agree by now that a constructor *always needs* to initialize instances *completely*. **Everything else a constructor might do remains subject to change.** As soon as you think that you'll never want to change it, your employer will acquire another company, turn it into a new division that supplies your project with software, and you'll need to change it. To change a constructor, you have to change code: you can't subclass, you can't plug in a different implementation of an interface, you can't override a method, you can't even invoke a different method. You have to change existing code. Remember that we're talking about legacy code here: profitable code that you're afraid to change. {"So don't make design decisions that force you to change code that you're afraid to change. Really."}
{% endpullquote %}

## Fine! What Do I Do Now?

You can start by introducing _named constructors_, which are class-level (`static`) functions that instantiate objects.

<aside markdown="1">**Please stop calling these things _factories_**. This causes confusion. A _Factory_ creates objects while hiding the exact class it has instantiated.[^factory-method] This means, for example, that it chooses an implementation to instantiate, but returns the object through a reference to the interface type. If you know exactly which class it's returning, then please call it a _creation method_ or a _named constructor_.</aside>

[^factory-method]: The Wikipedia entry about the [factory method pattern](https://link.jbrains.ca/1rkGoks) summarizes the pattern quite well&mdash;or it least it did as of this writing.

You can introduce a named constructor quite easily. Many refactoring browsers do this automatically. (IntelliJ IDEA frustratingly calls this refactoring "Replace Constructor with Factory Method...", while Eclipse also frustratingly calls it "Introduce Factory...".) Even if you don't use an automated refactoring, you'll find it relatively easy.

I'll start with this debilitating constructor.

```
public Game() {
    gameReport = new GameReport() {
        @Override
        public void report(String message) {
            System.out.println(message);
        }
    };

    for (int i = 0; i < 50; i++) {
        popQuestions.addLast("Pop Question " + i);
        scienceQuestions.addLast(("Science Question " + i));
        sportsQuestions.addLast(("Sports Question " + i));
        rockQuestions.addLast(createRockQuestion(i));
    }
}
```

It looks harmless, but give it a few months. Moreover, I didn't want to scare you off. I follow these steps:

1. Copy all the code into a new class-level function on the same class. Temporarily make fields more visible if you need to.
1. Migrate clients to use the new named constructor.
1. Add each assigned field to the constructor as a parameter.

### After Step 1

This new code duplicates the constructor, so don't stop here. I don't yet know what this named constructor *actually does*, so I've given it the mechanical name `newGame`. I don't like this name, but I expect to rename it soon.

```
public static Game newGame() {
    Game game = new Game();

    game.gameReport = new GameReport() {
        @Override
        public void report(String message) {
            System.out.println(message);
        }
    };

    for (int i = 0; i < 50; i++) {
        game.popQuestions.addLast("Pop Question " + i);
        game.scienceQuestions.addLast(("Science Question " + i));
        game.sportsQuestions.addLast(("Sports Question " + i));
        game.rockQuestions.addLast(createRockQuestion(i));
    }

    return game;
}
```

In order to write this code, I had to change `createRockQuestion()` to be class-level (`static`). Unexpectedly, only the `Game` constructor used this method, so I had no obstacles to making this method class-level.

### After Step 2

Well, you can imagine. I don't have to show you all the instances of `new Game()` turned into `Game.newGame()`.

### After Step 3

I did this in a few microsteps. My strategy involves moving `new Game()` down to the bottom of the named constructor. Most named constructors do all the interesting work, assign the results to the new instance through its conventional constructor.

```
public Game(GameReport gameReport) {
    this.gameReport = gameReport;
}

public static Game newGame() {
    GameReport gameReport = new GameReport() {
        @Override
        public void report(String message) {
            System.out.println(message);
        }
    };

    Game game = new Game(gameReport);

    for (int i = 0; i < 50; i++) {
        game.popQuestions.addLast("Pop Question " + i);
        game.scienceQuestions.addLast(("Science Question " + i));
        game.sportsQuestions.addLast(("Sports Question " + i));
        game.rockQuestions.addLast(createRockQuestion(i));
    }

    return game;
}
```

Next, I build up the first list of questions, then assign it through the constructor. I can foresee having to do the same thing four times, so I use my usual strategy: do the first one, then do the second one, then do the rest.

```
public Game(GameReport gameReport, LinkedList<String> popQuestions) {
    this.gameReport = gameReport;
    this.popQuestions = popQuestions;
}

public static Game newGame() {
    GameReport gameReport = new GameReport() {
        @Override
        public void report(String message) {
            System.out.println(message);
        }
    };

    LinkedList<String> popQuestions = new LinkedList<String>();
    for (int i = 0; i < 50; i++) {
        popQuestions.addLast("Pop Question " + i);
    }

    Game game = new Game(gameReport, popQuestions);

    for (int i = 0; i < 50; i++) {
        game.scienceQuestions.addLast(("Science Question " + i));
        game.sportsQuestions.addLast(("Sports Question " + i));
        game.rockQuestions.addLast(createRockQuestion(i));
    }

    return game;
}
```

Now the second...

```
public Game(GameReport gameReport, LinkedList<String> popQuestions, LinkedList<String> scienceQuestions) {
    this.gameReport = gameReport;
    this.popQuestions = popQuestions;
    this.scienceQuestions = scienceQuestions;
}

public static Game newGame() {
    GameReport gameReport = new GameReport() {
        @Override
        public void report(String message) {
            System.out.println(message);
        }
    };

    LinkedList<String> popQuestions = new LinkedList<String>();
    LinkedList<String> scienceQuestions = new LinkedList<String>();
    for (int i = 0; i < 50; i++) {
        popQuestions.addLast("Pop Question " + i);
        scienceQuestions.addLast(("Science Question " + i));
    }

    Game game = new Game(gameReport, popQuestions, scienceQuestions);

    for (int i = 0; i < 50; i++) {
        game.sportsQuestions.addLast(("Sports Question " + i));
        game.rockQuestions.addLast(createRockQuestion(i));
    }

    return game;
}
```

...and by now I feel confident enough to change the rest.

```
public Game(GameReport gameReport, LinkedList<String> popQuestions, LinkedList<String> scienceQuestions, LinkedList<String> sportsQuestions, LinkedList<String> rockQuestions) {
    this.gameReport = gameReport;
    this.popQuestions = popQuestions;
    this.scienceQuestions = scienceQuestions;
    this.sportsQuestions = sportsQuestions;
    this.rockQuestions = rockQuestions;
}

public static Game newGame() {
    GameReport gameReport = new GameReport() {
        @Override
        public void report(String message) {
            System.out.println(message);
        }
    };

    LinkedList<String> popQuestions = new LinkedList<String>();
    LinkedList<String> scienceQuestions = new LinkedList<String>();
    LinkedList<String> sportsQuestions = new LinkedList<String>();
    LinkedList<String> rockQuestions = new LinkedList<String>();
    for (int i = 0; i < 50; i++) {
        popQuestions.addLast("Pop Question " + i);
        scienceQuestions.addLast(("Science Question " + i));
        sportsQuestions.addLast(("Sports Question " + i));
        rockQuestions.addLast(createRockQuestion(i));
    }

    return new Game(gameReport, popQuestions, scienceQuestions, sportsQuestions, rockQuestions);
}
```

By now I think I understand what this named constructor is doing. I can rename it from `newGame` (accurate but vague) to `newConsoleReportingDummyGame`, because, let's face it, those questions look like placeholders just for testing.

Hey! The questions look like placeholders just for testing, but the `GameReporter` seems intended for production use. We should probably just split that behavior apart.

**And now we can.**

**And that's the point.**

<aside markdown="1">By the way... we should probably introduce a _Parameter Object_ for the four sets of questions. That would leave a simple, clear constructor `Game(GameReporter, QuestionDeck)`. The resulting constructor might even reveal its own intent well enough that we can get rid of our named constructor.</aside>

## The Underlying Design Principle

Introducing a named constructor has highlighted a dependency problem: the constructor knew too much about where its data was coming from. This bound the `Game` object to a single context, and so for example, if we had to track down a bug related to asking the tenth question, then we would be forced to play a game that moved turn by turn to the tenth question in an arbitrary category. Click. Click. Click. This seems risky and invites failure.

The constructor violated the [Dependency Inversion Principle](#dip), and introducing a named constructor moved details up the call stack towards the client, leaving behind parameters that we can easily change in order to more easily explore `Game`'s behavior. Now if we have a problem asking the tenth question, we can pass in a deck with a single question and figure out what happens.

This doesn't solve _every_ design problem in `Game`, but I can only take one step at a time.

## A Quick Summary

1. I want constructors *only* to initialize new instances to a "rational" state, so I move more interesting code into named constructors.
1. Now that I have to give this construction behavior a name, cohesion and dependency problems become explicit and obvious.
1. Now that I have identified explicit, obvious design problems, I can decide how and when to improve the design.

As a pleasant side effect, testing the affected code becomes much easier. If you care about that kind of thing.

## One More Thing

If you'd like one simple rule of thumb to follow:

<p class="instruction" markdown="1">Don't let a constructor invoke an instance method on the instance that it's in the process of creating.</p>

If you found yourself wanting to do this, then you have two responsibilities in the same place. (Why? Think about it.)

## References

Erik Dietrich, [_Beware the Bloated Constructor_](https://link.jbrains.ca/1tC0DRV). Erik's article triggered my writing this one. He summarizes neatly the toll that a debilitating constructor takes.

<a name="programming-by-coincidence" />Andrew Hunt and Dave Thomas, [_The Pragmatic Programmer_](https://link.jbrains.ca/WNg8Se). Item 31 in this classic book is _Programming By Coincidence_, in which the authors paint a beautiful picture of just how slowly and deliberately the programmer has to work when encountering code such as debilitating constructors.

Erich Gemma and others, [_Design Patterns_](https://link.jbrains.ca/11ATEqK). The first book I ever bought as hypertext, and a book truly designed for it. It explains what makes a _factory_ a factory. Please don't just look at the class diagrams. Please read the "Drawbacks and Alternatives" sections.

J. B. Rainsberger, ["Demystifying the Dependency Inversion Principle"](/permalink/consequences-of-dependency-inversion-principle). A handful of ways to approach and understand the Dependency Inversion Principle.

Mi&#154;ko Hevery, ["Flaw: Constructor Does Real Work"](https://misko.hevery.com/code-reviewers-guide/flaw-constructor-does-real-work/). Another article in a similar vein from 2008.

---
title: "Emerging Implementations of An Emerging Interface: An Example"
date: 2019-06-20
tags:
    - Simple Design
    - Evolutionary Design
    - Refactoring
summary: >
    Many senior programmers feel nervous allowing their project's design to evolve
    in the hands of their co-workers. This article shows one specific example of how
    a useful abstraction and a small type hierarchy can evolve by following simple
    design guidelines that anyone can learn.
---
How do object hierarchies evolve? Many programmers struggle with this question. Mostly, they want to know how object hierarchies can evolve _safely and sensibly_! They have a picture in their mind that TDD is only safe in the hands of programmers with excellent design sense, but [I believe that anyone can learn these skills with a combination of simple guidelines and guided practice.](https://tdd.training) It would be nice to have more examples. I have stumbled upon one that I'd like to share with you.

I'm refactoring some legacy code as part of my [Surviving Legacy Code online course](https://surviving-legacy-code.jbrains.ca). In the process of using what I call the Mail Forwarding Technique, I came across an interesting little pattern, which led to significant results, one after another.

# The Situation

<div class="aside" markdown="1">

I'm working on the Java version of this code base, and for now, I've chosen to restrict the legacy code to Java 6 level. This might explain some strange-looking decisions not to use more-modern libraries and language features.

</div>

I am extracting some behavior from a legacy class (`Game`) that has exposed package-level fields to clients. For teaching purposes, I have adopted the constraint of keeping those fields backwards compatible (and their state up to date) until I can decide when I can safely hide them from clients. If you've been to a Code Retreat, then you understand the idea of volunteering to constrain yourself during practice.

I am moving this behavior into a new class in the Happy Zone which I will call `GameEngine`, which runs the game once it has started. The fields at issue hold the _questions_ that players ask each other during the game&mdash;think of a game like Trivial Pursuit. The legacy `Game` has a few fields representing the list of questions in each of four categories (Pop, Science, Sports, Rock) and it consumes each question as we ask it, so that we don't ask it twice. If you can believe it, `Game` uses `LinkedList` for this purpose _specifically so that it can use `removeFirst()`_.

<figure class="smaller">
  <img src="https://media.giphy.com/media/1dNLLlpEUbeD8peO4e/giphy.gif" />
</figure>

```java
package com.adaptionsoft.games.uglytrivia;
[...]
public class Game implements UpdateLegacyGame {
[...]
	/*
	 * BEGIN Legacy fields. Maintain backwards compatibility
	 * at all costs until 2021-06-30.
	 */
    LinkedList popQuestions = new LinkedList();
    LinkedList scienceQuestions = new LinkedList();
    LinkedList sportsQuestions = new LinkedList();
    LinkedList rockQuestions = new LinkedList();
[...]
}
```

<div class="explanation" markdown="1">

The _Universal Architecture_ is my way of describing how to organize systems to maximize healthy dependencies. It is an abstraction compatible with the Onion Architecture, the Hexagonal Architecture, and Ports and Adapters. The _Happy Zone_ is the region of the code that we can easily check with only microtests running entirely in memory. Rescuing legacy code involves breaking dependencies in order to be able to move code into the Happy Zone, where code is generally happier to live.

</div>

I want the new `GameEngine` to manage the state of the new `QuestionDeck` (the set of collections of questions in the various categories, which corresponds to the legacy fields), but I need the legacy `Game` to mirror changes to the `QuestionDeck` until I can safely remove those legacy fields. For this, I introduce the interface `UpdateLegacyGame` (whose [name I will improve later](https://blog.thecodewhisperer.com/permalink/a-model-for-improving-names)) which the legacy `Game` implements so that `GameEngine` can update the legacy game state without depending directly on legacy code. The legacy code will be able to delegate some of its behavior to new modules in the Happy Zone while keeping its legacy state up to date. It then becomes easier to microtest the extracted behavior.

# Leading Up To the Moment

After starting to move the behavior into the Happy Zone, I notice that I will have some trouble writing succinct microtests for this behavior. I can already see [all the test doubles (mock objects) that I'm going to need](https://blog.thecodewhisperer.com/permalink/beyond-mock-objects).

```java
package ca.jbrains.trivia;

import ca.jbrains.trivia.legacy.LegacyAskQuestion;
import ca.jbrains.trivia.legacy.UpdateLegacyGame;

public class GameEngine {
    private final UpdateLegacyGame updateLegacyGame;
    private final QuestionDeck questionDeck;

    public GameEngine(
            final UpdateLegacyGame updateLegacyGame,
            final QuestionDeck questionDeck) {

        this.updateLegacyGame = updateLegacyGame;
        this.questionDeck = questionDeck;
    }

    public void askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) {
        final String nextQuestionInCategory = questionDeck.getNextQuestionInCategory(category);
        askQuestion.askQuestion(nextQuestionInCategory);
        questionDeck.consumeNextQuestionInCategory(category);
        updateLegacyGame.updateQuestionDeckFields(questionDeck.asLegacyQuestionDeck());
    }
}
```

I can demonstrate the emerging problem by looking at the microtest that I have so far.

```java
package ca.jbrains.trivia.legacy.test;

import ca.jbrains.trivia.Category;
import ca.jbrains.trivia.GameEngine;
import ca.jbrains.trivia.QuestionDeck;
import ca.jbrains.trivia.legacy.LegacyAskQuestion;
import ca.jbrains.trivia.legacy.LegacyQuestionDeck;
import ca.jbrains.trivia.legacy.UpdateLegacyGame;
import io.vavr.collection.HashMap;
import io.vavr.collection.List;
import io.vavr.control.Option;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class AskQuestionConsumesQuestionTest implements UpdateLegacyGame {
    private Option<LegacyQuestionDeck> maybeUpdatedLegacyQuestionDeck = Option.none();

    @Test
    void happyPath() throws Exception {
        final QuestionDeck questionDeck = new QuestionDeck(HashMap.of(Category.POP, List.of("::question 0::", "::question 1::")));

        new GameEngine(this, questionDeck).askQuestionInCategory(Category.POP, new LegacyAskQuestion() {
            @Override
            public void askQuestion(String questionText) {
                // Intentionally do nothing; we're checking _consuming_ a question, and not asking it.
            }
        });

        final QuestionDeck updatedQuestionDeck = new QuestionDeck(HashMap.of(Category.POP, List.of("::question 1::")));

        Assertions.assertEquals(
                updatedQuestionDeck,
                questionDeck
        );

        Assertions.assertEquals(
                Option.of(updatedQuestionDeck.asLegacyQuestionDeck()),
                maybeUpdatedLegacyQuestionDeck
        );
    }

    @Override
    public void updateQuestionDeckFields(LegacyQuestionDeck legacyQuestionDeck) {
        this.maybeUpdatedLegacyQuestionDeck = Option.of(legacyQuestionDeck);
    }
}
```

<div class="aside" markdown="1">

I've chosen to handroll my test doubles just because I haven't needed them much yet and I didn't want to become distracted by [Mockito nor JMock](https://blog.thecodewhisperer.com/permalink/jmock-v-mockito-but-not-to-the-death) while I finish this move. I can refactor towards one of those libraries later.

</div>

In this test I want to _check_ that when the new `GameEngine` asks a question, something updates the legacy state of the question deck; however, asking a question involves writing text to the console, which I prefer to avoid in a microtest. I have introduced an interface (a Named Lambda Expression or Functional Interface) to side-step the unwanted side-effect. In this test, I don't care about asking the question, but only about _consuming the correct question_ in order to avoid asking it twice in succession, which explains why I stub `LegacyAskQuestion` to do nothing. This stubbing distracts me (and anyone who reads this test) from the goal of the test. I interpret that distraction as a signal that I have too many responsibilities in one place. **I can already see myself needing to duplicate this irrelevant detail in more microtests**, and that typically [tells me to separate behaviors from each other](https://blog.thecodewhisperer.com/permalink/what-your-tests-dont-need-to-know-will-hurt-you).

## Identifying Some Refactorings

I can't chase all the rabbits[^chasing-rabbits], but I _can_ write down what comes to my mind, so I add some microtask comments.

[^chasing-rabbits]: Have you ever tried chasing dozens of rabbits at once? They have evolved to run away from you. I know that you want to hug all the rabbits, but you'll fail until you pick one and chase _it_ until you catch it and hug it.

```java
public class GameEngine {
[...]
    public void askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) {
        // SMELL I have to remember to update the legacy Game.
        // REFACTOR Move this into a Decorator on the Question Deck?
        // REFACTOR Invert askQuestion() so that we can do all of this on the Question Deck?
        final String nextQuestionInCategory = questionDeck.getNextQuestionInCategory(category);
        askQuestion.askQuestion(nextQuestionInCategory);
        questionDeck.consumeNextQuestionInCategory(category);
        updateLegacyGame.updateQuestionDeckFields(questionDeck.asLegacyQuestionDeck());
    }
[...]
}
```

## Grouping Behavior By Intention

Next, I use the [Composed Method pattern](https://c2.com/ppr/wiki/WikiPagesAboutRefactoring/ComposedMethod.html) to summarize the code and express its intent more directly.

```java
[...]
public class GameEngine {
[...]
    public void askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) {
        // SMELL I have to remember to update the legacy Game.
        // REFACTOR Move this into a Decorator on the Question Deck?
        // REFACTOR Invert askQuestion() so that we can do all of this on the Question Deck?
        askQuestionInCategoryWith(category, askQuestion);
        signalLegacyStateChanged();
    }

    private void signalLegacyStateChanged() {
        updateLegacyGame.updateQuestionDeckFields(questionDeck.asLegacyQuestionDeck());
    }

    private void askQuestionInCategoryWith(Category category, LegacyAskQuestion askQuestion) {
        final String nextQuestionInCategory = questionDeck.getNextQuestionInCategory(category);
        askQuestion.askQuestion(nextQuestionInCategory);
        questionDeck.consumeNextQuestionInCategory(category);
    }
}
```

You might not consider this a substantial improvement, but summarizing the behavior of "ask the next question in this category" clearly isolates the _new code_ (asking-then-consuming a question) from the _legacy code_  (updating the legacy state). But wait! Something wonderful has happened.

# The Moment

[In extracting methods, I have been forced to name them](https://blog.thecodewhisperer.com/permalink/putting-an-age-old-battle-to-rest), and in naming them, I notice a pattern that I've seen numerous times over the years: two methods that do similar things, have similar names, but whose names differ in some vague way. Here, those two methods are "ask question in category" and "ask question in category _with_".

"With"?! Strange name. It doesn't seem to mean anything here.

Even better, the two methods have the _same_ parameter list: a category and a Named Lambda Expression for actually asking the question. The word "actually" in that sentence acts like a clue.

Even betterer, one method calls the other _and_ does a dash extra.

[Is your intuition tingling yet?](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer) Don't worry if it isn't, but I thought I'd ask.

## The Symptoms

I have duplication between methods with similar names. I _want_ to name them identically, since they both involve asking the next question in a category, but the language doesn't let me. Like any impatient programmer, I follow a path of little resistance, adding some vague word ("with") to the name in order to artificially distinguish the two implementations and get on with my task. (Clue!)

One method invokes the other and does some extra stuff. This reminds me of the [Decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern). (Clue!)

## The Realization

<figure class="half-width">
    <img src="{{ site.baseurl }}/images/Emerging-Implementations-of-an-Emerging-Interface-An-Example/decorator-diagram.png" />
    <figcaption>The typical Decorator design</figcaption>
</figure>

The Decorator pattern, like the [Composite pattern](https://en.wikipedia.org/wiki/Composite_pattern), involves multiple implementations of a common interface where one implementation adds behavior to&mdash;_decorates_&mdash;another. If I want the Decorator pattern here, then surely I must have multiple implementations of a common interface! And clearly I do.

The artificial, vague difference in name between "ask question in category" and "ask question in category with" signals two implementations of "ask question in category" (a "standard" one and a "special" one), while the same method signature (`(Category, LegacyAskQuestion) -> void`) signals the common interface.

# The Refactoring: A Summary

I approach this situation with the following strategy.

1. Rename the methods to reveal the implementation details that distinguish them from each other.
2. Move the implementation details onto new classes.
3. Extract the common interface.
4. Profit.

Great, no? You can practise these steps on your own or you can read on to see a summary of how I did it. For the gory details and the wonderful design insights that followed, [you'll need to purchase a training course](https://surviving-legacy-code.jbrains.ca).

## Rename the Implementation Methods

I start with three methods, two of which have very similar intent and very similar names.

```java
[...]
public class GameEngine {
[...]
    public void askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) {
        askQuestionInCategoryWith(category, askQuestion);
        signalLegacyStateChanged();
    }

    private void signalLegacyStateChanged() { [...] }
    private void askQuestionInCategoryWith(Category category, LegacyAskQuestion askQuestion) { [...] }
}
```

When I look at these, [I have the impulse to rename the first one to "ask question in category then signal legacy state changed"](/permalink/a-model-for-improving-names) and the last to "ask question in category". These names, [though purely mechanical](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer), provide an adequate _distinction_ between the two implementations through _accurate_ names in both cases and _precise_ names in the case of the "legacy state change" version. The code moves to the right on the [Improving Names continuum](/permalink/a-model-for-improving-names).

```java
[...]
public class GameEngine {
[...]
    public void askQuestionInCategoryThenUpdateLegacyState(Category category, LegacyAskQuestion askQuestion) {
        askQuestionInCategory(category, askQuestion);
        signalLegacyStateChanged();
    }

    private void signalLegacyStateChanged() { [...] }
    private void askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) { [...] }
}
```

## Extract the Implementations and the Common Interface

This pattern in the names suggests a kind of _standard_ implementation (unmarked) and a _special_ implementation (marked by the phrase "then update legacy state"). I turn this into the Decorator pattern with the following steps:

1. Extract a class for each implementation. Copy the difference in names into the class names.
2. Rename the methods in both classes to match each other.
3. Extract a common interface from the two implementations.
4. Weaken dependencies by using the Weakest Type Possible.[^weakest-type-possible]

[^weakest-type-possible]: Eclipse calls this "Generalize Declared Type". IntelliJ IDEA calls this "Use Interface Where Possible". Replace the declared type of a field (or variable or parameter) with the highest possible type on the inheritance hierarchy, meaning the most-abstract type, that the compile-time type checker will allow. This applies the [Dependency Inversion Principle](/series#dependency-inversion-principle-dip) and/or the Interface Segregation Principle.

### Trouble In the Tests

In my tests, I'd like to check the standard implementation (ask question, then consume it) separately from the special implementation (do the standard thing, then update the legacy state), and yet the current design forces me to check these things together: it holds the standard implementation hostage in a `private` method and it provides no convenient interface to allow for setting an expectation on `askQuestionInCategory()`. The refactoring I'm doing here helps with both of these issues. Once again, [my intuition (how do I make this more-easily tested?) matches the mechanics (how do I remove this duplication?)](/permalink/becoming-an-accomplished-software-designer).

## Before

Before refactoring, the Decorator was flattened inside `GameEngine`. I could only run the standard implementation through the special implementation. I could only run the special implementation by also running the standard implementation. This led to integrated tests which would have caused irrelevant details to proliferate if I hadn't noticed the risk early on. And yet, the code is so small, that all those risks can seem easy to handle. To that I say this: **if the risks are easy to handle now, then they're also easy to address now.** (Sometimes it's better to do nothing. Good judgment comes from experience, which comes from bad judgment.)

## After

After extracting the Decorator, we have the following.

The legacy `Game` delegates `askQuestion()` to the `GameEngine`, hiding from it the details of how to ask a question in production (by writing text to the console). The `Game` uses the [Self-Shunt Pattern](https://wiki.c2.com/?SelfShuntPattern) to update its legacy state when asked to.

```java
package com.adaptionsoft.games.uglytrivia;
[...]
public class Game implements UpdateLegacyGame {
[...]
	private final GameEngine gameEngine;

	/*
	 * BEGIN Legacy fields. Maintain backwards compatibility
	 * at all costs until 2021-06-30.
	 */
[...]
    LinkedList popQuestions = new LinkedList();
    LinkedList scienceQuestions = new LinkedList();
    LinkedList sportsQuestions = new LinkedList();
    LinkedList rockQuestions = new LinkedList();
[...]
    // Creating the standard question decks lives elsewhere, but
    // starting the Game triggers "update question decks in legacy game".
    public  Game(){
    	this.gameConfiguration = GameConfiguration.withStandardQuestionDecks(this);
    	this.gameEngine = gameConfiguration.start();
    }
[...]
    // We're using Java 6, so Functional Interface in place of lambda expression.
	private void askQuestion() {
		gameEngine.askQuestionInCategoryThenUpdateLegacyState(
				findCategoryByLegacyName(currentCategory()),
				new LegacyAskQuestion() {
					@Override
					public void askQuestion(String questionText) {
						System.out.println(questionText);
					}
				});
	}
[...]
	private void updateQuestionDeck(final LinkedList oldQuestionDeck, final java.util.List<?> newQuestionDeckContents) {
		oldQuestionDeck.clear();
		oldQuestionDeck.addAll(newQuestionDeckContents);
	}

	@Override
	public void updateQuestionDeckFields(LegacyQuestionDeck legacyQuestionDeck) {
		updateQuestionDeck(this.popQuestions, legacyQuestionDeck.getPopQuestions());
		updateQuestionDeck(this.scienceQuestions, legacyQuestionDeck.getScienceQuestions());
		updateQuestionDeck(this.sportsQuestions, legacyQuestionDeck.getSportsQuestions());
		updateQuestionDeck(this.rockQuestions, legacyQuestionDeck.getRockQuestions());
	}
}
```

The legacy behavior remains here. The legacy `Game` only injects into the Happy Zone an implementation of the action "update the legacy state".

The `GameEngine` provides a simple Facade into the Happy Zone. I don't need this Facade yet, so I could invoke YAGNI, but as soon as I want to move behavior from the legacy code into the Happy Zone, I'll prefer having this Facade. When I first started refactoring, I'd have removed this Facade, then put it back when I truly needed it, but in the intervening 20 years, I've grown to trust myself when I say that I will need it very soon. I treat YAGNI as a principle, and not a rule. (Maybe you need to treat it as a rule.)

```java
package ca.jbrains.trivia;

import ca.jbrains.trivia.legacy.LegacyAskQuestion;

public class GameEngine {
    private final LegacyStateUpdatingAskQuestionInCategory legacyStateUpdatingAskQuestionInCategory;

    public GameEngine(final LegacyStateUpdatingAskQuestionInCategory legacyStateUpdatingAskQuestionInCategory) {
        this.legacyStateUpdatingAskQuestionInCategory = legacyStateUpdatingAskQuestionInCategory;
    }

    public void askQuestionInCategoryThenUpdateLegacyState(Category category, LegacyAskQuestion askQuestion) {
        legacyStateUpdatingAskQuestionInCategory.askQuestionInCategory(category, askQuestion);
    }
}
```

I left the legacy state details in this class to clarify its intent: it sits in the DMZ, which protects the Happy Zone from the Horrible Outside/Legacy World. It might talk to the legacy code directly, but certainly, at worst, it provides the anti-corruption layer that shields the Happy Zone from the details of the legacy code. I will continue to look for ways to invert the dependency so the legacy code knows about this class, but this class remains ignorant of the legacy code.

### The Decorator

First, the common interface.

```java
package ca.jbrains.trivia;

import ca.jbrains.trivia.legacy.LegacyAskQuestion;

public interface AskQuestionInCategory {
    QuestionDeck askQuestionInCategory(Category category, LegacyAskQuestion askQuestion);
}
```

Next, the standard implementation.

```java
package ca.jbrains.trivia;

import ca.jbrains.trivia.legacy.LegacyAskQuestion;

/*
 * REFACTOR Move the LegacyAskQuestion parameter into the constructor.
 * REFACTOR Move the QuestionDeck parameter into askQuestionInCategory().
 */
public class StandardAskQuestionInCategory implements AskQuestionInCategory {
    private final QuestionDeck questionDeck;

    public StandardAskQuestionInCategory(QuestionDeck questionDeck) {
        this.questionDeck = questionDeck;
    }

    @Override
    public QuestionDeck askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) {
        final String nextQuestionInCategory = questionDeck.getNextQuestionInCategory(category);
        askQuestion.askQuestion(nextQuestionInCategory);
        questionDeck.consumeNextQuestionInCategory(category);
        return questionDeck;
    }
}
```

I can't think of a better name than "standard", so I leave it like this for now. This is the part that "actually" asks a question. At some point, I'll find better names. Other programmers might name this class `AskQuestionInCategoryImpl`, to mean "the standard way we do it around here". I find the word "standard" more honest, more direct, and easier to justify than "impl", let alone the abbreviation.

Next, the "special" implementation. What makes this special? It updates the legacy state when it knows that the question deck has changed.[^push-legacy-state-update-down] This helps me name the class more explicitly and more precisely.

[^push-legacy-state-update-down]: Yes, I see a clue in that sentence, too. I probably want to move the "update legacy state" event down into `QuestionDeck` itself, so that the `Game` can simply subscribe to it for state changes. If you want to try that, then you should! I will probably get the eventually. I feel no rush. In fact, [that will probably make for an interesting refactoring exercise in the course](https://surviving-legacy-code.jbrains.ca).

```java
package ca.jbrains.trivia;

import ca.jbrains.trivia.legacy.LegacyAskQuestion;
import ca.jbrains.trivia.legacy.UpdateLegacyGame;

public class LegacyStateUpdatingAskQuestionInCategory implements AskQuestionInCategory {
    private final UpdateLegacyGame updateLegacyGame;
    private final AskQuestionInCategory askQuestionInCategory;

    public LegacyStateUpdatingAskQuestionInCategory(UpdateLegacyGame updateLegacyGame, AskQuestionInCategory askQuestionInCategory) {
        this.updateLegacyGame = updateLegacyGame;
        this.askQuestionInCategory = askQuestionInCategory;
    }

    public QuestionDeck askQuestionInCategory(Category category, LegacyAskQuestion askQuestion) {
        final QuestionDeck questionDeck = askQuestionInCategory.askQuestionInCategory(category, askQuestion);
        updateLegacyGame.updateQuestionDeckFields(questionDeck.asLegacyQuestionDeck());
        return questionDeck;
    }
}
```

The Decorator part comes from this implementation decorating an arbitrary implementation of the common interface, then delegating to that object. This feels a bit like Aspect-Oriented Programming: after "ask question in category", update the legacy question deck fields. Any client that knows how to talk to a generic "ask question in category" action can easily add the "update legacy state" behavior with a change of a single line of code.

Finally, just for completeness, here is `QuestionDeck`, which can turn itself into a data structure that facilitates updating the legacy state. I don't like this logical dependency back on the Horrible Legacy World, but at least it only depends on Value Objects arranged in a certain shape, rather than classes that _must_ run in the legacy environment. I can live with that for now. I can't chase all the rabbits! As it is, this class needs to know about the _four production question categories_, anyway, so at least the presence of more of these details makes that logical dependency easier to spot. I'm more likely to try to fix it if I keep noticing it.

```java
package ca.jbrains.trivia;

import ca.jbrains.trivia.legacy.LegacyQuestionDeck;
import io.vavr.collection.HashMap;
import io.vavr.collection.List;

import java.util.ArrayList;
import java.util.function.Supplier;

public final class QuestionDeck {
    private HashMap<Category, List<String>> questionsByCategory;

    public QuestionDeck(HashMap<Category, List<String>> questionsByCategory) {
        this.questionsByCategory = questionsByCategory;
    }

    public static Supplier<RuntimeException> noQuestionsInCategoryProgrammerMistake(Category category) {
        return () -> new IllegalStateException(String.format("How are there no questions in the category named '%s'?!", category.name()));
    }

    /*
     * CONTRACT For convenience, use an empty list of questions as the fallback value
     * when this object has no questions in one of the expected legacy categories.
     */
    public LegacyQuestionDeck asLegacyQuestionDeck() {
        return new LegacyQuestionDeck(
                asLegacyQuestionsInCategory(Category.POP),
                asLegacyQuestionsInCategory(Category.SCIENCE),
                asLegacyQuestionsInCategory(Category.SPORTS),
                asLegacyQuestionsInCategory(Category.ROCK));
    }

    private java.util.List<String> asLegacyQuestionsInCategory(Category category) {
        return questionsByCategory.get(category).getOrElse(List.empty()).toJavaList();
    }

    public String getNextQuestionInCategory(Category category) {
        return getQuestionsInCategory(category).head();
    }

    public void consumeNextQuestionInCategory(Category category) {
        questionsByCategory = questionsByCategory.put(category, getRemainingQuestionsInCategory(category));
    }

    private List<String> getRemainingQuestionsInCategory(Category category) {
        return getQuestionsInCategory(category).tail();
    }

    /*
     * CONTRACT For now, we must support the four expected legacy Game categories.
     * We want to remove this restriction.
     */
    public List<String> getQuestionsInCategory(Category category) {
        return questionsByCategory.get(category).getOrElseThrow(noQuestionsInCategoryProgrammerMistake(category));
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof QuestionDeck) {
            QuestionDeck that = (QuestionDeck) other;
            return this.questionsByCategory.equals(that.questionsByCategory);
        }
        else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return -762;
    }

    @Override
    public String toString() {
        return String.format("QuestionDeck[questionsByCategory=[%s]]", questionsByCategory);
    }
}
```

If you wanted to see the gory details, you'd need to purchase [Surviving Legacy Code](https://surviving-legacy-code), where I've published them in article form, to be followed in summer 2019 with a video showing all the steps. This course not only shows you step-by-step how to refactor like this, but it's like pairing with me: I tell you what I'm thinking as I think it, including how I deal with distractions, how I recover from going in the wrong direction for a while, and all the other aspects of real-life evolutionary design.

### Won't Somebody Think of the Tests?!

Yes, of course! A test changed. Usually this kind of refactoring makes an integrated test more obvious to the reader as an integrated test. Did it? Let's look.

```java
[...]
public class AskQuestionConsumesQuestionTest implements UpdateLegacyGame {
    private Option<LegacyQuestionDeck> maybeUpdatedLegacyQuestionDeck = Option.none();

    @Test
    void happyPath() throws Exception {
        final QuestionDeck questionDeck = new QuestionDeck(HashMap.of(Category.POP, List.of("::question 0::", "::question 1::")));

        final GameEngine gameEngine = new GameEngine(
                new LegacyStateUpdatingAskQuestionInCategory(
                        this,
                        questionDeck,
                        new StandardAskQuestionInCategory(questionDeck)));

        gameEngine.askQuestionInCategoryThenUpdateLegacyState(Category.POP, new LegacyAskQuestion() {
            @Override
            public void askQuestion(String questionText) {
                // Intentionally do nothing; we're checking _consuming_ a question, and not asking it.
            }
        });

        final QuestionDeck updatedQuestionDeck = new QuestionDeck(HashMap.of(Category.POP, List.of("::question 1::")));

        Assertions.assertEquals(
                updatedQuestionDeck,
                questionDeck
        );

        Assertions.assertEquals(
                Option.of(updatedQuestionDeck.asLegacyQuestionDeck()),
                maybeUpdatedLegacyQuestionDeck
        );
    }

    @Override
    public void updateQuestionDeckFields(LegacyQuestionDeck legacyQuestionDeck) {
        this.maybeUpdatedLegacyQuestionDeck = Option.of(legacyQuestionDeck);
    }
}
```

Why yes! This test involves `StandardAskQuestionInCategory` (which will try to ask the question using `LegacyAskQuestion`) even though it also explicitly passes a `LegacyAskQuestion` implementation that won't even try to ask the question! I see this pattern a lot: I have to stub something _way over there_ in order to control the behavior of something _right here_. This tells me that I'm missing an abstraction, and it gives me some ideas of where else to refactor. I could simplify the test by replacing the standard implementation of `AskQuestionInCategory` with a stub that does nothing.

But then I would have have _two_ stubs that do nothing. They do _the same kind of nothing_. And _for the same reasons_. More ideas! Removing that duplication would take more than two minutes, so I add a SMELL comment, put a task in the inbox, and finish this move.

I have the feeling that these symptoms all point to the same underlying cause. It feels like a dependency in the wrong direction. I suspect that inverting that dependency, moving the "update legacy state" behavior down into `QuestionDeck`, would simplify this design _significantly_. It feels like I'd benefit from making that move soon.

Wait... **I think I finally finished this move!** Let me look around the code.... Yes, I did it!

Breathe. Where do I go from here? What do I see now that I can pull my head up out of the details?

## The State of the Inbox

One item in the inbox has become urgent and the rest I've left as an unprocessed set of tasks for now.

### Urgent

- `LegacyStateUpdatingAskQuestionInCategory` knows too many details about its collaborators, resulting in Programming by Coincidence.

### Unprocessed

- Add microtests for the implementations of `AskQuestionInCategory`.
- Resolve the collision of names and concepts between `AskQuestionInCategory` and `LegacyAskQuestion`.
- Maybe move the Decorator design down into `QuestionDeck`?
- Move `LegacyAskQuestion` into the constructor of the implementations of `AskQuestionInCategory` that need them.
- Remove the excess details in `AskQuestionConsumesQuestionTest`.
  - ...and then, `AskQuestionConsumesQuestionTest` duplicates "do nothing" stubs for both `AskQuestionInCategory` and `LegacyAskQuestion`.

I already see a way to remove that Programming by Coincidence risk, but that's not the point of this article. Maybe you've already noticed it? Maybe you'll run into the same thing if you [try to refactor the code yourself](https://www.github.com/jbrains/trivia). Maybe you'd rather just [find out what I'm talking about](https://surviving-legacy-code.jbrains.ca). (Sorry: that service is not free.)

# Summary

Here I've tried to show an example of replacing two similar-but-vaguely-different methods with the Decorator pattern, which makes the code less expensive to test. This refactoring results in smaller pieces that I could more-easily recombine, giving me more options and reducing the cost of changing _peripheral behavior_ (like how to update legacy state, or even whether we still need to do it) from _essential behavior_ (ask a question, then move it to the back of the deck so as not to ask it again right away). It nudges the code towards the Open/Closed Principle by treating "ask a question" as an abstraction, rather than relying on the current production implementation, which will continue to change as we rescue more code from the legacy `Game`.

You can see a similar example [here](https://blog.thecodewhisperer.com/permalink/beyond-mock-objects), where I extract a Decorator that adds the current timestamp to all incoming requests that need it, so that I can test handling a request without worrying about where the timestamp came from. The `InstantaneousRequestController` decorates other Controllers in exactly the same way as Rails uses request filters.


# References

J. B. Rainsberger, ["A Model for Improving Names"](https://blog.thecodewhisperer.com/permalink/a-model-for-improving-names). I don't worry about naming things for their structure, but I continually look for opportunities to rename those things in a way that increases abstraction.

J. B. Rainsberger, ["Becoming An Accomplished Software Designer"](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer). An essay on the interplay between mechanical refactoring and design intuition.

J. B. Rainsberger, ["Beyond Mock Objects"](https://blog.thecodewhisperer.com/permalink/beyond-mock-objects). I happily use test doubles (mock objects) as a design tool, but sometimes my design improves by figuring out how to avoid a test double.

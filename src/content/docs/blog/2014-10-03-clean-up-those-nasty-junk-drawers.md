---
title: "Clean Up Those Nasty Junk Drawers"
date: 2014-10-04
tags:
  - "Improving Names"
---
Almost everyone starts organizing their tests according to the module (or class or object) that they're testing. If they have a class called `Customer`, then they have a test case class called `CustomerTest` and put all the tests for `Customer` into this one bundle (module, class, `describe` block, whatever you call it).

Don't stop here.

If you continue to add *all* your `Customer` tests to `CustomerTest`, then you'll certainly judge it as "too big" after a while. Even if you don't, you'll notice some patterns in the names of the tests themselves.

<aside markdown="1">If you work with libraries like Spock or RSpec that let you name tests with arbitrary text, then you might not notice these patterns as easily, or the duplication might seem "more natural" in natural language. Don't let that fool you into thinking that you haven't duplicated concepts in your code!</aside>

You've almost certainly noticed a pattern in the names of some of your tests.

* `testAdd_EmptyList`
* `testAdd_NonemptyList`
* `testAdd_ListAtCapacity`
* `testAdd_DuplicateItem`
* `testContains_ItemFound`
* `testContains_ItemNotFound`
* `testContains_DuplicateItem`
* `testSize_EmptyList`
* `testSize_NonEmptyList`
* `testIsEmpty_EmptyList`
* `testIsEmpty_NonEmptyList`
* `testIndexOf_ItemFound`
* `testIndexOf_ItemNotFound`
* `testTrimToCapacity_TrimmingNeeded`
* `testTrimToCapacity_TrimmingNotNeeded`

<aside markdown="1">I don't endorse this pattern for naming tests in general, but this reflects common practice. In a real-life version of this example, I'd be writing *Learning Tests* to help me understand how `ArrayList` works in Java. In such a situation I often write tests oriented around each method and the various special cases, because I'm trying to document the API as designed. When designing new behavior in new modules or classes, I prefer not to name my tests for any particular method, function, or even class, so as not to couple&mdash;even in my own mind&mdash;the tests unnecessarily to an initial implementation.</aside>

I can imagine finding this set of tests&mdash;and more&mdash;in a test called `ArrayListTest`.[^assuming-java] You can already see two things:

1. There are a lot of tests here.
1. There is a fair amount of duplication here.

You can also see that we can't remove that duplication with just a single refactoring: the various tests fall into different groups, and so need us to organize them slightly differently.

[^assuming-java]: Yes, I'm assuming Java here. Don't let that fool you: I see exactly the same patterns in Ruby/PHP/Python as I do in Java/C#/C++/C.

## Remove Duplication

I don't seem to have any problem understanding the names of these tests&mdash;I wrote them, so I guess that shouldn't surprise me&mdash;which means that I will turn my attention to removing duplication.

<figure style="width: 90%"><a href="/permalink/putting-an-age-old-battle-to-rest"><img src="//blog.thecodewhisperer.com/images/age_old_battle/virtuous_cycle.png" alt="Remove Duplication and Improve Names in small batches" /></a><figcaption>The Simple Design Dynamo<sup>TM</sup></figcaption></figure>

In this case, duplication in the names of the tests will suggest different ways of reorganizing the tests than a simple refactoring of the duplicate code might suggest. Even though I haven't written these tests out in code, I've seen them a number of times, so I can picture them very clearly. Especially when a programmer writes all these tests in one test case class, they typically end up with one line of setup code shared by all the tests:

```
@Before
public void setUp() { theList = new ArrayList<String>(); }
```

Removing this duplication helps a little, but we can do much better. For example, looking at the tests for the "non-empty list" cases, I imagine I'll find copied-and-pasted lists of "pre-populated" items.

```
@Test
public void testSize_NonEmptyList() {
    theList.add("jbrains is awesome");
    theList.add("jbrains is awesomer");
    theList.add("jbrains is even awesomer than that");

    Assert.assertEquals(3, theList.size());
}
```

...and a little farther down...[^father-down]

[^father-down]: ...we see little Father Down... Wait. Not a Benny Hill fan?

```
@Test
public void testIsEmpty_NonEmptyList() {
    theList.add("jbrains is awesome");
    theList.add("jbrains is awesomer");
    theList.add("jbrains is even awesomer than that");

    Assert.assertFalse(theList.isEmpty());
}
```

When I look at the "`isEmpty()`, non-empty case" test, I get the idea that although I might want to check the "3" case for `size()`, I might prefer to check the boundary case for `isEmpty()`, meaning a list of one single item. Quite often, however, I see programmers merrily copy and paste lists of items to new tests because, well, we find that easier.

<aside markdown="1">Now that I say this, perhaps I should add a test for `testIsEmpty_BarelyNonEmptyList` in order to distinguish the cases. I'll add that to the to-do list I have by my computer.[^test-list]</aside>

[^test-list]: Do you feel distracted while programming? I have some suggestions for you at <//blog.jbrains.ca/permalink/avoid-distractions-while-programming>.

## Group Tests by Fixture

Long ago, [in a book far, far away](#junit-recipes), I wrote about grouping tests by fixture. I recommended that you "test behavior, not methods" (section 1.3.2) and "move special cases to their own fixture" (recipe 3.7). I gave some examples. It was fine. I encouraged the reader to remove duplication in the setup (now called `@Before`) code. More than anything else, however, **don't let tests twiddle the fixture**. If a handful of tests want to share a fixture, then I prefer that they *all* share the very same fixture, meaning the same objects in the same state. This becomes especially important when you start trying to reuse fixture objects using inheritance. (I used to do this; I tend not to do it any more. The cure always eventually hurts more than the disease.)

## Junk Drawer

You probably have a junk drawer in your house. You throw junk into it. Some of that junk you need, so you root around in it to find something specific, like a pen or a paperclip. Eventually, you find that you need a paperclip unusually often&mdash;usually to press a recessed **reset** button on some electronic thing&mdash;and so you decide to put the paperclip somewhere to make it easier to find. If you put it in its own little compartment, then you'll find it, but if you then start putting some other, not-so-related items in with the paperclip, then before long you find yourself with a second junk drawer.[^broken-window] Then a third. Then you just have junk everywhere. It doesn't work.

So it goes when you try to organise fixture objects into a *setup* function. This works great until the first time a test wants to change the fixture *just a little* for its own purposes. For the first test, you don't worry so much: you put it in the same test class, twiddle the fixture&mdash;what harm can one extra line of setup do?&mdash;then go along your merry way. The very next special case wants to twiddle the fixture in precisely the same way. Then a third. **Now is the time to move these three tests into their own test class with their own fixture**, as I recommended in _JUnit Recipes_. If you don't do this now, then before you know it, there's graffiti everywhere. Almost every test twiddles the fixture in some unexpected way. You find some of that fixture up in superclasses, and you become lost in a maze of `super()` calls that you need to make at *just the right time*, otherwise your tests vomit `NullPointerException`s all over the place.

Ewww. You should have moved those tests to their own fixture when you had the chance.

[^broken-window]: This phenomenon relates to the [Broken Windows Theory](https://en.wikipedia.org/wiki/Broken_windows_theory) in which once we decide not to repair the first broken window in a neighborhood, vandalism and further damage follows soon thereafter.


When you find a group of tests inside a larger test class, you can either extract those tests by fixture or by action.[^three-as] I used to think that choosing between these options amounted to black magic, "skill", or wisdom. Now I think I have a rule suitable for an *advanced beginner* (on the [Dreyfus](https://bit.ly/dreyfus-novice) model) to use.

> If you name your tests using a convention like `test<action>_<special case>`&mdash;for example, `testIsEmpty_NonEmptyList`&mdash;then examine the test names for patterns. First look for multiple groupings of the same set of *special case* words, then group those tests into a test class by fixture. Then look for multiple grounds of the same set of *action* words, then group those tests into a test class by action.

[^three-as]: Do you remember the "Three A's" of *arrange*, *act*, and *assert*? By *action* I mean the function that you intend to test with that test.

I think this works because the special case names generally correspond to similar fixtures. If you have a bunch of tests that need to operate on a "non-empty list", then you'll probably copy and paste the same three items into each list object in those tests. (I don't claim to call this a *good thing*, but we do it.) Moreover, if you try to organise the special case groupings by action instead, then you'll move those tests away from each other into separate test classes, even though they have similar setup code. This creates a cohesion problem[^cohesion] solved by reorganising those tests by similar fixture.

[^cohesion]: Although [we don't generally agree](https://link.jbrains.ca/11hmmkp) on how to define cohesion, I find it useful to move similar things closer together and keep dissimilar things farther apart. This leads me towards higher (better) cohesion.

## Group Tests First By Special Cases, Then By Actions

Returning to our tests for `ArrayList`, we have

* `testAdd_EmptyList`
* `testAdd_NonemptyList`
* `testAdd_ListAtCapacity`
* `testAdd_DuplicateItem`
* `testContains_ItemFound`
* `testContains_ItemNotFound`
* `testContains_DuplicateItem`
* `testSize_EmptyList`
* `testSize_NonEmptyList`
* `testIsEmpty_EmptyList`
* `testIsEmpty_NonEmptyList`
* `testIndexOf_ItemFound`
* `testIndexOf_ItemNotFound`
* `testTrimToCapacity_TrimmingNeeded`
* `testTrimToCapacity_TrimmingNotNeeded`

Following my proposed rule, I would end up first with these tests grouped by fixture:

* `EmptyListTest`
    * `testAdd`
    * `testSize`
    * `testIsEmpty`
* `NonEmptyListTest`
    * `testAdd`
    * `testSize`
    * `testIsEmpty`
* `BarelyNonEmptyListTest`
    * `testIsEmpty`
* `MatchingItemsTest`
    * `testContains`
    * `testIndexOf`
* `NotMatchingItemsTest`
    * `testContains`
    * `testIndexOf`
* `DuplicateMatchingItemsTest`
    * `testContains`
    * `testIndexOf`

Also these tests grouped by function&mdash;the junk drawers:

* `AddItemToListTest`
    * `testListAtCapacity`
    * `testListNotYetAtCapacity`
    * `testItemAlreadyInList`
* `TrimArrayListToCapacityTest`
    * `testNeedsTrimming`
    * `testDoesNotNeedTrimming`

Of course, this doesn't constitute an exhaustive test for `ArrayList`, but you get the idea. You'll notice that I've renamed some of the tests and added a few. By reorganizing the tests this way, a few ideas popped into my head, such as "adding an item when the list is not yet at capacity". When I first wrote this list of tests, I thought of "not yet at capacity" as an unstated default assumption. Since Java creates an `ArrayList` with a capacity of 10 items by default, I could think of `testAdd_EmptyList` as implicitly checking the "not yet at capacity" case. This kind of implicit checking can lead to "holes in our tests", which can lead to the dreaded "green bar, but there's a bug" problem that brings us back to my old favorite: [integrated tests are a scam](https://integrated-tests-are-a-scam.jbrains.ca). I don't want to go there just now.

Instead, let me close by proposing that you **try grouping tests first by repeated special cases (which correspond to similar fixtures), then by actions**. I think you'll like the results.

## "If I Group Tests Like This...

...then I won't be able to find anything!" Srsly, this is 2014. Don't you use `ag` or `ack` or `grep` or something? Can't you search your project for uses of the function `add()`, or at worst, the regular expression `/\.add(/`?!

## References

J. B. Rainsberger, <a name="junit-recipes">[_JUnit Recipes: Practical Methods for Programmer Testing_](https://link.jbrains.ca/TEDGGm)</a>. I wrote ten years ago about the benefits of organizing tests by fixture, rather than by function. I never felt truly comfortable with how easily the reader could apply that advice. This article attempts to assuage my guilt at giving such questionable advice.

J. B. Rainsberger, ["Integrated Tests are a Scam"](https://bit.ly/QWK7do). The talk as I performed it at DevConFu in Jurmala, Latvia in December 2013. Don't watch the Agile 2009 conference version any more.

J. B. Rainsberger, ["Integrated Tests are a Scam"](https://link.jbrains.ca/1npUxSf). The series of articles. Start with the oldest ones and work your way towards the present.

J. B. Rainsberger and friends, [Understanding Coupling and Cohesion](https://link.jbrains.ca/11hmmkp). 57 minutes of video. I invited some of my friends to discuss the nebulous concepts of coupling and cohesion in software design. How do we think about these topics? How do we understand the terms? How do we use that in our work as programmers? How do we teach it to others? How much does any of it even matter? Our invited guests: Corey Haines, Curtis Cooley, Dale Emery, J. B. Rainsberger, Jim Weirich, Kent Beck, Nat Pryce, Ron Jeffries.

J. B. Rainsberger, ["Avoiding Distractions While Programming"](https://link.jbrains.ca/2cZejnV). A quick introduction to keeping your head clear while programming.

---
title: "The Power of Precise Names: An Example"
date: 2023-04-28
tags:
    - Refactoring
    - Improving Names
    - Simple Design
summary: >
    Let's look at a simple example of a name. Let's judge the name (kindly!),
    then imagine some likely next steps in refactoring. We can learn and
    do quite a lot from only a single name!
---

A member of [The jbrains Experience](https://experience.jbrains.ca) posted about a name they had just encountered in their day-job code base:

<aside>
`compareReportedProfileToTargetProfileAndReportResultToSupervisor()`
</aside>

They reported that they'd already renamed the method, but I immediately saw it as an example of how naming fits together with refactoring. I wanted to combine a version of playing ["What's Not To Like About This Code?"](https://www.jbrains.ca/sessions/whats-not-to-like-about-this-code) with imagining how we might "fix" this method.

<aside>
I'd like to note before we start that **I don't know the context of this method, this code base, nor the group working in it**, so I couldn't possibly _recommend_ specific refactorings in this case. Instead, I intend only to explore what this name&mdash;all on its own&mdash;suggests to me.
</aside>

# What's To Like About This Name?

I really like this name, because [I find it **precise**](https://blog.thecodewhisperer.com/permalink/a-model-for-improving-names). (I can't judge whether it is **accurate**, so I have to hope that it is. Let me hope.) A precise name might overstate implementation details, but at least **it usually costs less to summarize implementation details than it costs to reverse-engineer them from a vague name**. Accordingly, although some might roll their eyes at this name for being "typical Java", I find its precision quite helpful.

## "And" or "Then"?

I immediately notice the word "and" have the impulse to change it to "then". I freely admit that this comes from, of all places, [the sitcom Frasier](https://www.youtube.com/watch?v=Jtq1EBMe1gQ&t=108s). In the episode, pedantic Frasier and Niles annoy their teacher by distinguishing carefully between "twist, then pull" (do the twisting, then afterward do the pulling) and "twist and pull" (maybe twist and pull at the same time). Although this kind of pedantry typically indicates occupying a [Blaming Stance](http://www.satirworkshops.com/files/Stances.pdf), I find it helpful when examining the names of things **in a code base, where precision is not only welcome but needed**.

**Does sequence matter here?** I don't know, but my experience tells me to err on the side of assuming that we must preserve the sequence of statements we find in unfamiliar code. This leads me to replace "and" with "then", then look for signs that "then" doesn't "sound right". You could think of this as the guideline **Assume "then", then hope for "and"**. If the sequence of statements doesn't matter, then we can freely reorder them without breaking the system, and that increases our options for refactoring. It also makes the code simpler by eliminating a detail that we'd otherwise need to know. Accordingly, I would rename this method by changing "and" to "then" until someone could state with confidence that the sequence of events is a free choice.

In this case, "compute X then report X to Y" seems very clear to me: we can't report X to Y until we've computed X.

## The Magic of "Then"

Once I introduce "then" into a function name, that suggests an obvious next step to me: **splitting the function into two composable parts**. Very often, I find each part easier to understand and test on its own. Almost always, I find that once I trust each part, **I don't need to test the composition**, because there is only one way to compose the parts, [it's clear, and it's obvious](https://junit.org/junit4/faq.html#best_3). In The Old Days, we talked about some code as "Too Simple to Break" as a way to decide how much testing was too much or just enough. I offer this guideline:

> If I trust `f()` and I trust `g()`, and there's only one way to compose `f` and `g` **and** that way is clear and obvious, then `compose(f, g)` is almost certainly Too Simple to Break.

I would like to emphasize one point: composing `f` and `g` will not break, but that doesn't mean that the composition does what you need. You might still need to check that the composition solves the business problem that you care about, but at least you'd feel comfortable and confident stating that whatever it does, it does _correctly_.

Returning to the example, I would expect to split this method into two parts: `compareReportedProfileToTargetProfile()` and `reportProfileComparisonResultToSupervisor()`. You'll notice that in the process of removing the second part from its context, I chose to add back some details in order to [increase clarity](https://blog.jbrains.ca/permalink/the-four-elements-of-simple-design). I did this **now, while the relevant details are fresh in my working memory**, rather than relying on someone to rediscover these details later and **under pressure**.

Next, I'd like to make the composition of these new functions clear and obvious. I imagine the code would look like this:

```
def compareReportedProfileToTargetProfileThenReportResultToSupervisor() {
    reportProfileComparisonResultToSupervisor(
        compareReportedProfileToTargetProfile()
    )
}
```

Even better, given my recent (but limited!) experience with languages such as PureScript, I imagine the code more like this:

```
compareReportedProfileToTargetProfileThenReportResultToSupervisor =
    compareReportedProfileToTargetProfile |> reportProfileComparisonResultToSupervisor
```

The function `|>` composes functions in a way that lets us read it the composition as "then" instead of the traditional "follows". This is a way to compose functions `f` and `g` when the output from `f` naturally becomes the input to `g`. In this situation, there is only one clear and obvious way to compose these functions. If we have any build-time type checking, then I would feel completely confident composing these functions without testing the composition.

This means, incidentally, that I expect `compareReportedProfileToTargetProfile()` to return some kind of Profile Comparison value and `reportProfileComparisonResultToSupervisor()` to need a Profile Comparison value as an argument. Here, the desirable structure of the composition matches the emerging names, which gives me a warm, fuzzy feeling that I'm on a good track.

## Not Pulling Its Weight

Next, I notice that the composition of these two functions doesn't seem to be pulling its weight, so I have the impulse to inline `compareReportedProfileToTargetProfileThenReportResultToSupervisor()`. I wouldn't do it yet, because it provides a Warm, Dry Place to keep refactoring the pieces, but I would expect to inline this Workflow function as part of Cleaning Up Before Moving On.

## Less Code, Fewer Distractions

Now that I've split the original function into two composable parts, I can focus on each part independently without feeling distracted by how to put them together. Putting them together has become clear and obvious. This eliminates potential distractions, helps me focus (narrow my attention), decreases the cost of noticing things, and thereby increases the likelihood that I'll notice things.

## Context-Dependent Code

The name `compareReportedProfileToTargetProfile()` bothers me because it seems to overstate its context. My intuition is screaming at me:

> Surely we don't need to know that it's a _reported_ profile and a _target_ profile that we're comparing! Comparing profiles is comparing profiles, isn't it?!

I certainly hope so. Now I feel the impulse to rename this function to `compareProfiles(a, b)`. This removes the function from its context, making it [less expensive to use in new contexts]({% link _posts/2016-02-04-how-reuse-happens.md %}), which makes reuse more likely to happen.

**Wait... won't we lose the context?** No. When we rename `compareReportedProfileToTargetProfile()` to `compareProfiles()`, the context will remain in the hands of the client, where it belongs. The names of the arguments will carry the context from now on.

```
compareReportedProfileToTargetProfileThenReportResultToSupervisor =
    compareProfiles reportedProfile targetProfile
        |> reportProfileComparisonResultToSupervisor
```

If we were writing this the Object-Oriented Way, then it would look more like this:

```
def compareReportedProfileToTargetProfileThenReportResultToSupervisor() {
    reportProfileComparisonResultToSupervisor(
        reportedProfile.compareTo(targetProfile)
    )
}
```

### A Slight Detour

The method name `compareTo()` probably fits into some `Comparable` framework so that generic algorithms can compare abstractly-comparable things. I don't know yet what a `Profile` is, but I know it's `Comparable`.

Since `Comparable` frameworks tend to reduce comparison to only "less than, equal to, or greater than", that might not suffice for our design. We might need a richer `ProfileComparison` value. In that case, I'd choose a different name to highlight that I'm not trying to fit `Profile` objects into the `Comparable` framework. That would leave us with a function such as this one:

```
def compareProfiles(first, second) {
    # I don't know how to compare profiles, but I'm sure it's interesting.
}
```

or, if we have type declarations to guide us:

```
compare :: Profile -> Profile -> ProfileComparison
compare aProfile anotherProfile = ...
```

Ooh! This could eventually turn into a generic comparison type...

```
compare :: forall a. a -> a -> Comparison a
```

...but I'm getting ahead of myself. **I don't mind thinking ahead, but I prefer not to design ahead**. This last step starts to move in the direction of the `Comparable` framework and we're not going there now. [Maybe later, maybe never](https://martinfowler.com/bliki/Yagni.html). **Once I see where I might go, I don't need to go there now**. Instead, I can consider it as part of Cleaning Up Before Moving On.

### Where Were We?

Ah, yes. We had removed the context from `compareReportedProfileToTargetProfile()`, turning it into the simpler `compareProfiles()`, or even simply `compare(Profile first, Profile second)`.

## "Report X to Y"

The phrase "report X to Y" sounds very strange to me when I see it in a codebase. Isn't that... just... applying a function?

```
def reportProfileComparisonResultToSupervisor(profileComparison, supervisor) {
    supervisor.doSomethingExcellentWith(profileComparison)
}
```

This function clearly doesn't pull its weight, so I'd inline it.

```
reportProfileComparisonResultToSupervisor profileComparison supervisor =
    doSomethingExcellentWith supervisor profileComparison
```

This version of the function makes it even more clear: `reportProfileComparisonResultToSupervisor()` acts as merely an alias for `doSomethingExcellentWith()`, so I'd inline it.

Unfortunately, sometimes the programmer doesn't see it this clearly, so they end up with indirection without abstraction.

### What Often Happens

Let us return to this form of the code:

```
def compareReportedProfileToTargetProfileThenReportResultToSupervisor() {
    reportProfileComparisonResultToSupervisor(
        reportedProfile.compareTo(targetProfile)
    )
}
```

Now, let us introduce the necessary details:

```
# Supervisor is a concrete type or a class.
def compareReportedProfileToTargetProfileThenReportResultToSupervisor(
    reportedProfile, targetProfile, Supervisor supervisor) {

    reportProfileComparisonResultToSupervisor(
        supervisor,
        reportedProfile.compareTo(targetProfile),
    )
}
```

In order to test this, many programmers start reasonably enough by introducing an abstract supervisor so that they can "mock" (set expectations on) the supervisor and detect whether it was invoked correctly.

```
# I don't recommend naming interfaces starting with "I", but I'm doing it
# here to emphasize that ISupervisor is an interface/abstraction.
def compareReportedProfileToTargetProfileThenReportResultToSupervisor(
    reportedProfile, targetProfile, ISupervisor supervisor) {

    supervisor.accept(
        reportedProfile.compareTo(targetProfile),
    )
}
```

This looks fine, but the resulting tests become quite annoying:

- I need to create two `Profile` that happen to compare to the `ProfileComparison` value that I care about.
- I need to expect that `supervisor.accept()` is called with that `ProfileComparison` value.

If I had 12 different `ProfileComparison` values, I'd be copying and pasting _a lot_ of irrelevant details from test to test. **And what exactly would I be testing here?** I'd be using the expectations on `supervisor.accept()` as an indirect way to check the result of `compareTo()`. I'd be testing `compareTo()`!

But... I could test it much more directly by simply invoking it and checking the result with `assertEquals()`!

This provides a textbook example of unhelpful indirection.

### Remove the Unhelpful Intermediary

I see this pattern often in code:

```
def workflow(a, b, c, target) {
    target.doSomethingWith(
        computeSomethingFrom(a, b, c)
    )
}
```

It seems perfectly reasonable, but it creates the exact testing headaches that I mentioned a moment ago. I find the design much simpler if I merely inline `workflow()` and treat the composition as "Too Simple to Break". The alternative is to extract an interface for `target`, but then `Target.accept()` becomes nothing more than an alias of "apply function" that can only apply functions to `Target` objects. You can see this with one simple refactoring: push `computeSomethingFrom(a, b, c)` up the call stack and you get:

```
def workflow(result, target) {
    target.doSomethingWith(result)
}
```

I hope we can all agree that `workflow()` is now nothing more than an alias for `doSomethingWith()`. Inline it! This is a textbook example of **unhelpful indirection**.

## The Final Result

We end up with code that looks like this:

```
compareProfiles reportedProfile targetProfile
    |> doSomethingImportantWithProfileComparison supervisor
```

or, if you prefer the OO version:

```
supervisor.doSomethingImportantWithProfileComparison(
    reportedProfile.compareTo(targetProfile)
)
```

Maybe `Supervisor` can behave like some generic `Consumer<ProfileComparison>`... no. Not yet. Maybe later, maybe never. I like that I had the impulse, but I don't need that now. **I'm ready to do that, but not eager to do that**.

When I see this result, I see two independent, easily-tested, easily-understood functions that I can compose in only one way that seems both clear and obvious, and therefore seems Too Simple to Break. That sounds like a win to me! **And all this by looking at a single name!**

# Epilog: Are You _Kidding_ Me?!

> J.&nbsp;B., you can't be serious! All this overengineering because of a single name?! What's _wrong_ with you?! This is why all you XP/TDD types seem like pointless thoughtleaders....

I understand, believe me. Does it help if I mention that **I had all these thoughts _and_ performed the corresponding the refactorings in about 30 seconds**? It seems interminable when we write about and read about it in gory detail, but it happens so quickly in the mind, especially for someone [with non-trivial experience](https://blog.jbrains.ca/permalink/test-driven-development-as-pragmatic-deliberate-practice). You might need 10 minutes to do all this the first time, but before long, you'll do it so effortlessly that you won't even notice it.

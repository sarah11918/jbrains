---
title: "What your tests don't need to know will hurt you"
lastUpdated: 2013-10-30
# tags:
---
<style type="text/css">
.rule { display: block; margin-left: 5%; margin-right: 5%; border: 3px solid; padding: 1em; }
.novice { display: block; margin-left: 5%; margin-right: 5%; font-style: bold; border: 3px solid; background-color: white; color: black; padding: 1em }
.aside { display: block; margin-left: 5%; margin-right: 5%; border: 1px solid; background-color: lightyellow; padding: 1em }
</style>

I just finished reading Brian Marick's article, ["Mocks, the removal of test detail, and dynamically-typed languages"](https://bit.ly/7WYg5i), which focused me on a design technique I use heavily: awareness of irrelevant details in tests. Referring back to [the four elements of simple design](https://bit.ly/2s96DC), I focus on irrelevant details in tests in order to help me maximize clarity in production code. Please allow me to sketch the ideas here.

I use the term _irrelevant detail_ to refer to any detail that does not contribute directly to the correctness of the behavior I've chosen to check. I know when I've bumped into an irrelevant detail: while writing the code that allows me to check something, I start typing something, then my shoulders slump and I exhale with annoyance. I think, *I shouldn't have to write this, because it has nothing to do with what I want to check*. Brian's example illustrates this perfectly:

> The random methods save a good deal of setup by defaulting unmentioned parameters and by hiding the fact that Reservations have_many Groups, Groups have_many Uses, and each Use has an Animal and a Procedure. But they still distract the eye with irrelevant information. For example, the controller method we’re writing really cares nothing for the existence of Reservations or Procedures–but the test has to mention them.

I maintain one Ruby code base, which runs [my weblog at jbrains.ca](https://www.jbrains.ca) and I often find myself creating a `Posting` object in my tests, and often the content of that posting doesn't matter.

{% gist 276920 %}

I use a simple rule to help me identify irrelevant data in tests.

<p class="rule" markdown="1">If I can change a value without changing the result of the behavior I want to check, then I call that <strong>irrelevant data</strong> for this test.</p>

I first identify data as irrelevant and mark it that way. For string values, I include the word "irrelevant" in the string. Some people use words like "dummy" for this purpose, but I prefer "irrelevant", because I don't want others to confuse an irrelevant detail for [a type of stub](https://bit.ly/5hU90b). I used to simply choose random values for irrelevant data, because I had read that good testing principles included varying data from test to test. Now I feel that choosing especially meaningful-looking values for irrelevant data obscures the purpose of a test.

Irrelevant data can hurt in a number of ways.

- You might "play it safe" and duplicate the irrelevant data in more tests, leading to [excess investment](https://bit.ly/5ljblU) in maintaining your tests.
- You might "play it safe" and check the irrelevant data in your test, leading to misleading failures as you change unrelated behavior in the system.
- Changing the data might affect the result (pass/fail) of your test even though the data does not relate conceptually to the behavior you want to check.

I estimate that I have experienced more pain from this last effect than from all other effects combined.

Once I have identified and labeled irrelevant data, I look for ways to eliminate it. Moving irrelevant data into fixtures or [test data builders](https://natpryce.com/articles/000714.html), hides the symptoms without solving the problem. Ironically, moving irrelevant data into fixtures or test data builders merely makes that data easier to spread to more tests to which they do not relate, creating more, not less, potential for unhealthy dependency. It masks the very kind of observation that Brian made in his code base. Sometimes, I write a test and notice that, for some piece of data, neither its value nor its type matters to me. I find this happens a lot when I test-drive controller behavior that takes data from a model and hands it directly to a view.

{% gist 276954 %}

I notice here that `[1,2,3]` represents "any non-empty array". While writing this sentence, I wondered if I could change this to `Object.new`, so I tried that, and the test passed. In this case, while the actual data and type don't matter, I need the model to return anything but `nil` to ensure that the view has *something* and that that something came from the model. With this realization, I rewrote the test.

{% gist 276958 %}

Instead of `should ==` I use `should equal()` here, which translates to `assertSame()` in other languages, to emphasize that I expect the controller to take whatever it receives from the model and hand it to the view. When I want to check what the view does with it, I'll send valid data to the view and check it in isolation. When I want to check what the model returns, I'll look at what the view expects and check that the model can provide it. The controller need not bother itself with the details.

Compare this with the corresponding integration test for checking the controller, which would require knowing all these otherwise irrelevant things and setting all this otherwise irrelevant data...

- How to create a `Posting` in the database in the "queued for publication" state, which means setting the `queued_at` attribute to a time in the past, but the `published_at` attribute to `nil`.
- How to instantiate a valid `Posting`, which requires `title` and `content`.
- Which view the controller renders when it displays the publication queue.
- Which attributes of the `Posting` the view expects, to ensure that I populate them with valid, if meaningless, data.

I suppose I could think of more irrelevant behavior and data, but this will do. How does this irrelevant data and behavior hurt specifically in this situation?

- I have this note in my problems list: "A Posting can be both queued and published. I want to remove this possibility, rather than forcing Posting to maintain the invariant." When I fix this problem, my controller test will change, even though I won't have changed the controller.
- If I added a mandatory attribute to `Posting`, then my controller test would change, even though I wouldn't have changed the controller.
- If I removed a mandatory attribute from `Posting`, then my controller test would have even more irrelevant data, meaning more accidental ways to go wrong.
- If I changed the view that the `:new` action renders, then my controller test would change, even though I wouldn't have changed the controller behavior that my test checks.
- If I changed which attributes of `Posting` the view processed, then my controller test would either need to change or contain even more irrelevant details than it did before.

When I write that [integrated tests are a scam](https://bit.ly/8uQruT), I include as a reason that writing integration tests encourages including irrelevant details in tests, and by now I hope I've shown some ways that that hurts. All this leaves me with a few guiding principles to use when writing tests.

<p class="rule" markdown="1">A test should make it clear how its expected output relates to its input.</p>

<p class="aside" markdown="1">I looked back at ["JUnit Recipes"](https://bit.ly/7deOZD) to find out whether I'd mentioned this guideline back then. I couldn't find it.</p>

I can use this guiding principle to develop some [Novice rules](https://bit.ly/sYj5Y):

<p class="novice" markdown="1">Mark all irrelevant data in a test by extracting the values to variables whose name includes the word "irrelevant".</p>
<p class="novice" markdown="1">Hide all irrelevant data using techniques like the [Test Data Builder pattern](https://bit.ly/2oJaTU). Remember to remove duplication after hiding irrelevant data.</p>
<p class="novice" markdown="1">Call attention to all input values that have a direct bearing on computing the expected result in a test.</p>

Beyond these novice rules, this guiding principle helps in two key ways. Certainly, it encourages me to write shorter, more focused tests, which tend to have [all the properties I want in a test](https://bit.ly/6PlzxY), but more importantly, it leads me to a higher guiding principle when writing tests.

<p class="rule" markdown="1">When you find it difficult to write a concise, focused, isolated test, the production code has unhealthy dependencies to loosen, invert, or break.</p>

Here, "concise" means having no irrelevant details; "focused" means failing for only one reason; "isolated" means executing without side effects on other tests.

I loosen dependencies by applying the [Generalize Declared Type](https://bit.ly/6qPmLI) refactoring. I most commonly invert dependencies by [extracting an interface](https://bit.ly/4DAxuL) and using [constructor injection](https://bit.ly/6oNM2x). I most commonly break dependencies by either extracting a [memento](https://bit.ly/5RtSNi) or the return value of a method and depending on that, rather than the original object.

This guiding principle leads me in the direction of *The Fundamental Theorem of Test-Driven Development*.

> **Assuming we know what we want to check and understand the mechanics of how to check it, difficulty checking behavior means unhealthy dependencies in the design.**

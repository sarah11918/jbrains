---
title: "You Don't Hate Mocks; You Hate Side-Effects"
date: 2020-05-02
lastUpdated: 2021-09-05
tags:
    - Test Doubles
    - Simple Design
    - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
# summary: >
#     If you read enough articles on TDD and testing, you'll find authors who view mocks
#     with significant suspicion. I think that they criticize the symptom and not the cause.
#     If you count yourself among these people, then you don't hate mocks, you hate side-effects.
#     I don't _hate_ side-effects, but I feel glad that I've learned how to refactor away from them.
cover:
    image: https://images.jbrains.ca/twitter-cards/way-wrong-1245111-639x426.jpg
    alt: "WAY WRONG stencilled in yellow on the pavement."
---

You don't hate mocks; you hate side-effects.[^hate] When a mock annoys you, it realizes its purpose, showing you where a side-effect is getting in your way. If you refactor away from the side-effect, then you eliminate the mock. The mock is a **consequence of your pain**, not the cause of it. Please don't blame the poor mock for doing its job.

[^hate]: OK, maybe you don't hate _anything_, but some programmers do. I'm using the phrase a bit provocatively here. If you prefer, substitute the opening "You don't mistrust mocks; you mistrust side-effects". It has less punch, but it's likely more accurate. Sorry.

## Clarifying Terms

<img class="paragraph-eyecatcher" src="{% link images/icons/noun_translate_1926172.png %}"></img>

Here, when I say _mock_ I specifically mean an _expectation_, often implemented by library functions with names like `verify()`, `expect().toHaveBeenCalled()` and `should_receive`. I don't mean the general concept commonly known as "mock objects", which I prefer to call _test doubles_. For the rest of this article, **I'll use the word _mock_ to refer specifically to this narrower term**. If you don't feel confident that you understand this distinction, then I recommend Martin Fowler's classic ["Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html) as well as my ["I Like Mocks, But I Distrust Spies"](https://blog.thecodewhisperer.com/permalink/i-like-mocks) to illustrate some of the differences.

## "Sigh... Clickbait"

Yes, somewhat. Sorry. Marketing.

If you prefer, think of this article as _On the nature of excessive function expectations and how they merely reflect an excess of side-effects_.

## Test Doubles: Consequence, Not Cause

I don't consider myself a member of any one school of TDD; I sampled them all and settled on a personal style. I lean towards the London school in that I don't fear test doubles---I don't consider them a thing to avoid. On the contrary, I value them as a design tool. (Read on.) By the same token, I don't keep them for the sake of having them. As I'll argue here, [certain design improvements have the side-effect (pun intended) of eliminating some test doubles]({% link _posts/2013-11-23-beyond-mock-objects.md %}). This means in particular that [I don't view test doubles as a thing to either embrace nor avoid](https://www.tddstpau.li/). I use them when I think in terms of side-effects, which I tend to do because of the Object-Oriented Programming influences around me during my formative years of learning about software design. Even though I embrace test doubles in my practice, **I tend to *gradually* refactor away from them** as I get features running, then later feel the urge to reduce mutability and apply the [Dependency Inversion Principle](https://dependency-inversion-principe.jbrains.ca) more aggressively. The presence or not of test doubles becomes a consequence of my approach, rather than a primary consideration in how I practise TDD.

I considered myself a London school pupil while I was progressing through my Advanced Beginner stage of evolutionary design practice, on my way towards the Competent stage.[^dreyfus-model] I saw [what Steve Freeman, Nat Pryce, and the rest of the London crowd were doing](https://www.amazon.com/Growing-Object-Oriented-Software-Addison-Wesley-Signature-ebook/dp/B002TIOYVW?crid=2KC04XG3QJSNW&dchild=1&keywords=growing+object-oriented+software%2C+guided+by+tests&qid=1630840586&sprefix=growing+object-o%2Caps%2C188&sr=8-1&linkCode=ll1&tag=jbrains.ca-20&linkId=b267dfeae92f84b4695a5e77d23deb2a&language=en_US&ref_=as_li_ss_tl), I liked the direction they were going in, and I felt I could do what they were doing to achieve similar success in my designs, and so I chose to follow them for a while. Although I no longer consider myself a student of the London school---and I am certainly not any kind of _adherent_---I'm happy to have spent several "semesters" there learning with the leaders I found there. I can test-drive in the London style when the situation calls for it and I teach the style because I find that **it helps programmers feel more fully the pain of side-effects** so that they will sooner appreciate the [value of both immutability and pull unstable details up the call stack](https://www.youtube.com/watch?v=eOYal8elnZk). I hope to make this concept appealing and practical, rather than confining it to the pages of textbooks. (They're *really* good textbooks!) I have noticed that **struggling to tame test doubles tends to lead programmers towards deeply appreciating the value of immutability and abstraction**. It helps them embrace the Dependency Inversion Principle sooner, leading to designs with more-helpful abstractions that are generally more resilient to change, composed of smaller, more-recombinable parts.

<div class="highlight" markdown="1">
Rather than avoid test doubles, many programmers benefit from overusing them in order to "make more real" the forces that increase/decrease the cost of changing code. I consider it a natural part of the learning process.
</div>

The rest of this article describes how this approach works in practice.

[^dreyfus-model]: These terms come from the Dreyfus Model of Skill Acquisition. It's just a model; it's not a law. These terms help me succinctly describe different stages of learning that people commonly encounter. I don't use the model for anything more sophisticated than that. I find the names of the stages unnecessarily judgmental, but since they have established meaning, I continue to use them.

## You Could Try Using Integrated Tests, But...

[I've written and spoken about this extensively since about 2003](https://integrated-tests-are-a-scam.jbrains.ca). Let me summarize my current thinking (as of early 2020), so that you don't need to read everything that came before until you feel like it.

- Integrated tests, running larger portions of the system at once, make it more difficult to isolate the cause of behavior problems in code, so I prefer more-solitary (Fowler's term) or more-focused (my term) tests.
- Integrated tests run larger portion of the system at once, so they seem particularly ill-suited to try to detect a specific side-effect in the code. They can do so only indirectly in a way that the writer understands but that readers tend not to. This seems especially wasteful when one could otherwise simply use an _expectation_ (a "mock") to do exactly the same thing.
- If you replace side-effects with return values, then you simplify the nature of the corresponding tests. You can write more-focused tests without test doubles at all! Instead, you write straightforward tests with "assert equals".
- Relying on integrated tests leads over time to more-tangled code, which makes it harder over time to write focused tests, which encourages relying more on integrated tests. This feedback loop increases overinvestment in tests, either by writing too many expensive tests or getting too-little value from the tests you write.

## Programmers Aren't Listening To the Mocks

<img class="paragraph-eyecatcher" src="{% link images/icons/noun_deaf mute_3023646.png %}"></img>

I work with a handful of programmers each year who report having trouble with test doubles in general and with expectations in particular. Most often the trouble lies in two main areas:

- The programmer doesn't understand much about why to use test doubles, but since the project uses them, the programmer uses them. The programmer does the best they can to follow the local conventions, but ends up creating tangled messes in the tests that reflect tangled messes in the production code. They conclude that "test doubles are hard".
- The programmer tries to practise TDD in order to improve their results, but succumbs to schedule pressure and chooses to copy/paste complicated test double usage patterns in their tests, rather than refactoring. The programmer understands vaguely that test doubles can help them produce "better" designs, but lacks the experience to refactor towards those better designs, and so gives in to the pressure to finish features (real or imagined), resulting in convoluted tests that they understand while writing but fail to understand months later while reading.

In both cases, the programmer doesn't listen to the feedback that the excessive expectations are giving them. Sometimes they conclude that test doubles "are hard" or "don't work". Sometimes they conclude that they don't (yet) understand how to listen to the feedback from their test doubles and they never quite feel confident enough to take the time to practise and learn. **As a coach, I often (merely) provide the opportunity that those programmers need to practise and learn, even if I don't teach them anything new about how to design effectively with test doubles!**

## How You Might Benefit From Listening To Those Expectations

<img class="paragraph-eyecatcher" src="{% link images/icons/noun_Listen_1821643.png %}"></img>I remember first learning about functional programming and read something vague about programming without side-effects. This instruction felt sensible, but useless, because I didn't know how to start. I grew up learning object-oriented design as my primary way of thinking about modularity, so it felt perfectly natural for me to think in terms of side-effects. When I tried to understand what functional programming had to offer me, I tried to think differently, but couldn't. (Even in 2020 I have trouble doing so.) I felt as though my head kept hitting a brick wall.

As I experimented with refactoring away from side-effects, I gradually understood the relationship between side-effects and expectations. I gradually became comfortable refactoring away from side-effects, which helped me feel free to think directly in side-effects, then refactor away from them later. Accordingly, I stopped trying to force changes in how I think about modularity, which had the delightful effect of making it easier to think directly in terms of designs that push side-effects to the edges of the system, a style known as _functional core, imperative shell_. Maybe one day I'll think clearly and effortlessly directly in designs mostly devoid of side effects, but in the meantime, knowing how to refactor away from side-effects makes them temporary in my designs, so I don't need to feel resistance to putting them there. When expectations start to "feel funny" in my tests, I know that a troublesome side-effect has settled in to the design, but since I know how to refactor away from them, I feel no anxiety about them and I feel little resistance to removing them.

### Two Overall Strategies

I see two general strategies for refactoring away from side-effects: replace the effect with a return value or replace the effect with an event. The first eliminates the effect while the second merely reduces it in size. Both strategies help in different situations. I tend towards the first of these when I can clearly see how to do it well and I tend towards the second of these when I can see how a group of side-effects relate to each other and truly represent implementations of the same underlying event handler.

One common pattern for replacing the effect with a return value concerns the Collecting Parameter pattern: you pass a list into a function which might add values to that list. I can replace this mechanically with returning a list of values to add, then letting the invoker add those items to the list that it would otherwise pass into this function. This refactoring moves to design in the direction of using a common functional programming library function often known as `concat`, which takes a lists of lists and puts their elements all together into a single list. Now, of course, you don't need mocks to test a function that uses a Collecting Parameter, because you could simply create a collection in your tests and let the function append to that collection, but you could also apply the general principle of this refactoring to more-generic side effects than appending items to a list. I intend to write this as a more-detailed example in a future article, although I imagine you could find several examples right now from other authors who got there well before I did. **We always have the option of replacing a side-effect with returning a value that represents the effect, as long as we can instruct the clients to interpret that value as a command to execute.**

Regarding a group of related side-effects, if I notice such a group that always happen at the same time in the code, then I see them as all responses to the same event. From here, I turn them into literal implementations of the same event interface (first lambdas, then maybe eventually as implementations of the same interface), then [invert the dependency](https://dependency-inversion-principle.jbrains.ca) so that these implementors subscribe to the event, rather than the broadcaster knowing exactly which actions to perform. This makes the design more flexible, simplifies the test, and makes me aware of previously-unnoticed tangles among the various actions/responses/subscribers, if any exist. This relates in a significantly more-recombinable design **We always have the option of replacing a group of related side-effects with firing a single event whose subscribers are those various side-effects, which often helps us keep those side-effects from becoming dangerously entangled with one another.**

## Thank You, Excessive Expectations!

<img class="paragraph-eyecatcher" src="{% link images/icons/noun_canary_2535720.png %}"></img>

I think of excessive expectations as the canary in the coal mine: a helpful alarm signal worthy of my gratitude. Thank you, excessive expectations, for alerting me to a design problem before it spirals out of control!

# References

J. B. Rainsberger, ["Beyond Mock Objects"]({% link _posts/2013-11-23-beyond-mock-objects.md %}). A more-detailed example of one way to refactor that reduces the need for test doubles.

---
title: "Refactoring Test Doubles: From Stubs to Parsing"
date: 2023-07-18
tags:
  - Simple Design
  - Mock Objects
  - Refactoring
# summary: >
#   When you notice that you need "too many" stubs
#   (mocks for querying data), you have at least two helpful
#   options for refactoring. Here is an example of using
#   the more-aggressive of the two options: replacing a stub 
#   with the stubbed value.
---

<aside>
I considered calling this article "Stubs Aren't Parsers", in the grand tradition of ["Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html) and even "Stubs Aren't Mocks" (which I never wrote, but wanted to). I don't love the blaming tone of that title, even though it might feel catchy and [sticky](https://www.amazon.com/Made-Stick-Ideas-Survive-Others-ebook/dp/B000N2HCKQ?_encoding=UTF8&qid=1688552302&sr=8-1&linkCode=ll1&tag=jbrains.ca-20&linkId=40eae497bf4ee39d1706d043b781c655&language=en_US&ref_=as_li_ss_tl), so I've gone for a more-boring, less-blaming title.
</aside>

In his "The Hidden Cost of Mockito"[^replace-with-link], Lars Eckart presents an example in Java of refactoring code in a way that simplifies using Mockito in the corresponding unit tests. His example illustrates very nicely one of two helpful options for refactoring in this situation; I wanted to write this article to describe the other. I imagine that we could find even more helpful refactoring options than these two, but two options seem to me like a helpful place to start.

[^replace-with-link]: I will add a link once Lars publishes his article and I have a link to add.

# Not "Refactoring Away From Test Doubles"

First, let me clarify this point immediately: **I'm not criticizing Mockito nor test doubles (mock objects) in this article**. I don't offer you this an example of refactoring away from test doubles, but rather as an example of removing duplication, which just happens to result in removing some test doubles. Both of these statements are true:

- Just because they're test doubles, doesn't mean they're bad and we ought to try to eliminate them.
- Just because they're test doubles, doesn't mean they're good and we ought to use them everywhere all the time.

Instead, I offer this as an example of removing duplication and the duplication happens to be in stubs and the resulting design doesn't need as many stubs.

# The Plan

We start with tests that stub queries for the detailed data they need, since the Subject Under Test (a function) takes an interface as its only parameter. This makes the tests slightly annoying, because of the **indirect and noisy code that gets in the way of specifying the input of the test**. We see duplication in the stubs, and in particular, **duplication of irrelevant details** between the tests: I start noticing that I care only about the different input values to check and not where they come from.

We extract a smaller function whose parameter is **a Whole Value whose component values combine the return values of the various stubs**. This makes it easier to provide input directly to the test by creating the Whole Value directly without needing stubs. This leaves behind code that we might or might not judge as Too Simple to Break. It also opens up the opportunity for future refactorings that simplify the parts of the design that lie closer to the application framework boundary.

I consider this another example of the pattern of replacing "Supplier of T" with "T", which simplifies the production code a little and tests even more than that. This pattern **guides us towards extracting more Context-Independent Code**, which requires less effort to test and understand, which offers more opportunities for reuse, and which requires less effort to adapt to a new context.

I think of this as an easy refactoring, low on risk, but high on reward. Since it's easy, I tend to perform this refactoring early and aggressively. I don't remember the last time I regretted performing it.

<figure>
    <img src="{% link images/an-example-sticker.png %}" />
    <figcaption>Source: Brian Marick, <http://www.exampler.com/propaganda/></figcaption>
</figure>

# Start Here

Let us start with this typical-looking Java code that handles an HTTP request.

```java
// Library/framework types that we can't refactor
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;

class SignatureValidator {
    // Other details intentionally left out
    
    public void validateSignature(HttpHeaders headers) {
        if (headers.getHeaderString(DIGEST) == null 
           || headers.getHeaderString(SIGNATURE) == null) {
            ...
        } else {
            validateDigestHeader(headers);
            validateSignatureHeader(headers);
        }
    }

    private Map<String, String> getLowerCaseRequestHeaders(
        MultivaluedMap<String, String> requestHeaders) {
        
        final Map<String, String> lowerCaseRequestHeaders 
            = new HashMap<>();

        requestHeaders.forEach((key, value) ->
            lowerCaseRequestHeaders.put(
                key.toLowerCase(), requestHeaders.getFirst(key)
            )
        );

        return lowerCaseRequestHeaders;
    }
    ...
}
```

Nothing about this production code makes me vomit, but I see a few signals that capture my attention:

- Checking properties of a value for `null` usually means special-case handling of "invalid arguments". This tends to become tangled with the code that processes valid arguments, making both paths more annoying to test and understand.
- The names of the functions `validate*Header(headers)` give me the feeling that there will be more-complicated "validation" in the future, and the programmers will bash it over the head to fit the pattern of "validate blah-blah header".
- Duplication in the names between a higher-level function named "validate signature" and a lower-level function named "validate signature" signal a missing or unnamed idea. Leaving this idea unnamed or unidentified tends to cause us to refer to slightly different things with the same words. The confusion usually spreads through both the code and the project community.
- I'm willing to bet that the implementations of `validate*Header(headers)` will have more and more duplication over time among them and that those implementations likely don't actually care about checking HTTP request headers, but rather only the values they extract from those headers.

I don't think any of these signals rises to the level of "Fix me now!", but [I find it helpful to articulate the signals before I reply to them](https://www.jbrains.ca/sessions/whats-not-to-like-about-this-code). This guides me to slow down, think a bit more, and judge the urgency of the situation more clearly. For the purposes of this article, we'll refactor it anyway, setting aside the question of whether I would refactor it in an industrial-strength situations. It depends on the context and I'm not there right now.

# The Tests, As We First Encounter Them

Now let's consider a typical programmer who wants to write tests for this code.[^no-tdd-please] They choose to use test doubles ("mock objects") for this job, and they already know to **stub queries**, so they use stubs (not expectations/mocks) in place of the production implementation of `HttpHeaders`.[^ignore-the-reasons]

[^no-tdd-please]: For this article I have set aside whether this would or wouldn't have happened if the programmers had practised TDD. I know that I have written tests that look this like while practising TDD. I wouldn't do that nowadays, but that's precisely because I know the refactoring that this article is here to describe!
[^ignore-the-reasons]: For this article I have ignored the reasons why the programmer chose to use test doubles for this purpose. That's not what this article is about. Things are the way they are because they got that way.

<aside>
What's that? ["Don't mock types you don't own"](http://jmock.org/oopsla2004.pdf)? Yes, that provides a shortcut to the same destination, which means that even if you don't know this principle, you could (re)discover it for yourself!
</aside>

```java
@ExtendWith(MockitoExtension.class)
class SignatureValidatorTest {
    ...
    @Mock
    private HttpHeaders headers;
    private MultivaluedMap<String, String> requestHeaders;

    @BeforeEach
    void setUp() {
        headers = mock(HttpHeaders.class);

        when(headers.getHeaderString("Signature"))
            .thenReturn(SIGNATURE_HEADER);
        when(headers.getHeaderString("Digest"))
            .thenReturn(DIGEST_HEADER);
        when(headers.getHeaderString(HttpHeaders.CONTENT_TYPE))
            .thenReturn(APPLICATION_JSON);

        requestHeaders = new MultivaluedHashMap<>();
        requestHeaders.add("Signature", SIGNATURE_HEADER);
        requestHeaders.add("Digest", DIGEST_HEADER);
        requestHeaders.add("Content-Type", APPLICATION_JSON);

        when(headers.getRequestHeaders())
            .thenReturn(requestHeaders);
    }

    // 10 tests that achieve great coverage below this line
    ...
}
```

Here we focus on the test setup, which already shows some remarkable duplication: stubbing the same values two different ways with two different types! This happens often when we stub an interface that helpfully provides two views of the same data, such as `HttpServletRequest` does with `getParameter(name)` and `getParameterMap()`. This tends to lead to a Morton's Fork:

- stub both views of the data, whether we need them or not, for flexiblity's sake, but creating Excessive Test Setup, a special kind of Irrelevant Details in Tests.
- stub only one view of the data, because it's the only one we're using, coupling the tests to implementation details that are likely to change, which impedes future refactoring.

When both options feel wrong, I invoke [the wisdom of Joshua](https://www.imdb.com/title/tt0086567): the only winning move is not to play.

In his article, Lars describes one approach: introduce a Narrowing Interface which removes redundancy and simplifies the interaction between a Request Handler and the Supplier of HTTP Headers. I would like to describe another approach that helps: [blocking the kick by not being there](https://www.imdb.com/title/tt0087538).

## What Exactly Is the Challenge Here?

Some of you can't shake the feeling that this refactoring is an over-reaction. If you're one of those people, then try writing those tests, even if you merely sketch them on paper. When I do this, I notice the following annoying pattern: I have to stub a bunch of functions I don't care about to return values that I happen to know will pass "validation" (in the "are the HTTP Headers valid sense?", not in the "is this signature valid?" sense---confusing!) in order to trick the code into constructing the value I actually want to use to test the `validate*Header()` functions. **All the tests that check the `else` block want to assume that the `HttpHeaders` value represents a valid request, but they are forced to depend on the details of determining whether those headers are valid, which makes the tests vulnerable to changes in behavior they don't want to check.** Looking at this example, it's not really a problem... until one day it very suddenly is.

# Remove Duplication

How do we remove duplication in the test setup? Fortunately, the test setup reveals the answer itself: collect all the stubs into a single Whole Value and extract a function that takes that Whole Value as its parameter.

If we merely stubbed `headers.getRequestHeaders()`, then we would be choosing one of the terrible options I outlined earlier: coupling the tests to the implementation choices of the production code. That suggests taking one more step: instead of depending on the function that supplies "Request Headers as a Dictionary", let's instead depend on a function that _demands_ "Request Headers as a Dictionary".

```java
// Library/framework types that we can't refactor
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;

class SignatureValidator {
    // Other details intentionally left out
    
    public void validateSignature(HttpHeaders headers) {
        if (headers.getHeaderString(DIGEST) == null 
           || headers.getHeaderString(SIGNATURE) == null) {
            ...
        } else {
            // How many times are we going to type "request headers"?!
            validateSignatureHeaderValues(
                getLowerCaseRequestHeaders(
                    headers.getRequestHeaders()));
        }
    }

    // Visible for testing, which means eventually extracted to its own class.
    public void validateSignatureHeaderValues(Map<String, String> signatureValidationRequest) {
        validateDigestHeader(signatureValidationRequest);
        validateSignatureHeader(signatureValidationRequest);
    }
    ...
}
```

I don't love the new names, but I need to distinguish somehow between "validate signature" and "validate signature".

# Remove Duplication Again

The duplication between the various meanings of "validate signature" reflects a pattern that I see very often in code:

```
# Python-like syntax for no reason other than it's fun
doTheThing(valueTypeImposedByAnnoyingFramework):
    if (isValidAccordingToSomeRules(valueTypeImposedByAnnoyingFramework)):
        actuallyDoTheThingNow(valueTypeImposedByAnnoyingFramework)
    else:
        handleInvalidDataFromAnnoyingFramework()
```

The first "do the thing" feels like optimism, but the second "do the thing" is really, absolutely, definitely do the thing now, because we're super-duper sure that it's now safe to do the thing. So do the thing. Now.

<aside>
Quite often, in code bases, we start with a single "do the thing", but then we need to add some kind of input data validation when it comes time to expose `doTheThing()` to the Horrible Outside World---as an HTTP service endpoint, for example. We have the impulse to call the request handler `doTheThing()`, because it also does the thing. This creates confusion between "do the thing" (unless the HTTP request isn't right) and "do the thing" (for real, for real this time).
</aside>

When I see this copied and pasted throughout an application, I feel confident about two things:

- The corresponding tests are riddled with duplication, making them annoying to read.
- I can look like a wizard by simply extracting a Controller layer. (Branding. You know how it goes.)

The hardest-to-read tests are usually the ones that want to focus on "actually do the thing now" and ignore "is valid according to some rules" by **assuming that the input is always valid, no matter what those rules are**.[^abstraction] Some folks will extract the method `isValidAccordingToSomeRules()`, move it onto an interface, then stub it to return `true` in all the tests. This helps clarify the intention of the test, but it points directly to one more helpful pattern described in Alexis King's now-classic essay, ["Parse, Don't Validate"](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/).

[^abstraction]: That's one of the points of _abstraction_: to be able to depend on the result without having to know or care about how the result was calculated.

Please don't panic about the Haskell code samples; I don't quite understand them myself. Even so, I can summarize a key point from that article---*deep breath*: **Instead of validating input, then passing valid values on the rest of the system directly, mark the value as "valid" somehow, so that future clients will not feel as though they need to check it again for validity, especially since they have absolutely no intention of defending themselves against invalid values, because they expect someone to have already done that by the time the data reaches them.** That's what I understanding by _parsing_ instead of _validating_: when we parse the `HttpHeaders` value, we decide (once and for all) whether it is (syntactically) valid or not, then transform it into a Whole Value Type that's convenient for the rest of the system---one that clearly represents parsing failure or another that clearly represents parsing success. From that point forward, **there is no confusion about whether to trust the value we have in our hands**.

This might sound like a complicated design choice, but it simplifies things quite significantly and pleasantly.

```java
// Library/framework types that we can't refactor
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;

class SignatureValidator {
    // Other details intentionally left out

    // This pattern looks like it could be extracted to a library function.
    public void validateSignature(HttpHeaders headers) {
        try {
            handleValidateSignatureRequest(
                ValidateSignatureRequest.parseHttpHeaders(headers)
            );
        }
        catch (HttpHeadersParsingException handled) {
            ...
        }
    }

    public static class ValidateSignatureRequest {
        public static ValidateSignatureRequest parseHttpHeaders(
            HttpHeaders headers) {
            
            if (headers.getHeaderString(DIGEST) == null 
               || headers.getHeaderString(SIGNATURE) == null) {
                throw new ParsingException(...helpful details...);
            } else {
                return new ValidateSignatureRequest(...header values...);
            }
        }
        ...
    }

    // Renamed, because now we can more-easily distinguish it from the
    // framework request handler method.
    // 
    // Look at that! It can move into class ValidateSignatureRequest now!
    public void handleValidateSignatureRequest(
        ValidateSignatureRequest validateSignatureRequest) {
        
        validateDigestHeader(validateSignatureRequest);
        validateSignatureHeader(validateSignatureRequest);
    }
    ...
}
```

Let's imagine the tests for these functions...

- `ValidateSignatureRequest.parseHttpHeaders()`: maybe we stub `HttpHeaders` and maybe we write integrated tests that talk to an HTTP server running in embedded mode in memory. Either way, we reduce the number of tests that duplicate irrelevant details. All the HTTP nonsense happens here.
- The `catch` block: we can extract a function that takes the exception value as a parameter and decides how to signal the error back to the framework. It's very likely that this code has very little to do with our Domain and everything to do with Annoying Framework. It almost certainly becomes reusable and part of a [Local Extension](https://www.refactoring.com/catalog/introduceLocalExtension.html) to Annoying Framework. There might even be a library function or two in Annoying Framework that already does what we want! All the Annoying Framework nonsense happens here.
- `handleValidateSignatureRequest()` now knows nothing at all about HTTP nor Annoying Framework, which makes it significantly less annoying to test. It can also safely assume that any `ValidateSignatureRequest` value is syntactically valid, because its constructors can stop you from creating invalid values.

When the three kinds of behavior are tangled together, it's easy to become too tired to write thorough tests for each part. When I encounter code bases like this, **I routinely find at least one missing test that the local programmers agree that they wish they'd written**. When we untangle those behaviors, that drastically increases the chances that the programmers will choose to write all the tests they believe they need. (Even if they "get that wrong", I feel much more satisfied when they've made a conscious choice, rather than been driven by frustration and exhaustion to cut corners.)

## Don't We Need To Test the Request Handler?

Well... test wherever you need more confidence!

If you wrote thorough tests for `SignatureValidator.validateSignature(HttpHeaders headers)`, then you'd notice yourself writing very similar tests for the next Controller. And the next Controller. And the next Controller. Eventually, you'd decide that as long as you followed the pattern and tested all the Steps of the "standard Workflow", then you wouldn't need to test the Workflow any more. That works for me!

You could even extract the Workflow to its own function and test it thoroughly, if you liked.

```java
import javax.ws.rs.core.HttpHeaders;

class StandardControllerWorkflow<ApplicationRequestType> {
    private final ParseHttpHeaders parseHttpHeaders;
    private final Consumer<ApplicationRequestType> requestProcessor;
    private final Consumer<HttpHeadersParsingException> invalidRequestHandler;

    public void acceptHttpHeaders(HttpHeaders headers) {
        try {
            requestProcessor.accept(
                parseHttpHeaders.parse(headers)
            );
        }
        catch (HttpHeadersParsingException handled) {
            invalidRequestHandler.accept(handled);
        }
    }
}
```

When you use this to create Controllers in Annoying Framework, the resulting code seems Too Simple to Break, especially if you already trust the Workflow.

```java
class SignatureValidator {
    private final StandardControllerWorkflow<ValidateSignatureRequest> workflow
        = new StandardControllerWorkflow<ValidateSignatureRequest>(...);

    // This pattern looks like it could be extracted to a library function.
    public void validateSignature(HttpHeaders headers) {
        workflow.acceptHttpHeaders(headers);
    }
}
```

You could go even further, replacing this compile-time class with an Abstract Factory, but that's a digression for the purposes of this article. I wouldn't _rush_ to do it, but I could seem myself eventually doing it.

# Simpler, But Not Easier, Except Also Easier

This design exemplifies the distinctions between "simple" and "easy":

- simpler: has fewer moving parts, can be understood by knowing fewer things
- easier: requires less effort to produce

This design seems to me to make the production code simpler, but not easier while making the tests both simpler and easier. Notably, the "process valid request" tests no longer need to even _think_ about invalid request values, whereas the "check the HTTP Headers" tests no longer need to even _think_ about how the Controller might want to process a valid request. **This isolation makes those easier to write, so we're more likely write them all, and even more importantly, simpler to understand, so we're less likely to doubt them when we encounter them again in six months, trying to fix a defect**.

# Conclusion

Here I describe a pattern for simplifying the Controller layer in a typical application using a typical Application Framework. This pattern results in more-focused tests with fewer unpleasant surprises, more opportunities for reuse, easier-to-grasp Domain Behavior, and just happens to reduce the reliance on test doubles. Between this pattern and the one that Lars Eckart describes in his article, you now have two ways to improve the design of this part of your applications:

- Hide Annoying Framework details behind a Narrower Interface That You Control.
- Avoid Annoying Framework details entirely by decoupling from them more aggressively.

Which should you choose? I don't know. You decide. You can imagine the first one as an intermediate step towards the second one. You can imagine the first one as a compromise when someone labels the second one as "overengineering".

Do what makes you happy. 

You can choose.

# Epilog

Functional Programming design gives us another interesting step to consider: Replace Custom Code with Library Functions. This example is a _purely mechanical refactoring_, a phrase I use to describe refactorings that you can perform safely even when you don't understand the intention of the code. The specific refactoring in question is **Replace Exception with Either**. If you don't know about the Either type, then you can safely ignore this epilogue _or_ use it as a chance to become acquainted with the type. If you know the Either type, then you might know that [Vavr](https://vavr.io) has become a standard third-party library for Java programmers interested in FP design and provides the Either type.. This means that we have the option of performing this refactoring in Java with Vavr.

We could replace this:

```java
// Both paths return values of the same type.
try {
    return happyPath.accept(parser.parse(...input...));
}
catch (Exception handled) {
    return recoveryStrategy.accept(handled);
}
```

with this:

```java
return parser.parse(...input...)
    .fold(
        parsingFailure -> recoveryStrategy.accept(parsingFailure),
        parsedValue -> happyPath.accept(parsedValue)
    );
```

by changing `parse()` to return `Either<Exception, ParsedValue>` instead of maybe returning `ParsedValue` and maybe throwing `Exception`. And nothing requires the "failure" value type of an `Either` to be an `Exception`: it can be any type you like. I tend to prefer to use simple Whole Value types or records to represent failure values.

Now, I think, it becomes even clearer that this is a standard pattern that we can trust: it's literally a library function, albeit one with the quirky name `fold()`. (I think of `fold()` as "take a bunch of values and fold them into a single value". You might know it as `reduce()`.)

And if you prefer, you could use Java's lambda expression syntax to make the code even more concise and easier to skim:

```java
return parser.parse(...input...).fold(
    recoveryStrategy::accept,
    happyPath::accept
);
```

If you're familiar with this syntax, then you might prefer to read this, but if you're not familiar with it, then it might look alien. You decide which version you prefer and which version better meets the needs of your project community.

In our case, unfortunately, Annoying Framework's request handlers return nothing (`void`) instead of something. This means that Annoying Framework actively resists Vavr, whose library functions generally prefer to work with higher-order functions that return a value, rather than quietly consume their input. You could still use Vavr for this purpose, but you might not like the results. You'll only find out if you try!


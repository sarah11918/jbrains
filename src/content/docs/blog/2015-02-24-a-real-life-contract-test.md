---
title: "A Real-Life Contract Test"
date: 2015-03-05
tags:
---
For years I've written about contract tests, and most notably have never had any clear examples of them to share with you. I'd like to change that today.

I'm sharing this with you as a **rough cut**, meaning that I haven't yet taken the time to seriously edit this, nor add much explanation. I feel tired just now, so I want to stop, but at the same time, my loyal readers deserve to see a real example.

I've spent the last few days messing around with the Atom text editor, writing a package for it that calculates some basic text document statistics. I started with [https://github.com/cjoh/status-stats](https://github.com/cjoh/status-stats), but noticed that this had fallen rather seriously out of date, and... well, I'll spare you the story. I'm here now.

## Get To The Point!

The text statistics library that @cjoh used doesn't count words correctly. (I'm working in [CoffeeScript](https://www.coffeescript.org).)

```
TextStatistics = require("text-statistics")

describe "The textStatistics API", ->
  describe "happy path example", ->
    it "sure as hell doesn't count words", ->
      textStatistics = new TextStatistics("What the fuck")
      expect(textStatistics.text).toBe("What the fuck.") # Works for me...
      expect(textStatistics.wordCount()).toBe(4) # I don't even...
```

Whatever.

I decided to look for a library that counts words correctly. I found one called `words.js`. (I could tell you a whole story here, but I won't.) It seems to count words correctly.

```
require("words.js")

describe "The Words API", ->
  describe "counting words", ->
    # CONTRACT
    # Words.count always answers a valid Number, even
    # when it encounters invalid input.
    # When the input is text, then .count appears to
    # answer the correct count of the words.
    # When the input is not text, then .count returns
    # an arbitrary Number, often 0.
    countWords = (text) ->
      new Words(text).count

    it "counts words, maybe", ->
      expect(countWords("There are four words!")).toBe(4)

    it "counts the empty string!!!111!1!1!", ->
      expect(countWords("")).toBe(0)

    it "gracefully handles null", ->
      expect(countWords(null)).toBe(0)
```

I wrote more, but you get the idea. When I felt confident that `words.js` counts words correctly, I decided to jump to the key question: _What contract does my package need with the thing that counts words?_ I decided on this:

* `countWords` turns text into a number
* `countWords`' return value represents the number of words in its input text, as long as the input consists of text
* if the input is not text, then `countWords` can return any number it likes, as long as it returns a number, and nothing else, and doesn't throw an error

This contract implies two things:

1. The invoker can't tell whether `countWords` has returned an accurate count of words, because `countWords` doesn't signal invalid input; **therefore**
2. The invoker shouldn't send `countWords` invalid input.

Fortunately as long as my package uses Atom correctly, this won't cause a problem. More importantly, my package will never cause Atom to blow up. In the worst case, it shows strange results on the status bar.

## Contract Tests, Dammit!

I found [this nice article](https://pivotallabs.com/drying-up-jasmine-specs-with-shared-behavior/) on shared examples for Jasmine, remembered how I used to write [parameterized test cases](https://duckduckgo.com/?q=parameterized+test+case+pattern) in Ruby, and eventually came up with this.

```
# countWords :: text -> number
theContractForCountingWords = (countWords) ->
  describe "The contract for Counting Words", ->
    describe "counting words accurately for valid input", ->
      it "counts words for a simple text", ->
        expect(countWords("A very simple text.")).toBe(4)

      it "counts words for a multiline text", ->
        expect(countWords("""
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Nullam eros urna, dictum quis magna a, bibendum porttitor
  ipsum. Donec ullamcorper ante ac eros auctor commodo.
  Pellentesque eu nulla in est congue porttitor. Phasellus
  quis pretium eros, eu sagittis nisi. Quisque at scelerisque
  metus. Etiam mollis velit nec mi malesuada rutrum. Maecenas
  in nibh et est suscipit bibendum quis et ligula. Sed
  scelerisque luctus justo. Integer eget eros aliquam, ultrices
  lorem ut, ornare metus. Duis vel varius felis.
  """)).toBe(77)

      it "handles the empty string", ->
        expect(countWords("")).toBe(0)

      it "handles non-empty whitespace", ->
        expect(countWords("\t\n\r \t\n \n\n\r")).toBe(0)

    describe "error paths, where it must not blow up", ->
      @specialCases =
        "null": null
        "NaN": NaN
        "an empty object": {}
        "an empty array": []
        "a non-empty object": {a: 1, b: 2, c: "hello" }
        "a non-empty array": [1, 2, 3, "hello"]

      @checks = (name, inputValue) ->
        it "does not throw an error when its input is #{name}", ->
          expect( ->
            countWords(inputValue)
          ).not.toThrow()

        it "returns a number when its input is #{name}", ->
          expect(typeof countWords(inputValue)).toBe("number")

      @checks(name, inputValue) for name, inputValue of @specialCases
```

We can implement the count words interface correctly (passing the contract tests) by simply delegating to `words.js`.

```
require("words.js")

countWordsWithWordsJs = (text) ->
  new Words(text).count

describe "Counting Words with Words.js", ->
  theContractForCountingWords(countWordsWithWordsJs)
```

I can freely use `words.js` in any object that exposes `countWords`, then show that that object respects the contract of `countWords`.

```
require("words.js")

class CountWordsWithWordsJs
  countWords = (text) ->
    new Words(text).count

describe "Counting Words with Words.js", ->
  theContractForCountingWords(new CountWordsWithWordsJs().countWords)
```

My next step involves exploring and clarifying the contract for two more little microfeatures before putting the whole thing together and shipping it.

## Shout Out

I would like to thank [Kevin Sawicki](https://github.com/kevinsawicki) for treating me so nicely as I made my first few microcontributions to Atom. Kevin, you have made me feel very welcome in your community.

## References

J. B. Rainsberger, ["Integrated Tests are a Scam"](https://vimeo.com/80533536). An hour-long talk, so save it for when you have the time. It presents how contract tests fit into my practice as a programmer.

c2.com Wiki Community, ["Abstract Test Cases"](https://www.c2.com/cgi/wiki?AbstractTestCases) When we first discussed contract tests, we called them "Abstract Test Cases", because we name things like programmers. I remember writing my example sometime in 2000. Of note: "This kind of test case ensures that concrete classes do not violate the contracts of their superclasses."

J. B. Rainsberger, [JUnit Recipes](https://link.jbrains.ca/1AHD22G) Recipe 2.6 "Test an interface" shows an early example of a contract test for Java's `Iterator` interface.

J. B. Rainsberger, ["In Brief: Contract Tests"]({% link _posts/2005-03-02-in-brief-contract-tests.md %}) The first time I can remember referring to them as "contract tests".

J. B. Rainsberger, ["Who Tests the Contract Tests?"]({% link _posts/2018-07-09-who-tests-the-contract-tests.md %}) How to keep contract tests in correspondence with implementation details tests.

Davis W. Frank, ["DRYing Up Jasmine Specs with Shared Behavior"](https://pivotallabs.com/drying-up-jasmine-specs-with-shared-behavior/). Obviously, exactly the way I do it in Ruby.

Web Search, ["Parameterized Test Case Pattern"](https://duckduckgo.com/?q=parameterized+test+case+pattern). Read lots on the subject. We've been doing this for a long time.

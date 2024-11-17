---
title: "Stop. Write a Learning Test."
date: 2011-12-14
lastUpdated: 2013-10-28
---

## The 30-second version

* [Where did that yak come from?](https://www.google.com/search?q=yak+shaving)
* When you try to learn a new library at the same time as explore the behavior and design of your application, you slow down more than you think.
* When you can't figure out how to make the new library work for this thing you want to build, you might spend hours fighting, debugging, swearing.

Stop. Write a Learning Test.

1. Start a new test suite, test class, spec file, whatever you want to call it.
1. Write a test that checks the things you tried to check earlier with debug statements.
1. Write a test that has nothing to do with your application and its domain.
1. Remove unnecessary details from your test.

When this test passes, then you understand what that part of the library does. If it behaves strangely, then you have the perfect test to send to the maintainers of the library.[^mistakes]

<!-- more -->

## The Details

I just did this on a project using the context-free grammar parser [*treetop*](https://github.com/nathansobo/treetop). Of course, I hadn't used *treetop* before, so I had to learn it at the same time as design the grammar for the language I wanted to parse. I reached the point where I couldn't write a *grammar rule* correctly, and spent probably an hour trying to figure out get it to work.[^2] Fortunately, at that moment, my laptop ran out of power, so I left the coffee shop[^3] and did the usual thing: [I explained the problem to my wife (herself not a programmer) so that I could hear myself doing that](https://c2.com/cgi/wiki?RubberDucking). After about 15 minutes away from the problem, I decided to write some [Learning Tests](https://c2.com/cgi/wiki?LearningTest).

## Summary of what I did

1. I wrote a Learning Test for a simple case that I thought I already understood well.
1. I wrote a Learning Test similar to the problem I had to deal with, to make sure I understood *that* well.
1. I wrote a Learning Test for the exact case that behaved unexpectedly.

The whole thing took an hour, and I understood the problem well enough to explain it to a non-programmer, my wife. She understood it and agreed that it sounded like a mistake in the library.[^4] I used this Learning Test to open an issue at github. Now I can proceed without pulling my own hair out.

## Do you want to see the Learning Tests?

This is the case I already understood well:

<pre>
require 'treetop'

describe "Grammar with a simple rule" do
  let(:subject) { Treetop.load_from_string(
&lt;&lt;GRAMMAR
grammar SimpleRule
  rule word
    [A-Za-z]+
  end
end
GRAMMAR
  )}

  let (:parser) { subject.new }

  it "doesn't match empty string" do
    parser.parse("").should be_false
  end

  context "matching single letter, the match result" do
    let(:result) { parser.parse("a") }

    it { result.should be_true }
    it { result.text_value.should == "a" }
    it { result.to_s.should_not == "a" }
    it { result.should_not respond_to(:word) }
  end

  context "matching many letters, the match result" do
    let(:result) { parser.parse("aBcDeF") }

    it { result.should be_true }
    it { result.text_value.should == "aBcDeF" }
    it { result.to_s.should_not == "aBcDeF" }
    it { result.should_not respond_to(:word) }
  end
end
</pre>

These are the cases I wasn't sure I understood:

<pre>
require 'treetop'

describe "Grammar with a simple rule that uses a label" do
  context "Labeled subexpression followed by another expression" do
    let(:subject) { Treetop.load_from_string(
&lt;&lt;GRAMMAR
grammar SimpleRuleWithLabel
  rule word
    letters:[A-Za-z]+ [A-Za-z]*
  end
end
GRAMMAR
    )}

    let (:parser) { subject.new }

    context "matching many letters, the match result" do
      let(:result) { parser.parse("aBcDeF") }

      it { result.should respond_to(:letters) }
      it { result.letters.text_value.should == "aBcDeF" }
    end
  end

  context "Labeled subexpression without another expression" do
    it "does not represent a valid grammar, even though I think it should" do
      lambda {
        Treetop.load_from_string(
&lt;&lt;GRAMMAR
grammar SimpleRuleWithLabel
  rule word
    letters:[A-Za-z]+
  end
end
GRAMMAR
      )}.should raise_error(RuntimeError, /Expected \#/)
    end

    it "really should let me refer to the expression as #letters" do
      pending "https://github.com/nathansobo/treetop/issues/21"
    end
  end
end
</pre>

[^mistakes]: Remember, we don't call them bugs anymore: we call them "mistakes". In this case, we can't call it a "mistake" yet, because we might simply have a difference of opinion or mindset.
[^2]: Note the wording: I already assuming that *I* have it right and *they* have it wrong. Bad programmer.
[^3]: They have a Second Cup in Romania. Canadians get why I'd find that weird.
[^4]: Smart woman, my wife.

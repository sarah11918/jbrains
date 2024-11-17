---
title: "Part 3: The Risks Associated with Lengthy Tests"
date: 2009-07-20
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
I just read a tweet from Dale Emery that turned my attention back to the topic of integration tests and their scamminess.

\[Tweet disappeared, courtesy of Tweetpaste. I don't have a link to the original any more. I apologise for that.\]

Since practitioners tend to write acceptance tests as end-to-end (or integration) tests, I think I can safely substitute the phrase “integration tests” here for “acceptance tests” and retain the essence of Dale’s meaning. I do this because I don’t want you to conclude from what I plan to write that I treat acceptance tests with the same disdain as I treat integration tests. I already went through that when Eric Lefevre-Ardant introduced us to [David, Agile Developer](https://agile2009.wordpress.com/2009/07/13/meet-david-agile-developer/), one of the personas that the Agile 200x conference has developed to help people choose sessions at the conference. While I felt flattered that he chose my session as one to attend, he accidentally misnamed it “Acceptance Tests Are A Scam”, which set off a miniature firestorm in Twitterland. In short: I like acceptance tests when we write them to confirm the presence of a feature; and I dislike them when programmers write integration tests, checking the design and behavior of large parts of the system, and call them “acceptance tests” to justify their existence.

Back to Dale’s question, which I paraphrase: how often do we write faulty integration tests, meaning that the test failure points to an error in the test, rather than in the production code? Rather than attempt to answer that question, I prefer to write about a strongly related idea: integration tests *necessarily* fail more frequently and in a more costly manner than isolated object tests, even when the underlying production code behaves as expected. To simplify the discourse a bit, let me introduce the term *unjustifiable test failure* to mean a test failure without a corresponding defect in the production code. When an incorrect test fails, I will call that failure unjustifiable.

The cost of unjustifiable test failures
---------------------------------------

An unjustifiable failure has both a clear cost an a hidden cost. We know the immediate, clear cost: an unjustifiable failure causes me to do root cause analysis on a nonexistent failure, which costs me something and gains me nothing. More insidious, though, persistent false failures erode my confidence in the tests. I tend to value the tests less. I run them less frequently, reducing the actual value I get from the resulting feedback. With less feedback comes less confidence in the code, and more conservative behavior. I change the code less frequently; I avoid extensive changes, even when they seem appropriate; I entertain fewer ideas because I can’t as easily predict the cost of the corresponding changes. I start designing not to lose, rather than designing to win. I can’t quantify that cost on a given project, but I know it in my heart and we could measure it over time. I think one should eliminate unjustifiable test failures where possible, or at least where easy, and integration tests simply cause an avoidably large number of unjustifiable failures.

Integration tests fail unjustifiably more frequently
----------------------------------------------------

Let me support this conjecture with two key arguments.

First, integration tests tend to require more lines of code than isolated object tests. Perhaps more formally, as we write more integration tests and more isolated object tests in a system, the average length of the integration tests becomes considerably larger—at least double—than the average length of the corresponding isolated object test. If we accept this premise, then combine it with the well-accepted premise that more code means more defects *in general*, then it follows directly that integration tests tend to have more defects than isolated object tests. This means that integration tests fail unjustifiably more frequently than isolated object tests.

Next, because integration tests rely on the correctness of more than one object, it follows directly that a defect in an object results in more integration test failures as compared to the number of failures in corresponding isolated object tests. That production defect, then, results in two classes of test failures: justifiable ones in tests designed to verify the defective behavior, and unjustifiable ones in tests design to verify another behavior, but that happen to execute the defective code.

> You can envision an example of the latter case by thinking of an integration test that verifies a specific alternate path in step 4 of a 5-step process. This test must execute steps 1 through 3 of the process in order to execute step 4, so if we have a defect in step 2 of the process, then this test fails unjustifiably, because it does not actively try to verify step 2. While the test failure can be justified by a defect in step 2, I call the failure *unjustifiable with respect to the behavior under test*, because this test does not deliberately attempt to test step 2. Presumably, we have tests that intend to test step 2, which justifiably fail.

Integration tests, then, result in unjustifiable failures by executing some potentially defective behavior without intending to verify it. While I wouldn’t call this a defect in the test, the test nevertheless fails unjustifiably.

I have tried here to describe the problem of unjustifiable test failures and to explain how integration tests necessarily result in more unjustifiable test failures than isolated object tests. I admit that I have not compared the cost of these unjustifiable test failures to the corresponding costs of writing isolated object tests. I cannot hope to complete a thorough quantitative study on the matter. Instead, I simply want to raise the issues, make some conjectures, reason well about them, then let the reader decide. I have decided to write more isolated object tests and fewer integration tests unless I find myself in a drastically different context than the ones I’ve seen over the past decade or so.

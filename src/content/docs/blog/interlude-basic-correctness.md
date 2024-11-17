---
title: "Interlude: Basic Correctness"
date: 2009-07-22
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
<p class="introductory-note" markdown="1">I tried to respond to a comment from James Bach, but surpassed the 3000-character limit, so I’ve decided to add this long comment as a short article.</p>

**James Bach**: I don’t understand the point of calling a failure discovered by running a test “unjustifiable.” Let me offer you a justification: I <span class="caps">WANT</span> TO <span class="caps">FIND</span> <span class="caps">BUGS</span>. :)

**J. B. Rainsberger**: Now now, changing the definition of a term on me constitutes dirty pool. Stop that! :)

**James Bach**: When you say ‘Presumably, we have tests that intend to test step 2, which justifiably fail’ I would say that sounds like a dangerous presumption. Just because we write a test, and that test has a purpose, does not mean the test achieves its purpose. In fact, as far as we know a test <span class="caps">NEVER</span> achieves its deeper purpose of finding all possible interesting bugs in the thing it is testing. Of course, when I test, I want to find all interesting bugs, and of course, I will never know that I have found all of them worth finding.

**J. B. Rainsberger**: I think you’ve taken my specific definition of “justifiable failure” and extended it past how I chose to use the term. When I write a test that fails because of a defect in the code that test intends to focus on, then I call that failure justifiable. All other failures are not justifiable. As a result, the statement you zeroed in on appears tautological to me… except my sloppy use of “presumably”. Let me clarify what I left unexpressed. Let’s assume that we have used integration tests to test the five-step process minimally broadly (in other words, we have written tests to find at least all basic correctness defects). That means that we’ve written some tests specifically to check step 2. Suppose now the existence of a defect in only step 2. When our test for step 4 fails because of the defect in step 2, the tests for step 2 fail justifiably, while the tests for step 4 fail unjustifiably. I haven’t yet turned my attention to latent and lurking defects, for the reason I provide at the end of this comment.

**James Bach**: … That’s why I use a diversified test strategy. It seems to me that complicated integration tests that cover ground also covered in other tests is a reasonable strategy— as long as it is not too expenses to produce or maintain. There is a cost/benefit that must be weighed against an opportunity cost, of course.

**J. B. Rainsberger**: I agree; however, I see too many programmers (in particular) using integration tests to help them find or avoid defects that much less expensive isolated object tests would better help them find or avoid. I center my entire argument on the thesis that too many programmers use these tests in a way that leads to considerable wasted effort in maintenance.

**James Bach**: So, perhaps you are talking about a restricted context where its not worth the effort of testing a particular function indirectly. Maybe not, but I bet it’s worth considering that sort of testing. Personally, I like automation that touches a lot of things in a lot of places, as long as I can create and maintain it without too much disruption of my sapient testing.

**J. B. Rainsberger**: Indeed so! I have wanted to reveal these points gradually so as to avoid writing 20,000 words at once, but I limit the arguments in this series to a specific context: programmers writing tests to show the basic correctness of their code. By *basic correctness* I refer to the myth of perfect technology: if I ran the system on perfect technology, would it (eventually) compute the right answer every time? I would call such a system *entirely basically correct*. While integration tests offer value in other contexts, too many programmers use them to show basic correctness, and when they do that they waste a tremendous amount of time and effort.

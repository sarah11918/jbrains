---
title: "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
date: 2009-04-05
lastUpdated: 2023-04-26
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
<section class="aside">

**UPDATE**. It's 2023 and although I still broadly agree with the _content_ of this article, I don't like the _style_ of it any more. I find it too abrasive and judgmental. I'm sorry about that.

I leave this article here because I'm not ready to rewrite it just yet. I almost certainly will, although I haven't decided when to do that. In the meantime, I've changed the title of this post to reflect my current thinking, even though I imagine that many readers will always refer to think as "Integrated (even Integration!) Tests Are A Scam". Popular names change slowly; I don't mind.

Integrated tests won't kill you, although the _scam_ remains a problem. Nowadays it has become worse as many distributed "microservices" architectures exhibit the same symptoms while adding the cost of having published APIs, thereby restricting their ability to refactor. If you thought refactoring with _mock objects_ was hard...!

I don't _hate_ integrated tests, but neither do I trust them. The theatrics in this article came at a time when I thought I needed to yell loudly and provocatively in order for people to listen. I wanted to capture their attention and I was playing around with some marketing/branding ideas. I don't want to rewrite history, but rest assured that I present these ideas with a much more moderate tone these days.

In other words, please don't let the abrasive and judgmental tone get in the way of whichever good ideas are still in here. One day I'll find the energy to write this again from the beginning in a style that reflects the more-moderate me. But the integrated tests scam will almost certainly still be a problem, whenever I finally sit down to do that. I still believe that.

</section>


<p style="font-size: small; font-style: italic;">On March 1, 2010 I changed the phrase &#8220;integration tests&#8221; to &#8220;integrated tests&#8221; in this article.</p>
<p><strong>Integrated tests are a scam&mdash;a self-replicating virus that threatens to infect your code base, your project, and your team with endless pain and suffering.</strong></p>
<p>Wait&#8230; <em>what?</em></p>
<aside markdown="1">
<p>Would you prefer to watch a video? {% include integrated-tests-are-a-scam-talk-video.html %}</p>
</aside>

<p><a href="https://integrated-tests-are-a-scam.jbrains.ca">Read more in this series</a></p>
<p>Integrated tests pose a significant risk to the health of your code base. If you're not careful, accumulating integrated tests will  gradually suffocate your code base, driving you to a place where you have to decide whether it would be cheaper to throw all your tests away and try again. Nobody should have to face that choice.</p>
<p>Of course, I should clarify what I mean by <em>integrated tests</em>, because, like any term in software, we probably don&#8217;t agree on a meaning for it.</p>
<blockquote>
<p>I use the term <em>integrated test</em> to mean any test whose result (pass or fail) depends on the correctness of the implementation of more than one piece of non-trivial behavior.</p>
</blockquote>
<p>I, too, would prefer a more rigorous definition, but this one works well for most code bases most of the time. I have a simple point: I generally don&#8217;t want to rely on tests that might fail for a variety of reasons. Those tests create more problems than they solve.</p>
<p>You write integrated tests because you can&#8217;t write perfect unit tests. You know this problem: all your unit tests pass, but someone finds a defect anyway. Sometimes you can explain this by finding an obvious unit test you simply missed, but sometimes you can&#8217;t. In those cases, you decide you need to write an integrated test to make sure that all the production implementations you use in the broken code path now work correctly together.</p>
<p>So far, no big deal, but you&#8217;ll meet the monster as soon as you think this:</p>
<blockquote>
<p>If we can find defects even when our tests pass 100%, and if I can only plug the hole with an integrated tests, then <em>we&#8217;d better write integrated tests everywhere</em>.</p>
</blockquote>
<p>Bad idea. Really bad.</p>
<p><img src="/images/explosion-1310556-640w.jpg" style="width: 80%" alt="" /></p>
<p>Why so bad? A little bit of simple arithmetic should help explain.</p>
<p>You have a medium-sized web application with around 20 pages, maybe 10 of which have forms. Each form has an average of 5 fields and the average field needs 3 tests to verify thoroughly. Your architecture has about 10 layers, including web presentation widgets, web presentation pages, abstract presentation, an <span class="caps">HTTP</span> bridge to your service <span class="caps">API</span>, controllers, transaction scripts, abstract data repositories, data repository implementations, <span class="caps">SQL</span> statement mapping, <span class="caps">SQL</span> execution, and application configuration. A typical request/response cycle creates a stack trace 30 frames deep, some of which you wrote, and some of which you&#8217;ve taken off the shelf from a wide variety of open source and commercial packages. How many tests do you need to test this application <em>thoroughly</em>?</p>
<p>At least 10,000. Maybe a million. <em>One million</em>.</p>
<p><a href="https://tinyurl.com/dx68z4"><em>Wie ist es m&ouml;glich?!</em></a> Consider 10 layers with 3 potential branch points at each layer. Number of code paths: 3<sup>10</sup> &gt; 59,000. How about 4 branch points per layer?  4<sup>10</sup> &gt; 1,000,000. How about 3 branch and 12 layers? 3<sup>12</sup> &gt; 530,000.</p>
<p>Even if one of your 12 layers has a single code path, 3<sup>11</sup> &gt; 177,000.</p>
<p>Even if your 10-layer application has only an average of 3.5 code paths per layer, 3.5<sup>10</sup> &gt; 275,000<sup class="footnote"><a href="#fn6d7a96adc995137445819fd95bd31a74367d9f83">1</a></sup>.</p>
<p>To simplify the arithmetic, suppose you need <em>only</em> 100,000 integrated tests to cover your application. Integrated tests typically touch the file system or a network connection, meaning that they run on average at a rate of no more than 50 tests per second. Your 100,000-test integrated test suite executes in 2000 seconds or 34 minutes. That means that you execute your entire test suite only when you feel ready to check in. Some teams let their continuous build execute those tests, and hope for the best, wasting valuable time when the build fails and they need to backtrack an hour.</p>
<p>How long do you need to <em>write</em> 100,000 tests? If it takes 10 minutes to write each test&mdash;that includes thinking time, time futzing around with the test to make it pass the first time, and time maintaining your test database, test web server, test application server, and so on&mdash;then you need 2,778 six-hour human-days (or pair-days if you program in pairs). That works out to 556 five-day human-weeks (or pair-weeks).</p>
<p>Even if I overestimate by a factor of five, you still need two full-time integrated test writers for a one-year project <em>and</em> a steady enough flow of work to keep them busy six hours per day <em>and</em> you can&#8217;t get any of it wrong, because you have no time to rewrite those tests.</p>
<p>No. You&#8217;ll have those integrated test writers writing production code by week eight.</p>
<p>Since you won&#8217;t write all those tests, you&#8217;ll write the tests you can. You&#8217;ll write the happy path tests and a few error cases. You won&#8217;t check all ten fields in a form. You won&#8217;t check what happens on February 29. You&#8217;ll jam in a database change rather than copy and paste the 70 tests you need to check it thoroughly. You&#8217;ll write around 50 tests per week, which translates to 2,500 tests in a one-year project. Not 100,000.</p>
<p>2.5% of the number you need to test your application thoroughly.</p>
<p>Even if you wrote the most important 2.5%, recognizing the nearly endless duplication in the full complement of tests, you&#8217;d cover somewhere between 10% and 80% of your code paths, and you&#8217;ll have no idea whether you got closer to 10% or 80% until your customers start pounding the first release.</p>
<p>Do you feel lucky? Well, do you?<sup class="footnote"><a href="#fn">2</a></sup></p>
<p>So you write your 2,500 integrated tests. Perhaps you even write 5,000 of them. When your customer finds a defect, how will you fix it? Yes: with another handful of integrated tests. The more integrated tests you write, the more of a false sense of security you feel. (Remember, you just increased your code path coverage from 5% to 5.01% with those ten integrated tests.) This false sense of security helps you feel good about releasing more undertested code to your customers, which means they find more defects, which you fix with yet more integrated tests. Over time your code path coverage <em>decreases</em> because the complexity of your code base grows more quickly than your capacity to write enough integrated tests to cover it.</p>
<p>&#8230;and you wonder why you spend 70% of your time with support calls?</p>
<p>Integrated tests are a scam. Unreliable, self-replicating time-wasters. They have to go.</p>
<hr />
<p class="footnote" id="fn6d7a96adc995137445819fd95bd31a74367d9f83"><sup>1</sup> True: few code bases distribute their complexity to their layers uniformly. Suppose half your 12 layers have only two branch points&mdash;one normal path and one error path&mdash;while the others have 5 branch points. 2<sup>6</sup>&middot;5<sup>6</sup> = 1,000,000 and for 4 branch points 2<sup>6</sup>&middot;4<sup>6</sup> &gt; 262,000. You can&#8217;t win this game.</p>
<p class="footnote" id="fn"><sup>2</sup> Aslak Helles&oslash;y points to a way to take luck mostly out of the equation. <a href="https://www.pairwise.org/">His technique for choosing high-value tests</a> will certainly help, but it stops short of testing your code <strong>thoroughly</strong>. I believe you can achieve truly thorough focused tests with similar cost to writing and maintaining integrated tests even using the pairwise test selection technique. (Thanks, Aslak, for your comment on April 12, 2009.)</p>
<p><a href="https://integrated-tests-are-a-scam.jbrains.ca">Read more in this series</a></p>

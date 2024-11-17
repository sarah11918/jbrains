---
title: "Using Integration Tests Mindfully: A Case Study"
date: 2010-01-31
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
excerpt: >
  Many readers have interpreted "Integrated Tests are a Scam" to
  mean "never use integrated tests for anything, ever". That's never
  what I've meant. Gus Power shares an example of how he uses integrated
  tests that I find entirely compatible with my approach.
---
{% include integrated-tests-are-a-scam-disclaimer.html %}

<div style="float: right; max-width: 200px; margin-left: 1em; margin-bottom: 1em;" markdown="1">
![Gus Power]({{ site.images_url }}/using-integration-tests-mindfully-a-case-study/GusPower.png "Gus Power")
</div>

Gus Power commented about the way he uses integration tests in his work.

> Interesting series of articles & comments. I also read Steve Freeman’s article in response to the same topic. It’s got me thinking about how we work and I thought I’d take the time to describe it here.

> You define an integration test as “… any test whose result (pass or fail) depends on the correctness of the implementation of more than one piece of non-trivial behavior.” We have many such components that exhibit such non-trivial behaviour in the products we create, many of which are not developed by us. And we have integration tests to verify they work. I’m not just talking about 3rd party libraries and frameworks here, I’m referring to the whole system: caching layers. load balancers, <span class="caps">DNS</span> servers, CDNs, virtualization etc. When we build software it only becomes a product or service for our users when it has been deployed into a suitable environment; an environment that typically contains more than just the software we have written and packaged. Since our users’ experience and perception of quality result from their interaction with a deployed instance of the whole system, not just their interaction with the software at a unit level, we have come to value end-to-end integration testing. I believe there’s merit in testing these components in symphony and will attempt to clarify what kind of integration testing I’m talking about.

> For a given piece of functionality we write an executable acceptance test in human readable form (for web projects we typically use some domain-specific extensions to selenium, for services we have used <span class="caps">FIT</span> and it’s ilk, sometimes we roll our own if there’s nothing expressive enough available). We run it against a deployed version of the application (usually local though not always) which typically has a running web/application server and database. The test fails. We determine what endpoint needs to be created/enhanced and then we switch context down into unit-test land. A typical scenario would involve enhancing a unit test for the url mappings, adding one for the controller, then one for any additional service, domain object etc. When we’re happy and have tested and designed each of the required units we jump back up a level and get our acceptance test to progress further. The customer steers the development effort as he sees vertical ‘slices’ of functionality emerge. The acceptance test is added to a suite for that functional area. The continuous build system will then execute that test against a fully deployed (but scaled down) replica of the production environment, with hardware load balancer, vlans, multiple nodes (session affinity) and so forth. Any additional environmental monitoring (e.g. nagios alerting) is also done as part of this development effort and is deployed into the test environment along with the updated code.

> Setting up the infrastructure to do this kind of testing takes investment, both initial and ongoing. The continuous build needs to be highly ‘parallelized’ so you get feedback from a checkin in 10 mins or less (we’re heavy users of virtualization, usually VMWare or OpenVZ). The individual acceptance test suites need to be kept small enough to run quickly before check-in.

> Benefits of this approach
>
>  * The continuous context-switch between acceptance test and unit test is key to our staying focused on delivering what the customer actually wants.
>  * The customer has multiple feedback points that he can learn from and use to steer the development effort.
>  * It confirms that the whole system works together – networking, <span class="caps">DNS</span>, load balancing, automated deployment, session handling, database replication etc.
>  * We create additional ‘non-functional’ acceptance tests that automatically exercise other aspects of the system such as fail-over and recovery.
>  * Upgrades to parts of the system (switches, load balancers, web caches, library versions, database server versions etc.) can be tested in a known and controlled way.

> We’ve caught a number of integration-related issues using this approach (a few examples: broken database failover due to missing primary keys, captcha validation not working due to a web cache not behaving correctly, data not persisting because one database server had the wrong locale) and stopped them before they have reached our users. We have used the feedback as a basis for improving our products and their delivery at a system level.

> OK this reply has now become far too long :-/ It would of course be good to discuss this in person sometime :)

> —Gus Power

Thanks for the substantial comment, Gus. For those who don’t know Gus, he is one of the joint recipients of the 2009 Gordon Pask Award for contribution to Agile practice. I invite you to [follow his work and learn from his example](https://www.energizedwork.com/). On to the substance of Gus’ comment.

Gus, it appears you do not use integration tests to check basic behavior exhaustively. While I try not to use integration tests to check basic behavior at all, I mostly hope to stop programmers from attempting to write exhaustive integration tests that check basic correctness conditions. I wrote in [Not Just Slow: Integration Tests are a Vortex of Doom](/permalink/not-just-slow-integration-tests-are-a-vortex-of-doom) about the vicious cycle I see when teams rely on integration tests to check basic correctness. I encourage them to stop that particular insanity. I would hesitate to use integration tests as even smoke tests for basic correctness, but if I found myself in a situation where I needed to write such tests, I’d do it, then look for ways to render them obsolete.

Also, you mention writing “human-readable acceptance tests”, and I certainly use such tests in my work. When I counsel against using integration tests, I advise it within the context of programmer tests only. While I strongly encourage teams to allow even some of their acceptance tests to check policy or business rule behavior directly and in isolation, I understand and agree that one generally needs to write some acceptance tests as integration tests.

In general, you describe using integration tests quite purposefully, mindfully, and responsibly. I expect no less from a practitioner of your caliber. I would truly enjoy working with you on a project.

Finally, you mention that your integration tests catch system-level issues, such as a broken database schema, mistaken cache integration, and so on. I expect integration tests to find only, or at least mostly, these problems. None of these sound like basic correctness problems.

So Gus, I appreciate you for writing a great description of using integration tests well. I wish we had more examples like this. I truly wish I **saw** more examples like this. Sadly, I don’t: I see teams trying to check basic correctness issues with plodding, brittle, misleading tests. For those, I stress the need to eliminate integration tests.

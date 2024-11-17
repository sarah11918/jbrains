---
title: "Detecting Changes in Third-Party Code"
tags:
---
One of the people who watched [the 2009 version of Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)](https://www.infoq.com/presentations/integration-tests-scam) recently asked me: *I wonder how you deal with updates of third-party libraries. How do you detect subtle API or behaviour changes? At the moment, I write state-based integration tests for these cases and I wonder whether this isn't a sensible use of integration tests.*

I write Learning Tests to discover how a third-party library works. I isolate myself from the third-party library through a layer of interfaces and adapter classes that evolve from the common ways I use the third-party library. I call this the "Pattern of Usage API", as it represents the way my application uses that third-party library. Now my application uses the third-party library through a layer of interfaces, which means that I can introduce Contract Tests on those interfaces. These Contract Tests effectively describe the subset of the third-party library's behavior on which I depend.

Now when I upgrade the third-party library, I run the Contract Tests against my adapters to that library. Test failures usually indicate a backwards incompatible change in the third-party library. (Sometimes they indicate a trivial difference in the API which requires a trivial fix, such as an API call having been renamed or something.)

Of course, this only helps me detect behavior changes related to computing answers, and not related to responsiveness, reliability, scalability, and so on. For that, I'll always need system tests.

The Contract Tests are almost always state-based integration tests. I simply limit these to the implementation of Pattern of Usage API and don't let it leak farther up the call stack. At some point you have to integrated with the Outside World. I simply teach people to look to make that integration thinner.

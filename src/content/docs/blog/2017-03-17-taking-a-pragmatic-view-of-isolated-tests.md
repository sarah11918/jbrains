---
title: "Taking a Pragmatic View of Isolated Tests"
date: 2017-03-17
summary: >
    A rundown of reasons to prefer isolated/focused tests to integrated tests.
tags:
  - Simple Design
  - Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)
  - Test Doubles
  - Surviving Legacy Code
---
I've been teaching programmers about the value of isolated tests[^definition] for a long time, and recently I've seen increasing resistance to the idea. I worry that this comes partly from having presented motivations and reasons that tends towards the overly-abstract, ironically enough. Perhaps I can improve matters by returning to the concrete issues and constraints that led me to being exploring this idea in the first place.

[^definition]: By _isolated tests_ here I mean the opposite of _integrated tests_; I'm not referring to tests that execute in isolation from the other tests. (I take that sense of isolation for granted and forget even to mention it at all.) You might have seen similar terms like _solitary_ or _focused_. I mean a microtest that checks one small part of the system in isolation from its "complicated" production dependencies.

**Consider the following questions**.

 + When I want to fix a problem within the system's domain or business logic, why should the system distract me with infrastructure or technology issues?
 + When I see a problem with a web page template, why should I have to worry about how to grab data from the database to display on that page?
 + When I see a problem with a web page template, why should I have to worry about the username I use to log in? or the workflow that leads to that page?
 + When I see data not making it into a database correctly, why should it block me to have a configuration problem with the web server?
 + When a framework service, like parsing request data, behaves differently than I expect it to, why should I have to know the details of the domain of the application in order to feel confient that I know how to integrate the service?

_We could think of more if we spent another 15 minutes together, but I think this suffices._

All these questions have a common element: the corresponding distractions reflect excessive coupling and/or insufficient cohesion. They show a violation of the [Dependency Inversion Principle]({{ site.url }}/series#dependency-inversion-principle-dip). The resulting (integrated) tests cost more than they generate value. If we try to test these systems after the fact, then in the moment we stick to manual, integrated tests, because of expediency. If we use integrated tests to drive building these systems, then in the moment we put everything in one place, because of expediency. We risk taking well-designed systems for granted, so perhaps we too easily forget the value of test-driving with isolated tests, which nag us continually to respect the [DIP]({{ site.url }}/series#dependency-inversion-principle-dip). _When you put it this way, I find it hard to argue against!_ This leads me to wonder what has gone wrong with "how I've put it" up to now.

I suspect that, by the time I sat down to write my past articles on this topic, I'd spent so much time thinking about the common elements that I'd abstracted them away too much. When I discuss these issues on podcasts, I try hard to help everyone relate to the problems, and so I don't talk enough about the concrete, specific situations that led me to reach the conclusions I've reached about the dangers of integrated tests and the value of isolated tests. I either assume that the audience knows _or_ I don't want to anchor people in the audience to a particular situation _or_ I simply repeat a seemingly-obvious abstraction _out of expediency_. I'm sorry about that.

<p class="highlight" markdown="1">
I use isolated tests to drive improvements in my designs. They help me find distracting violations of the [DIP]({{ site.url }}/series#dependency-inversion-principle-dip) in existing code and they help me avoid violating the [DIP]({{ site.url }}/series#dependency-inversion-principle-dip) in new code. Respecting the [DIP]({{ site.url }}/series#dependency-inversion-principle-dip) often looks like overkill in the moment and I almost always deeply regret violating the [DIP]({{ site.url }}/series#dependency-inversion-principle-dip) in retrospect.
</p>

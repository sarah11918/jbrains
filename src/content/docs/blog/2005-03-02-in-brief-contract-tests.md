---
title: "In brief: Contract Tests"
date: 2005-03-02
lastUpdated: 2016-03-30
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
**Contract Tests** explain how a class should extend a superclass or implement an interface, so that I don&#8217;t have to read a bunch of prose to figure out how to do that. Typically, a contract test case class is abstract/deferred/not fully implemented, then I extend/subclass it and implement a Factory method or two to return instances of my own implementation of the given interface. That gives me a standard battery of tests I can run to drive my implementation. It might not be perfect (I&#8217;d have _n_ failing tests to start) but I prefer it to documentation written in prose.

So if you&#8217;re delivering something you want me to extend (like a framework) and I need to follow more than three rules, then please deliver some contract tests along with it.

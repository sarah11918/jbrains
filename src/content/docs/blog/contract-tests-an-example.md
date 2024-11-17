---
title: "Contract Tests: An Example"
date: 2011-07-07
tags:
  - "Beware the Integrated Tests Scam (was Integrated Tests Are a Scam)"
---
I found an example of contract tests in Arlo Belshee's [series of articles about mock-free testing][2]. I must strongly, strongly point out that Arlo uses the term "mock" narrowly to refer to runtime- or bytecode-generated proxies that intercept interface method invocations and provide the ability to set method expectations, in the way that JMock and NMock do. He *does not* mean the generic term "mock", where he uses the term "test double" instead. I thank him for that.

If you click [here][1] you'll see an almost textbook example of a contract test: that is, a test class that can run the same set of tests for two different implementations of the same interface. I would change only one thing: I'd extract the tests into an abstract superclass&mdash;something I otherwise hate to do&mdash;and pull the declaration of the method `MakeTestSubject()` up there, leaving two subclasses, one for the real file system and one for the simulated one. "YAGNI," you say, and I agree, but I prefer the symmetry of the abstract superclass design to the asymmetry of having one class inherit from the other. I find it easier to grok quickly.

[1]: https://github.com/arlobelshee/ArsEditorExample/blob/master/SimulatableApi.Tests/FileSystemCanLocateFilesAndDirs.cs
[2]: https://arlobelshee.com/tag/no-mocks

Either way, I feel good seeing contract tests out in the wild. I'm not so crazy after all.

---
title: "How Not To Write Golden Master Tests"
date: 2016-03-01 12:30 -0400
---
I recently encountered a code base in which someone had applied the Golden Master technique, but done so in a way I find risky, so I wanted to warn you against letting this happen in your code. This code exhibits a bad idea that probably started out as a good idea or seemed like a good idea at the time. This makes it plausible-but-risky, and this is where a lot of legacy code comes from.

The golden master tests are designed as JUnit tests, **which I like very much**, because that should make it easier to simply run the tests while I'm programming. I tend to favor design decisions that encourage programmers to run more tests more easily, since that tends to encourage them to run more tests more often, and that  mitigates some of the key risks associated with changing code. Unfortunately, following this principle led to a rather risky decision, which defeats the very purpose of _automated_ testing.

## The Dance of the Annotations

I'll simply outline the structure of the test class. Do you notice the same design risk that I do?

```
public class GoldenMasterTests {
  //@Test
  public void generate_golden_master() {
    WriteToFile("master.txt");
  }

  @Test
  public void compare_to_golden_master()
  throws IOException {
    WriteToFile("test-run.txt");
    String master = readFile("master.txt");
    String tests = readFile("test-run.txt");
    assertEquals(tests, master);
  }

  // irrelevant code omitted...
}
```

The commented-out `@Test` annotation makes me nervous.[^junit-annotations] This means that a programmer needs to

- Switch annotations in order to run "generate golden master" when the golden master needs to change.
- Run all the tests---or worse, choose to run a single test just this once---in order to generate a new golden master.
- Remember to switch the annotations back in order to check the test run, which I _assume_ one would want this code to do by default.

This might not seem like a big deal, but **legacy code is the result of hundreds (or thousands or more) of decisions like these, none of which seemed like a big deal**.

[^junit-annotations]: If you don't know JUnit, the test runner runs methods annotated with `@Test` as tests.

## Automating the "Automated" Tests

If you don't want to automate your test runs, then don't use JUnit; if you want to use JUnit, then _automate your test runs_. This means **ruthlessly eliminating manual steps**.

One simple tactic comes to mind: let the test case class operate as both a collection of JUnit tests and as a standalone program (with `main()`). Running the program creates a new golden master, while running the tests with JUnit compares the current test run to the latest version of the golden master. **This follows the principle of automating the most-common task.**[^manual-steps-generating-golden-master] Generating a golden master happens separately from running tests, so I see no benefit in using a JUnit test runner to do it. On the contrary, **the design as it is now merely uses the JUnit test runner as a console application entry point**. Java already has `main()`. I find it easier to understand than using the JUnit test runner somewhat like `main()`. I especially find it strange to use the JUnit test runner to do something that isn't running a test. So I propose we just use `main()`!

[^manual-steps-generating-golden-master]: I don't mind keeping, even adding, manual steps for _generating_ a golden master, since this adds a small measure of safety to a potentially destructive task.

## The Result

```
public class GoldenMasterTests {
  public static void main(String[] args)
  throws Exception {
    // irrelevant code omitted...
    writeTestRun("master.txt");
  }

  @Test
  public void compareToGoldenMaster()
  throws IOException {
    writeTestRun("test-run.txt");
    assertEquals(
      readTextFile("master.txt"),
      readTextFile("test-run.txt"));
  }

  // irrelevant code omitted...
}
```

With this design, when you need to generate a new version of the golden master, you have to know to run `main()`, but when you're merely running the tests again, there's no risk of accidentally generating a new, _possibly wrong_, golden master.

<p class="guideline" markdown="1">Not all testing-related code needs to be designed as a test. Not all testing-related tasks involve running tests. Don't trap yourself into thinking that you have to perform those tasks with your testing tools.</p>

## Reaction

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">How Not To Write Golden Master Tests by <a href="https://twitter.com/jbrains">@JBrains</a> <a href="https://t.co/bJP1okwzxY">https://t.co/bJP1okwzxY</a> Suggested solution is inferior to Approvals <a href="https://t.co/yK06QGDwtE">https://t.co/yK06QGDwtE</a> <a href="https://t.co/fNzmvAH2Pu">pic.twitter.com/fNzmvAH2Pu</a></p>&mdash; roesslerj (@roesslerj) <a href="https://twitter.com/roesslerj/status/898806239924113408">August 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

It's true, if you use a tool like [Approval Tests](https://approvaltests.com/), then you get this behavior built in. That's the point of any tool. In particular, it appears to help organize Golden Master tests in text files, associating them with xUnit tests in a way that I typically end up needing eventually. In cases where it's especially convenient to express the expected result of a test in text, this tool makes that easier to do.

So why didn't I recommend it in the first place? I didn't write this article to propose an ideal solution to this problem, nor to advertise a tool, but rather to point out _insufficient_ or _dangerous_ practice (in my opinion, of course) and describe a quick way to improve it. If you're doing what I describe in this article in your project, then _stop_, do something better _now_ with the tools at your disposal, and _then_ look for an even better way. That better way might be Approval Tests.

Of course, don't just reach for a tool to solve your problems. Don't fall prey to the "Evil Wizard" problem, where a tool works like magic and you don't know how to live without it. You don't have to do everything "by hand", but you should know how to. Accordingly, calling a manual solution "inferior" to an automated version of the same behavior build into a tool seems misguided. Instead I propose this:

<p markdown="1" class="guideline">Good news, everyone! There are tools that do what I propose here, such as [Approval Tests](https://approvaltests.com), so I recommend checking it out. It builds on the idea in this article and offers even more to help you organize and run your Golden Master tests.</p>

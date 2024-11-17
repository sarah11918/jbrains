---
title: From dependent tests to independent tests to independent assertions
date: 2011-12-20
tags:
  - Dependency Inversion Principle (DIP)
---

<span style="float: right; margin-left: 10px; margin-bottom: 10px; width: 3cm">![Dale Emery](/images/dhemery-small.jpg)</span>
[We might choose to] write tests so that a failure in a predecessor test causes dependent tests not to execute. In object tests, we do this by writing a test method with multiple assertions. -- Dale Emery

When multiple assertions check very tightly related things, I don't mind them, but when they check relatively loosely related things, they act as integrated tests for multiple behaviors that we should consider separating. This is even subtler than the simpler idea of "one action per test".

If you'd like a **Novice algorithm** to follow:

1. Look for any test with multiple assertions.
2. Move those assertions to the bottom of the test. (If they aren't already at the bottom, then you might have more than one action per test; this refactoring will help you discover that.)
3. Extract all the assertions together into a single method.

Now look at the new method. How many different objects does the method use?

If it's more than one, then you almost certainly have unrelated assertions in the same place, so consider splitting the unrelated assertions into separate methods, then split the test into two so that each test invokes one of the two new separated assertion methods.

If your new assertion method uses only one object, then it might not be so clear whether those assertions are related. You can try this simple test: put all the values you're checking in your assertions into a single object. Can you think of a good name for it? If yes, then perhaps you've just identified a missing abstraction in your system; and if not, then perhaps the assertions have too little to do with each other, in which case, try the trick in the preceding paragraph.

I apologise for not having a good example of this right now. If you point me to one, I'll analyse it in this space.


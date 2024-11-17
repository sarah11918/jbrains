---
title: "When should I remove duplication?"
date: 2011-09-29
tags: []
---
As I learn to become a better programmer, I continue to follow [the four elements of simple design][FourElements]. Of these, I have observed that "remove duplication" helps me discover an appropriate structure for the thing I want to build. In my classes, we practise removing duplication a lot, in part because most people understand the rule "remove duplication" well enough to find it useful. After the first few weeks of practice, however, programmers following this rule observe varying results: sometimes removing the duplication makes the design much clearer, and sometimes it muddies the water. At this stage, she usually looks for more detailed rules to help decide when to remove duplication and when to leave it alone. I offer some simple rules and guidelines for this situation.

When I can't decide whether to remove a certain bit of duplication I've found, I fall back on two rules:

1. Remove duplication only after you see [*three* copies][ThreeStrikes].
2. If you don't know how to remove this particular kind of duplication, then write more tests. Either you need more examples to see the pattern, or more examples will show a different, better pattern.

I also remember two guidelines:

1. Don't be afraid to remove duplication by introducing a method or class or interface with a stupid name. Remember that [you can always improve the name later][ImproveNames].
2. If you sense duplication, but don't really see it, or can't explain it to others, then [make the surrounding names more precise][ImproveNames]; then maybe you will see the duplication.


[FourElements]: https://link.jbrains.ca/g9P6Jw
[ThreeStrikes]: https://link.jbrains.ca/qUxm1s
[ImproveNames]: https://link.jbrains.ca/nP9Fvk

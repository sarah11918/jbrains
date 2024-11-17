---
title: "Relative Include Paths and the Slow, Certain March Towards Legacy Code"
date: 2016-01-12 10:30 -0300
lastUpdated: 2020-08-10
tags:
  - "Surviving Legacy Code"
  - Dependency Inversion Principle (DIP)
---
When you use relative include paths in your code, you bind each source code file to its current location in the project's file layout. You relegate yourself to having to run it from a very specific location on the file system. You generally make it unnecessarily difficult to automate running your application (or its tests) outside your development environment, such as in platform-as-a-service environments. You make things like Docker not just helpful, but _necessary_.

So stop doing that.

You can improve your code by following the Dependency Inversion Principle. Really! In particular, you can push a detail up the call stack towards the client. Which detail? **Where to look for source code**. Pushing this detail up the call stack means pushing it out of your source code files and into the commands that run your code.

## Why Do Your Tests Know Where the Production Code Is?!!?

I can't even.

Yes: your tests need to _invoke_ your production code, but I don't see the benefit from binding your tests to the current, arbitrary layout of your production code on the file system. When I've asked people why they've done it this way, they've answered one of two ways:

1. "No reason."
1. "This is the only way it works."

They don't know what else to do and they just need to get something running now, so that they can get on with it. So, as a result, we see things like&mdash;

```
(in $PROJECT/spec/a/b/c/my_spec.rb)
include "../../../../lib/a/b/c/production_code"

# A bunch of delightful specs
```

![Rly?!](//images.jbrains.ca/disapproving-quincy-300w.jpg)

Your source code consists of a bunch of trees of files, with various roots. You might have one root for all your production code and one root each for various sets of tests, which you might want to run in isolation from each other. Every compiler and interpreter I've ever worked with has the concept of a "load path" (classpath, `PYTHONPATH`, whatever they call it), which amounts to a collection of file paths where to search for source code.

**So use it**.

## Just Use The Load Path!

{% pullquote %}
That's it. It's that easy. {"Push knowledge about the location of your source code out of the source code (what an idea!) and into the commands that run your code."} Instead of obsessing over where to find other source code, your source files should just say "I need library X; I don't care where it is, just let me use it".
{% endpullquote %}

```
(in $PROJECT/spec/a/b/c/my_spec.rb)
# The production code is somewhere on this disk.
include "a/b/c/production_code"

# A bunch of delightful specs
```

You can run this with a command like

```
$ ruby -Ispec/slow -Ispec/fast -Ilib -Ilegacy-lib my_awesome_entry_point.rb
```

or whatever you call it in the language you're using. It's not difficult and it opens up options. You won't realize how much you value those options until you're able to actually take advantage of them. ("Oh. We'd love to use Awesome Tool X, but we can't figure out how to deploy our legacy code into their environment.")

## But Use The Narrowest Scope Possible

Just because you use a load path doesn't give you licence to start using environment variables. (I'm looking at you, Python. At least you offer the `-E` switch that I can use to ignore the environment variables while I figure out how to set the load path for just this command.) Srsly. Specify the load path when you run your code: your compiler or interpreter almost certainly has a way to specify the load path. If this results in a long command, then move that command into a script where you don't have to see the details except when they change. (The shell scripting language is just a programming language. Don't fear it. Buy a good book, dip your toe in at first, and it'll be fine.) Now _you have the option to reorganize your source code_ when the need arises for a new level of organization. Such as when to move to a new runtime environment, like SaaS, PaaS, IaaS, or whatever the hell the kids are doing these days.

<aside class="aside">Has anyone else noticed that this is really just a special kind of dependency injection? The commands that run the code inject the location of the source code trees into the source code.</aside>
## This Is Not Just Academic Bullshit

Some of you have read this and thought something like: _J. B.'s gone off the deep end! He's ranting about something that isn't a problem. Everyone does it this way. I never want to change the relative layout of my source code. This is stupid._ Guess what, folks: **this attitude is how legacy code happens**.

This attitude leads to "You have to follow these 7 arcane manual steps every alternate Friday (except holidays) in order for the app to run&mdash;_obviously_!" Why would you volunteer to live in this world? **Why do you insist on volunteering to live in this world?**

Stop it. It's so easy to stop it. Just stop it.

Or don't stop it. I don't mind. I get paid the same amount either way. Actually&mdash;if you keep doing the easy, silly thing, then I get paid more, later. I have the stomach for it _and_ I know how to fix it.

##  About Node.js...

I tried writing something using Node.js and became immediately annoyed by the proliferation of relative include paths. At the time (September 2018) I couldn't find a useful tutorial on how to build something like a load path for a Node project. I yelled into the void, hoping someone would send me some useful reference on the topic, and two years later (August 2020), one of you did. Thank you, Amith George!

I haven't read it in detail yet, because I'm not trying to build anything using Node.js right now, but I wanted to share it with you in case you found it useful.

["Better local require() paths for Node.js"](https://gist.github.com/branneman/8048520#better-local-require-paths-for-nodejs)

## References

J. B. Rainsberger, ["Demystifying the Dependency Inversion Principle"](//blog.thecodewhisperer.com/2013/01/29/consequences-of-dependency-inversion-principle/). A more detailed discussion of the Dependency Inversion Principle, including a section on moving implementation details up the call stack.

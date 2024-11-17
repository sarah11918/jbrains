---
title: "Where the Hell Is My Port?! An Adventure in Elm"
date: 2020-01-30
tags:
    - Simple Design
# summary: >
#     When trying to write code incrementally in Elm, I ran into a problem
#     because Elm tries not to generate Javascript for Elm code not (yet) in use.
---

If you add a [_port_ in Elm code](https://guide.elm-lang.org/interop/ports.html), then you need to _use_ that port in your Elm code, otherwise the generated Javascript might not even know that your Elm code uses ports at all. As I learn Elm and become accustomed to its compiler's wonderfully-detailed error messages, encountering error messages like this suddenly feel jarring and I even have trouble understanding them for a moment.

```
TypeError: app.ports is undefined
```

I saw this message in the browser's Javascript console when I tried to add the first port to my Elm application, but hadn't yet written any Elm code that uses the port. I learned later that `elm make` hadn't generated any Javascript code related to ports, because none of my ports _did_ anything. Specifically, this means that the Elm compiler didn't generate a `ports` property for the `app` object that `Elm.Main.init(...)` returns. Therefore, **when you add a port to Elm code, if you don't send any messages to that port, then you cannot assume that the compiled Javascript code will include code for that port**. In particular, **if your Elm code doesn't write to any of your ports, then you cannot assume that the compiled Javascript code will include any code about ports at all**.

If you've found this article because you got stuck writing your first port in an Elm application, then I hope this suffices to get you unstuck. If so, I'm glad! If you're interested in how I got here, then read on.

## How Did I Get Here?

I typically like to write code incrementally, because that feels safer to me. I like to take small steps and check my work frequently, especially in unfamiliar environments. I don't know Elm very well yet and I certainly don't feel like I can write Elm fluently, so I take smaller steps when I build something in Elm. In particular, I'd never used _ports_ before, so I chose to take even smaller steps to write my first port. Sadly, I fell into a well-meaning trap: I expected there to be code that the Elm compiler helpfully optimized out of existence.

### The Steps That Led Me Here

I'm rebuilding a simple countdown timer in Elm. I've previously written one in Javascript to use in [my training classes](https://training.jbrains.ca) which replaces [the one that I liked to use on Mac OS](https://apps.apple.com/us/app/howler-pro/id434985132) before I switched to Linux. I chose to rebuild this in Elm, because I like that I can practise evolutionary design in a functional programming language while remaining in the familiar environment of HTML, Javascript, and the browser. [I've built the basic operations of the timer](https://github.com/jbrains/countdown-timer-elm/tree/0c3e6a3615dd5c4ff1bd6dc287fb8001e964bac2) (ticking, pausing, resuming, setting the time) and now it's time to start playing sounds as the timer expires. These sounds provide both a convenient and fun way to warn my training class participants that they should pause their work, get things out of their head, and prepare for the next part of the course. They mostly seem to enjoy the funny sounds.

When I looked for examples of playing sounds in Elm, I only found code that generates an HTML `audio` tag and uses a standard in-browser audio player with start/stop buttons and the like. Instead, I want to play various sounds directly in response to a "tick" event. Since I didn't know what else to do, I retreated what I'd previously built: play the sound in Javascript code. In order to invoke Javascript code from Elm, I need to use _ports_, which gives me something new to learn. I read the [Elm guide's section on JavaScript Interop](https://guide.elm-lang.org/interop/).

Since I wanted to work incrementally, I chose this strategy:

1. Add a port to the Elm code, but don't send any messages to it yet.
2. Subscribe to that port in the Javascript code.
3. Check that the Elm and Javascript code are "wired together" correctly before even trying to send messages from Elm to the port.

I chose this approach based on a couple of decades of experience working in interpreted languages (Javascript, Ruby, Python) where syntax errors are common. I've wasted significant energy trying to write correct code and then hunting down strange errors only to find out that I'd made some elementary mistake early on and my code was never going to work. I see this mostly as a special case of the general principle **if you're not sure that you can write it correctly, then write less of it, so that when you fail, you have fewer places to look for the mistake**.  Most of the time, this approach helps me not only avoid chasing the wrong mistake but also slowly build up a clearer picture of the unfamiliar environment in which I find myself, since I learn smaller parts of the environment in more detail as I go. This time, sadly, it caused me to waste more energy, not less.

### How To (Correctly) Add Your First Port To An Elm Application

1. Mark your main module as a `port module`.
2. Add a port.
3. **Use the new port by sending a message to it from at least one branch of your application's `update` function**. (This is the step that I missed the first time.)
4. Build your Elm code, generating new Javascript.
5. Try to subscribe to the new port in the Javascript code that embeds and runs the Elm application.
6. Reload your Elm application client Javascript code in a browser and look in the console for Javascript errors in the code that runs the Elm application. There should be no new error messages related to ports.

From this point, it's safe for you to add more ports and use them. If you skipped the "send a message to the new port" step for your second port, then you'd see a Javascript error telling you that that port name is undefined inside the Javascript object corresponding to the Elm application. **If you don't send any messages to a port in Elm, then the corresponding Javascript code won't know about that port.** Worse, **if you don't send any messages to any of your ports in Elm, then the corresponding Javascript code won't about about ports at all!**

### A Contract Failure

I interpret this mistake as a contract failure. I guessed an aspect the contract of the Elm compiler and got it wrong: I assumed that the generated Javascript code would contain a reference to ports because I'd marked the module as a "port module". (Why does one need to do this, then? Please add a comment if you know.) If I'd known the Elm compiler better, then I might have guessed which specific aspect of the Elm compiler's contract I'd got wrong, but since I just didn't know, I considered that a waste of my energy. Instead, I immediately asked people who were more likely to guess better than I would. Sure enough, they guessed quite quickly that the Elm compiler eliminated "dead code", a part of the contract that I did not know about. Although learning this part of the contract this way annoyed me in the moment, it didn't cost me too much _and_ it has left enough of an  impression that I'm likely to remember it for a while. **I'm writing this now in order to document this aspect of the contract of the Elm compiler so that other programmers learning Elm might more easily get past this difference of understanding.** It's the least I can do. I intend to contribute some text to the Elm guide right after I publish this.

### An Example Would Be Handy Right Now

I started with an Elm application that runs a singleton countdown timer. It has two modules: `Main` and `Timer`. The `Main` module exposes `Timer` to the world through a user interface. I use Jekyll in order to run the application with an embedded web server, avoiding relative paths to link the HTML page to the Javascript library that `elm make` generates. If you have the energy to show me a way to achieve the same thing without Jekyll, then I'm happy to see it. [Please submit a pull request!](https://github.com/jbrains/countdown-timer-elm/pulls)

Next, I added a port to the Elm code without writing any messages to it yet. This requires two steps:

1. Mark the module with `port module` instead of merely `module`.
2. Define a `port` as a function that turns some message payload into a _command_ value of type `Cmd unusedType`.

For my first port, I chose one without payload, so the input type is `()` (unit/void/nothing). The return type is `Cmd unusedType`, and not `Cmd Msg`. The Elm guide (as of the time of writing this article) describes this type as `Cmd msg` with a lowercase `msg`, which I misread the first time as `Cmd Msg`. This led to a few minutes of confusion over an unexpected compile error.

```elm
Detected problems in 1 module.
-- BAD PORT ------------------------------------------------------- src/Main.elm

The `ping` port cannot send any messages to the `update` function.

14| port ping : () -> Cmd Msg
         ^^^^
It must produce a (Cmd msg) type. Notice the lower case `msg` type variable. The
command will trigger some JS code, but it will not send anything particular back
to Elm.
```

I don't yet know why calling this type `Cmd msg` expresses intent better than, say, `Cmd someArbitraryType`, so I chose `Cmd unusedType` [to more-clearly express the role, if not yet the intent](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer). Please add a comment if you can describe the intent of this type parameter.

[If I subscribed to this new port in my HTML page _now_](https://github.com/jbrains/countdown-timer-elm/tree/failure-when-adding-a-port), then the Elm compiler would not have generated any ports-related code (the compiler considers it _dead code_), leading to the error message that originally prompted me to write this article. Instead, [I need to add code to at least one branch of the `update` function to send a message to this new port](https://github.com/jbrains/countdown-timer-elm/blob/try-adding-a-simple-port/elm/src/Main.elm#L73-L83). I decided to send a message when the timer _expires_ (meaning when it ticks down to no time remaining). To see this run, I watch the Javascript console in my browser, waiting for the timer to tick down to 0 seconds, at which point I see a single `PING` message in the console. By this time I had a port working end to end and could resume trying to add the features that I cared about: playing a "warning" sound each second once the timer reaches 10 seconds remaining, then an "expired" sound once the timer expires.

If you've become stuck trying to write your first port in an Elm application, then I hope this helped you fix the problem, understand how you got there, and helps you avoid the problem in the future.


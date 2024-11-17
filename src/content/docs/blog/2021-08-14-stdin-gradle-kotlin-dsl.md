---
title: "Reading stdin and The Kotlin DSL for Gradle"
date: 2021-08-14
tags:
    - The Little Things
    - Tutorials
# summary: >
#     How does one accept user input from `stdin` in a Java
#     application when running it with `gradle run` when
#     using the Kotlin build DSL? Here's how!
---
I couldn't figure this out myself, nor even find the appropriate Stack Overflow article on my own, so I'm writing this. I hope you find it and it alleviates your annoyed state.

Is this you?

- I want to read input from `stdin` in my Java application.
- I want to run my application using `gradle run`.
- I'm learning the Kotlin build DSL for Gradle as a replacement for the Groovy build DSL, which I'm somewhat used to.

Great! That's me, too.

## The Problem

By default, `gradle run` uses an empty input stream, so reading data from `stdin` doesn't block, waiting for the user to type on the console. The `application` Gradle plugin provides a way to read from `System.in`. I know how to do that with the Groovy build DSL:

```groovy
// build.gradle
plugins {
    id 'application'
}
[...]
// You need this!
run {
    standardInput = System.in
}
```

So far, so good. What about the Kotlin build DSL? You see, `run()` is a special function in Kotlin (or something---I don't know yet), so this exact syntax doesn't work.

I tried reading tutorials, but my keywords kept finding tutorials on how to write Kotlin code to read from `stdin`. I don't want that.

I tried reading tutorials, but my keywords kept finding tutorials on how to do this with the Groovy build DSL. I already know that.

Finally, I did the only remaining thing: I tweeted that I couldn't figure it out. Within 44 minutes, [someone gave me an answer](https://twitter.com/devminded/status/1426671844942299136).

## An Answer

```kotlin
// build.gradle.kts
plugins {
    application
}
[...]
tasks.withType<JavaExec>() {
    standardInput = System.`in`
}
```

Now, `gradle run` accepts input from the console. Excellent!

## Why?!

The key points seem to be these ones:

1. Since `in` is a keyword in Kotlin, we have to say ``System.\`in\` ``, including the backtacks.
1. Instead of adding properties to the `run` task, we have to do something else, for reasons I don't yet understand.

Sadly, this solution involves setting the `standardInput` property for _every_ task of type `JavaExec` in the build. This seemed excessive, but once I saw this answer, it occurred to me what to try next---and the solution feels obvious, now that I know it.

## A Better Answer

```kotlin
// build.gradle.kts
plugins {
    application
}
[...]
tasks.getByName("run", JavaExec::class) {
    standardInput = System.`in`
}
```

Now, instead of setting this property for _all_ `JavaExec` tasks, I set it for just the `run` task. This still works!

The key point _here_ seems to be specifying the _type_ of the task---the `JavaExec::class` parameter. I infer that this downcasts the task to the correct concrete(-enough) type that supports the `standardInput` writable property. Excellenter!

This works for me, so I hope it works for you. If you can suggest improvements, then please comment below.

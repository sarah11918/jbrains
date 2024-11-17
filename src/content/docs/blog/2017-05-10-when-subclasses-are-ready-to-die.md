---
title: "When Subclasses Are Ready To Die"
date: 2017-05-10 14:22 -0300
tags:
    - Simple Design
excerpt: >
    Years ago, I learned a simple heuristic to discover
    when subclasses are ready to die. In functional
    programming, it appears that we can use that same
    heuristic to surprisingly good effect!
---
I don't like to inherit implementation (create subclasses).[^why-i-dont-subclass] When refactoring class hierarchies, I often pull behavior up into superclasses, then out into collaborators.[^classic-refactorings] Over time, I might find myself left with subclasses that only differ by overriding methods to return different constant values. Smalltalkers are used to this, but I never felt entirely comfortable with it. (No, I can't explain that.) I often end up here because I've moved all the significant behavior variations out into collaborating objects, leaving behind tiny differences. The resulting subclasses amount to nothing more than slightly-varied configurations of a common type. We might end up with a situation with the same shape as this stupid, trivial example.

[^why-i-dont-subclass]: I find it too easy to violate the supertype's contract. I see too many examples of programmers tangling superclass and subclass together. It creates a mess that distracts too much from getting things done. The risk seems lower with interfaces/protocols.
[^classic-refactorings]: See the classic Refactoring called "Replace Inheritance with Delegation", one of the centerpiece refactorings in rescuing legacy code. ([IDEA 2017.1 supports this refactoring directly!](https://www.jetbrains.com/help/idea/2017.1/replace-inheritance-with-delegation.html))

```java
class Vehicle {
  // much greatness, then
  abstract int countWheels();
}

class Bicycle extends Vehicle {
  int countWheels() { return 2; }
}

class Trikke extends Vehicle {
  int countWheels() { return 3; }
}

class OrdinaryAutomobile extends Vehicle {
  int countWheels() { return 4; }
}

class HeavyDutyTruck extends Vehicle {
  HeavyDutyTruck(int axles) {
    this.axles = axles;
  }
  
  // I don't actually know anything about vehicles.
  int countWheels() { return someFunctionOf(this.axles); }
}
```

In most situations it becomes clear to us that this proliferation of subclasses becomes a burden. I might notice this when I have trouble finding a significant, valuable, _meaningful_ name for a minor variation of `Vehicle`. I think "I just want to create this thing and I don't care what it's called!"

Of course, in Java, I can use an anonymous subclass, but not all languages offer this option (C#—at least the last time I looked). Anonymous objects make me nervous, anyway, because programmers have a habit of adding behavior to them without giving them names, forcing extra work on us to reverse-engineer the meaning of the behavior. Even ignoring these point, we don't need subclasses for such minor differences, since they don't change _implementation_ at all, but merely change values. In this situation, we can replace the subclasses with a Factory and make `numberOfWheels` a read-only property of `Vehicle` whose value we can set in its constructor.

```java
class Vehicle {
  Vehicle(/* ...stuff... */, int numberOfWheels) {
    // greatness, then
    this.numberOfWheels = numberOfWheels;
  }
  
  // much greatness, then
  int countWheels() { return this.numberOfWheels; }
}

// You don't have to call this VehicleFactory!
class Vehicles {
  static Vehicle bicycle() { 
    return new Vehicle(/* blah */, 2);
  }

  static Vehicle trikke() { 
    return new Vehicle(/* blah */, 3);
  }
  
  // and so on...
}
```

If it turns out that `HeavyDutyTruck` has some significant behavior variations, then the Factory can return a `HeavyDutyTruck` to the invoker, even though the invoker doesn't care. Indeed, this is what makes a Factory a Factory.

From this experience, I gleaned a lesson.

<section class="highlight" markdown="1">

When subclasses differ only in methods that return values, consider removing the subclasses my moving the values into the superclass's constructor.

</section>

## Not Just Values!

Today I read ["Dynamic Dispatch in Haskell, or: How Can I Make My Code Extendable?"](https://two-wrongs.com/dynamic-dispatch-in-haskell-how-to-make-code-extendable), which led me to the Stack Overflow discussion ["Dynamic dispatch in Haskell"](https://stackoverflow.com/questions/13106683/dynamic-dispatch-in-haskell), which led me to a minor aha! moment.

<section class="highlight" markdown="1">

With functional programming style, functions are values, and so we can apply this same refactoring to eliminate or avoid heavyweight designs involving Typeclasses. We can treat even significant behavior variations—implemented as functions—the same way we treat minor variations in values. We can do this because functions are also values!

</section>

This immediately triggered me to recall the wonderful ["Functional programming in object oriented languages"](https://www.harukizaemon.com/blog/2010/03/01/functional-programming-in-object-oriented-languages/) in which Simon observes that "An object is a collection of partially applied functions"… and a few little things clicked into place. This should make my occasional foray into functional programming significantly less scary: when I think I want Typeclasses—especially since I don't really understand Typeclasses yet—I have a trick to talk myself out of it.

Here we have another idea that eluded me… and then suddenly became obvious. It feels jarring, but I like it.

# References

Chris in Stockholm (aka ~kqr), ["Dynamic Dispatch in Haskell, or: How Can I Make My Code Extendable?"](https://two-wrongs.com/dynamic-dispatch-in-haskell-how-to-make-code-extendable).

Stack Overflow, ["Dynamic dispatch in Haskell"](https://stackoverflow.com/questions/13106683/dynamic-dispatch-in-haskell).

Simon Harris, ["Functional programming in object oriented languages"](https://www.harukizaemon.com/blog/2010/03/01/functional-programming-in-object-oriented-languages/).

Erich Gamma and others. [_Design Patterns_](https://link.jbrains.ca/11ATEqK). Don't just look at the class diagrams! Pay special attention to the _alternatives and drawbacks_.

J. B. Rainsberger, ["Improving Names"](/series#improving-names). A series of articles on how to improve names and the benefits this conveys to our designs.

John Backus, ["Can Programming Be Liberated from the von Neumann Style? A Functional Style and Its Algebra of Programs"]( https://www.csc.villanova.edu/~beck/csc8310/BackusFP.pdf). _Conventional programming languages are growing ever more enormous, but not stronger. Inherent defects at the most basic level cause them to be both fat and weak […]_ This was 1978. It has got both better and worse, from what I can tell.

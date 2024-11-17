---
title: "Null: Design Tool"
date: 2015-05-29 07:00 -0300
tags:
  - Dependency Inversion Principle (DIP)
---
This article describes an evolutionary design microtechnique. Specifically, it describes a _weak signal_ that I use to guide myself towards more modular designs. I find it both simple and surprising: simple because it involves using a single value, but surprising because it involves a value that programmers largely recommend _against_ using. I refer to the humble `null`.

Yes: I have found a way to use `null` that doesn't lead to heartache.

<aside class="aside" markdown="1">Even if you don't program with objects, you'll probably find this useful. Keep reading.</aside>

I start with injecting collaborators through the constructor. (I won't justify this technique in this article. I've done that elsewhere for over a decade.) For example, when using the Web flavor of the MVC pattern&mdash;admittedly the weaker flavor of MVC, but not my immediate concern here&mdash;I typically inject the Model and View into the Controller.

```
class SellOneItemController:
  # catalog and display are protocols
  # or interfaces
  # or abstract type descriptors
  constructor(catalog, display):
    self.catalog = catalog
    self.display = display
```

Apparently we have a point of sale terminal and a controller responsible for selling a single Item to a Shopper. (I'll capitalize the domain concepts so that they stand out a little.) Selling an Item involves scanning a barcode, then seeing its price on the display that typically faces the Shopper (as opposed to the one that the Cashier can see, which might have more details). Of course, we can only see the price if our Catalog contains a listing for the scanned barcode. If the Catalog doesn't recognize the barcode, then the controller asks the display to display a message that both the Cashier and the Shopper can understand. You can probably picture the resulting code.

```
class SellOneItemController:
  on_barcode(barcode):
    price = catalog.find_price(barcode)
    if price:
      display.display_price(price)
    else:
      display.display_product_not_found_message(barcode)
```

More importantly, you can probably picture the corresponding tests. I stub the query and expect the action, following the sensible maxim "Stub Queries; Expect Actions".

```
SellOneItemControllerTests:
  # .cents() builds a Price value
  product_found:
    # a totally made-up test double API
    catalog, display = double("a Catalog"), double("a Display")

    stub(catalog).find_price("12345").and_return(795.cents)
    expect(display).display_price(795.cents)

    SellOneItemController(catalog, display).on_barcode("12345")

  product_not_found:
    catalog, display = double("a Catalog"), double("a Display")

    stub(catalog).find_price("12345").and_return(null)
    expect(display).display_product_not_found_message("12345")

    SellOneItemController(catalog, display).on_barcode("12345")
```

To read these tests in English:

* Pretend that the Catalog has barcode "12345" with price $7.95 (or 7.95€, if you prefer). In that case, when the controller receives barcode "12345", something must display the price $7.95 (7.95€).
* Pretend that the Catalog doesn't have a price for barcode "12345". In that case, when the controller receives barcode "12345", something must display a message that somehow conveys "product not found" for the barcode "12345".

So far, so good. As a programmer with _some_ testing skill, I imagine some special _boundary_ values for `barcode` that might cause trouble, such as our friend the empty string (`""`). Sure enough, I can imagine that a text-based display might create problems for the Shopper and the Cashier if we happen to scan an empty barcode. We might see a message like this:

<p class="user-displayed-message">Product not found for</p>

We programmers can see the empty string at the end of that message, but a Shopper or Cashier might think that something is broken, and rightly so. I'd prefer to do something less likely to create problems. Of course, I start with a test.

```
SellOneItemControllerTests:
  # blah blah blah...
  empty_barcode:
    catalog, display = double("a Catalog"), double("a Display")

    expect(display).display_scanned_empty_barcode_message()

    SellOneItemController(catalog, display).on_barcode("")
```

Wait a moment... what about stubbing the Catalog? **We don't need to.** Therein lies a clue.

## Choices...

If we leave things as they are, then what happens next depends on the test double library I use. If I use JMock, then my production code _may not_ invoke anything on the `catalog` on pain of making the test fail. If I use Mockito, then my production code _may_ send messages to the `catalog`, and nobody will care. Some libraries refer to these as "strict" and "lenient" modes, respectively. For this test, either behavior will do, because I don't intend to use the `catalog` in this branch of the production code; instead, I'll end up with something like what follows.

```
class SellOneItemController:
  on_barcode(barcode):
    if barcode.empty?:
      display.display_scanned_empty_barcode_message()
      return

    price = catalog.find_price(barcode)
    if price:
      display.display_price(price)
    else:
      display.display_product_not_found_message(barcode)
```

I don't intend to discuss the Guard Clause here, beyond saying that I prefer it to the alternatives that I know about. If you want to suggest something better, then [click here](https://tell.jbrains.ca/).

## The Key Observation

I notice two things:

1. `on_barcode()` has a code path that doesn't invoke the `catalog` at all.
1. `SellOneItemControllerTests.empty_barcode` doesn't need to stub any behavior on the `catalog`.

Of course, these two things relate to each other, both signaling the same underlying risk: we have a code path inside `SellOneItemController` that ignores one of its collaborators. I call this a _risk_, because it doesn't necessarily signal a _problem_, but rather a potential problem in the future. Moreover, I can make this risk even more explicit with my simple trick.

## The Trick!

If we don't need a collaborator, then let's really say so.

```
SellOneItemControllerTests:
  # blah blah blah...
  empty_barcode:
    display = double("a Display")

    expect(display).display_scanned_empty_barcode_message()

    # The Trick! I don't need a catalog at all.
    SellOneItemController(null, display).on_barcode("")
```

If I can pass `null` as the value for a collaborator, then I do. This signals something potentially interesting to me: a code path through the _subject under test_ ignores that collaborator. On its own, a single path like this matters not at all. A few paths like this, however, signal that **perhaps the subject under test has too many responsibilities**.

You might think that I've gone mad. You might think that I've started over-engineering by suggesting that `on_barcode()` has too many responsibilities. Look at how small it is! For that reason, I called this a _weak signal_ pointing to a _risk_. I can't say that this causes a problem just yet, but I prefer to think about these issues earlier, when addressing the problem generally costs less.

<p class="highlight" markdown="1">When a kitten scratches you, it hurts. When a lion scratches you, you die. I like to consider design problems as kittens, rather than waiting until they become lions. Or spirit-crushing legacy code.</p>

## The Evidence (?)

Once again, when I have only one code path that ignores a collaborator, then I can't justify concluding definitively that I should split the module (or class) into pieces just yet; however, I can absolutely justify taking a few moments to consider it. More importantly, I can justify wondering what test (or feature) I'd have to write to force myself to confront the issue more seriously&mdash;how might I gather evidence that I should split this behavior from the rest of the module (or class)? If I can think of this in a few seconds, and if that behavior is on the immediate list to implement, then I favor choosing that test sooner; and if not, then I don't.

In this case, I don't encounter this issue again until I implement more of the system: notably when I connect the hardware. If you want the details, then you'll have to sign up for my online TDD training, but I can give you a preview here.

1. Why does `on_barcode()` need to even worry about the empty string? Because the language doesn't easily let us declare the `barcode` parameter in a way that rejects the empty string.
1. How do we even get an empty string at all? It depends on how we implement the UI. With some barcode scanner hardware, it can't happen, but with a computer keyboard, I could just hit ENTER without entering a barcode.
1. Who bears responsibility for rejecting the empty string as a barcode? Ideally, only one part of the code base. It really depends on the consequences of processing an empty string, and that becomes an accident of implementation. In our case, so far, the controller simply wouldn't find a price for the barcode, and would display a confusing message to the Shopper and Cashier. Tolerating that or not becomes a business decision.

When we connect the hardware, we eventually build the thing&mdash;you know, the _thing_&mdash;that listens to `stdin` and hands lines of text over to something that interprets them as barcodes or other kinds of commands. This thing&mdash;call it a Text Command Consumer&mdash;also has to decide how to process empty commands. It can blithely ask the interpreter to interpret them, or it can helpfully (?) reject them as uninterpretable. This becomes a design decision. What we do here determines what we do in `SellOneItemController`.

On the one hand, we could tell the controller not to worry: we could make its clients filter empty barcodes out. We could also tell the controller that it has to defend itself against an attack that it should blame on the programming language in question. (In another language, we could define a data type that excludes the empty string. In Java, we could make `on_barcode()` take a `Barcode` that can't be empty. We have ways.)

I find it comforting to know that, by passing `null` as the `catalog` collaborator, I had to consider all this; otherwise, this detail could go unconsidered, leading to a classic "You were supposed to handle that!" problem weeks or months from now.

So there you have it: `null` doesn't always have to suck. Enjoy.

<p class="highlight" markdown="1">You can find more of this as part of my online training course, [_The World's Best Intro to TDD_](https://wbitdd.jbrains.ca).</p>

## References

Tony Hoare, ["Null References: The Billion-Dollar Mistake"](https://link.jbrains.ca/billion-dollar-mistake). If you made a mistake that cost an entire industry billions of dollars over the length of your career, would you have the courage to admit it publicly?

J. B. Rainsberger, ["Injecting Your Dependencies Doesn't Have to Hurt"](/permalink/injecting-dependencies-doesnt-have-to-hurt).

J. B. Rainsberger, ["Injecting Testability Into Your Design"](https://link.jbrains.ca/vN1IiF). (_Originally published in Better Software, April 2005._) In this article I describe how and why, including walking the reader through an example.

J. B. Rainsberger, ["An answer to, 'What are the advantages and disadvantages when we are implementing the dependency injection?'"](https://link.jbrains.ca/1ymPozy).

Steve Freeman and Nat Pryce, [_Growing Object-Oriented Software, Guided by Tests_](https://link.jbrains.ca/10nrSjg). This fantastic book includes such gems as "Stub Queries; Expect Actions". Run, don't walk, to your local large multinational conglomerate and buy a copy today!

Tom DeMarco and Tim Lister, [_Waltzing with Bears_](https://link.jbrains.ca/S2jyPY). My favorite manual for managing risk on software projects. It includes the definitions of _risk_ as a potential problem and _problem_ as a realized risk.

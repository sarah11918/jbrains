---
title: "A Guard Clause Is Maybe a Tiny Parser"
date: 2023-12-20
tags:
  - Simple Design
  - Refactoring
  - Microtechniques
# summary: >
#   A guard clause might be an embryonic parser, so
#   what happens if you nudge it in that direction?
---

# Overture

You've probably seen code like this:

```
if (condition)
    ...more code...
```

You've probably seen code that looks like this, and then after you understand it, you think of it more like this:

```
if (protective_condition)
    ...now it's safe to run this code...
```

You've almost certainly considered expressing this intention more directly using a Guard Clause: a structural pattern that emphasizes the protective intent of the condition. Now you have code that looks more like this:

```
if (!protective_condition) return;

// Whew! The coast is clear.
...more code...
```

I already really prefer this code, because it communicates the protective intent of the condition. This code's structure screams "**WARNING!** Don't even _think_ about trying to handle this request unless these critical preconditions are met! If you don't meet these critical preconditions, but you run this code, there is no warranty, express nor implied. You're on your own. Good luck."

This sounds like the kind of warning I'd like to notice easily as I wander through the code. The Guard Clause structure draws attention to that kind of warning.

If you're satisfied, then stop here.

# Struggle

Sometimes we want to extract the "more code" and isolate it from the Guard Clause, because that makes the overall code less expensive to understand how to change safely, accurately, and confidently. That often leads to code that looks like this:

```java
void onBarcode(String barcode) {
    if (barcode.isEmpty()) {
        display.displayEmptyBarcodeMessage();
        return;
    }

    whatDoIEvenCallThis(barcode);
}

void whatDoIEvenCallThis(String barcode) {
    Price price = catalog.findPrice(barcode);
    if (price == null) {
    	display.displayProductNotFoundMessage(barcode);
  	}
  	else {
  	    display.displayPrice(price);
  	}
}
```

I've taken this example from the Point of Sale system that I typically offer as a project in my training courses. I notice two things:

1. I don't quite know what to call this method. I wish I could also call it `onBarcode()`, but Java won't let me.
2. When I invoke `whatDoIEvenCallThis()`, I have to remember that it doesn't properly defend against the invalid input of an empty `String`, which makes the code more expensive to understand how to change safely, accurately, and confidently.

What do programmers often do in this situation? I see them do this:

```java
public void onBarcode(String barcode) {
    if (barcode.isEmpty()) {
        display.displayEmptyBarcodeMessage();
        return;
    }

    handleValidBarcode(barcode);
}

private void handleValidBarcode(String barcode) {
    Price price = catalog.findPrice(barcode);
    if (price == null) {
    	display.displayProductNotFoundMessage(barcode);
  	}
  	else {
  	    display.displayPrice(price);
  	}
}
```

The name "handle valid barcode" at least tries to signal to the human reader that the method only operates on "valid" barcodes, but it doesn't help the programmer understand what "valid" means in this context. We could try a more-precise name, but then we'd duplicate the Guard Clause condition in one method with the name of a different method. This might work fine while the methods remain in the same class, but I'd bet my own money on this eventually becoming Spooky Action At a Distance. It's only a matter of time.

Marking `handleValidBarcode()` as `private` makes it sufficiently difficult to invoke the method out of its context, but at the price of nailing the method fast to its context. It reduces options for moving code around. I'd bet my own money that someone will eventually [scream "WHY?!?!?"](https://blog.jbrains.ca/permalink/ask-why-but-never-answer) when they want to write a test for the future version of this code and learn that they can't, because it's not `public`. (Well... that doesn't _stop_ them, but it forces them to jump through pointless and confusing hoops. Every path forward from here causes pain and suffering.)

There has to be a better way.

# Parser

I prefer to invoke the delightful principle ["Parse, Don't Validate"](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) here, so that the type system makes it clear that by the time the data reaches `handleValidBarcode()`, we can trust it to be valid, even when we don't know what "valid" means.

The strategy involves parsing the `String` into a value type that carries the information "No, really, this value is totally valid. No need to trust me; I have the receipts." We don't even need to struggle to find a name for it: there's a clue in the name of the argument to `onBarcode()`.

```java
class Barcode {
    public Either<EmptyBarcode, Barcode> parse(String text) {
        return text.isEmpty()
            ? Either.left(EmptyBarcode.instance())
            : Either.right(new Barcode(text));
    }
    
    private final String text;
}
```

If you find `Either` too heavy-handed, then you could use `Maybe` or even throw an exception. The three options are equivalent enough that I would feel comfortable using whichever one you preferred.

Now that we have this parsing behavior, we could rewrite `onBarcode()` like this:

```java
public void onBarcode(String text) {
    Barcode.parse(text).map(
        // A bit ugly, so maybe use functions
        // instead of actions/Consumers/void
        barcode -> {
            handleValidBarcode(barcode);
            return null;
        }
    ).orElseRun(
        ignored -> display.displayEmptyBarcodeMessage()
    );
}

private void handleValidBarcode(Barcode barcode) {
    Price price = catalog.findPrice(barcode.text());
    if (price == null) {
    	display.displayProductNotFoundMessage(barcode.text());
  	}
  	else {
  	    display.displayPrice(price);
  	}
}
```

Here I'm using Vavr's version of `Either`, which might look strange to some readers, especially when combined with methods that return `void`. Maybe you'd prefer a plain Java version that signals parsing failure by throwing an exception.

```java
public void onBarcode(String text) {
    try {
        handleValidBarcode(Barcode.parse(text));
    }
    catch (EmptyBarcodeException handled) {
    	display.displayEmptyBarcodeMessage();
    }
}

private void handleValidBarcode(Barcode barcode) {
    Price price = catalog.findPrice(barcode.text());
    if (price == null) {
    	display.displayProductNotFoundMessage(barcode.text());
  	}
  	else {
  	    display.displayPrice(price);
  	}
}
```

Whichever you choose, you might then prefer to refactor the rest of the code base to operate on `Barcode` values instead of the raw `String`, at least until you actually need the raw `String`.

# Judgment

Which do you prefer? I know: it depends on the context. You can't really know until you try it. In a small code base, the parser feels like overkill, but as the code base grows, it becomes increasingly valuable to know when the value in your hands is trustworthy or not. Indeed, that was the point of the protective condition at the very beginning of our journey: to draw attention to the fact that that text was not yet trustworthy, so the rest of the system shouldn't even try to process it until it knows that the barcode text is not empty. The Guard Clause takes one significant step in the direction of expressing that intent more clearly. The Parser makes the matter nearly impossible to ignore, especially when the Parser returns an `Either` value or throws a compile-time type-checked exception.

# Conclusion

A Guard Clause is maybe a tiny parser, so try replacing it with a parser. Once you become comfortable with this progression of refactorings---from protective condition to Guard Clause to Parser---you can do it effortlessly the moment that the simple protective condition becomes a noticeable irritation; before then, you can safely let it be as it is. This is the awesome power of any refactoring: once you know how to do it well enough, you can trust yourself (and others) much more to do it, but only when it becomes truly helpful.

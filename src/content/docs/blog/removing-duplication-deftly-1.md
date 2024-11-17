---
title: "Removing Duplication Deftly 1"
date: 2021-02-08
tags:
    - Simple Design
    - Refactoring
    - Removing Duplication Deftly
# imageUri: "/images/Removing-Duplication-Deftly-poster.png"
excerpt: >
    We removed duplication as part of fixing a defect. Doing this helped
    us see more clearly both how to understand and fix the defect.
---

In my evolutionary design practice, I consider _removing duplication_ one of the three fundamental moves.[^the-fundamental-moves] Accordingly, I practise this move daily and trust it as a primary tactic for understanding the needs of the design. I would like to share a little example with you.

[^the-fundamental-moves]: I think of these as the three fundamental movies: make a new test pass, remove duplication, improve a name. They form the [Simple Design Dynamo](https://blog.thecodewhisperer.com/permalink/putting-an-age-old-battle-to-rest).

We encountered this example during a session of [Evolutionary Design Without* Tests](https://pubmob.com/offerings/jbrains-evolutionary-design-without-tests/). We're adding a feature to the Point of Sale system: adding _provincial sales tax_ to each item as the shopper purchases it. The system already supported _federal sales tax_, so here we were adding essentially the same behavior with some slightly different parameters.

We added behavior to the user interface, but we got it wrong. When the cashier scans a product that attracts taxes, the Customer wants to see something like this:

```
$17.95 GP
```

Here, "G" signifies the federal sales tax, called "GST" in Canada, while "P" signifies the provincial sales tax, called "PST" in (parts of) Canada.

Although the Customer wants to see this, they see this:

```
$17.95 G P
```

We clarified with the Customer that they want to see whitespace between the _net price_ and the _sales tax indicators_, but that when the product attracts multiple sales taxes, to show all the indicators "bunched together" without intervening whitespace. We then set about fixing this UI defect.

## Fixing the UI Defect

We isolated the defect to _formatting the price of a product_, the code for which we find in `Product`.

```java
public class Product {
    [...]
    private final int netPrice;
    private final boolean gstApplies;
    private final boolean pstApplies;

    [...]
    public String formatPrice() {
        final String gstApplied = gstApplies ? " G" : "";
        final String pstApplied = pstApplies ? " P" : "";
        return String.format("$%.2f%s%s", netPrice / 100d, gstApplied, pstApplied);
    }
}
```

I presume that you see the duplication between `gstApplied` and `pstApplied`. [My intuition tells me](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer) to classify this as _essential_ duplication[^essential-duplication] and I judge it easy to remove, so I choose to do it now. (In other situations, I might invoke the _Rule of Three_ and not remove the duplication until I saw a third variation of the code.) I propose the following microsteps.

[^essential-duplication]: Duplication that appears to come from the problem domain, as opposed to purely from an accident of how we've written the code so far.

1. Isolate the leading space characters in " G" and " P". **Separate the identical parts from the differences**.
2. Introduce a temporary variable for the leading space. **Collect the identical parts, leaving behind the differences**.

The act of introducing a temporary variable forces us to _name_ the leading space value. When we discussed the options for names, we chose an [accurate-but-vague](https://blog.thecodewhisperer.com/permalink/a-model-for-improving-names) name `anyTaxApplied`. **Type what you say**. This name revealed to us the exact nature of the defect: the code adds the "leading space", even when there is nothing to "lead", in spite of the fact that _we know_ that we want a leading space only if at least one tax has applied to the purchase.

```java
    public String formatPrice() {
        // DEFECT We include this even when no taxes apply.
        final String anyTaxApplied = " ";
        final String gstApplied = gstApplies ? anyTaxApplied + "G" : "";
        final String pstApplied = pstApplies ? anyTaxApplied + "P" : "";
        return String.format("$%.2f%s%s", netPrice / 100d, gstApplied, pstApplied);
    }
```

Now it seems quite clear how to fix the defect: move formatting the leading space into the `format()` line. **This removes damaging duplication**, namely _always_ doing something that we ought to do only _sometimes_. **Sometimes, trying to remove duplication results in fixing defects as a side-effect**. 

We chose to fix the behavior as soon as we could safely do that, then **clean up before moving on**.

1. Change `anyTaxApplied` to "one space if either tax applies, otherwise empty". **Match the name to the code**.
1. Format `anyTaxApplied` directly in the `format()` line, rather than as part of `gstApplied` and `pstApplied`. **Remove duplication**.

We end up with here. I feel content with this code.

```java
    public String formatPrice() {
        final String anyTaxApplied = gstApplies || pstApplies ? " " : "";
        final String gstApplied = gstApplies ? "G" : "";
        final String pstApplied = pstApplies ? "P" : "";
        // REFACTOR Use formatMonetaryAmount() for this
        return String.format("$%.2f%s%s%s", netPrice / 100d, anyTaxApplied, gstApplied, pstApplied);
    }
```

## Future Refactorings

I can already see a direction this code might go: first to Maybe sales taxes and perhaps eventually to a List of sales taxes. This would help us deal with a more trickier form a duplication in the design. I'll leave the details of that to a future article.

## That Felt Slow

It always feels slow when we read about it. According to the commit logs, the entire change happened in less than 2 minutes, once we agreed on the presence of the defect, including the 5 commits.

## References

J. B. Rainsberger, ["Putting An Age-Old Battle To Rest"](https://blog.thecodewhisperer.com/permalink/putting-an-age-old-battle-to-rest). Turn the four elements of simple design into a continuous improvement machine.

J. B. Rainsberger, ["A Model for Improving Names"](https://blog.thecodewhisperer.com/permalink/a-model-for-improving-names).

J. B. Rainsberger, ["Becoming An Accomplished Software Designer"](https://blog.jbrains.ca/permalink/becoming-an-accomplished-software-designer). I can make design decisions either intuitively or mechanically. Both work well. When they agree, so much the better.

J. B. Rainsberger, ["The Two-Minute Rule"](https://blog.jbrains.ca/permalink/the-two-minute-rule). Not my idea. Part of _Getting Things Done_. If you can do it in less than two minutes, then do it now, otherwise put it in the inbox to process later.
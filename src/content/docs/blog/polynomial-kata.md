---
title: "Polynomial Kata in 46 Commits"
date: 2022-02-04
tags:
    - Simple Design
    - Refactoring
    - Evolutionary Design
    - Tutorials
    - Removing Duplication Deftly
excerpt: >
    An example of test-first programming, focusing on adding behavior
    incrementally and removing duplication.
---

I noticed that [Ron Jeffries had written about a kata I hadn't tried before](https://ronjeffries.com/articles/-z022/strawberries/-z00/sb-009/), so I decided to try it. The exercise involves evaluating a polynomial of one variable at a single point.

For example: 5x^3^ + 4x^2^ + 19x + 3 at the point x = 5 evaluates to 823. Check my arithmetic if you like.

How does one write this incrementally and test-first? First things first: if you've never tried it, and especially if you're new to test-first programming, then try it yourself. Take small steps and never write new production code without a failing test.

If you'd like to follow along commit-by-commit, then visit [this Git repository](https://github.com/jbrains/evaluate-polynomial-of-one-variable). Let me share the highlights.

> The "Browse the code" links go to specific files at Github. If you change the URL in your address bar from `github.com` to `github.dev`, then you'll be able to browse the code in a browser-based version of VS Code. Enjoy.

# Property-Based Testing

I often start with a concrete example, then want to expand the example to check all possible inputs. Property-based testing helps me do that. I used [jqwik](https://jqwik.net) for this. I find it easy to start with a concrete example, then generalize if it's safe. Sometimes the property I would check is as difficult to describe as the implementation that would pass the tests, in which case I use concrete examples in place of property-based tests.

I started with the constant case: the polynomial 5 at the point 2 evaluates to 5. Moreover, it evaluates to 5 at all points. The corresponding property seemed easy to write. ([Browse the code](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/4c3905f21925b31fa60ebd4542d5b294e792cbcc/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java)) So far, we can hardcode the answer and it suffices to have thrown all the inputs together into the Junk Drawer called `polynomialOfAt()`.

# Improve the API

When I tried to write the next test, I quickly noticed a weakness in the API, so I chose that moment to separate the coefficients of the polynomial from the desired evaluation point. I chose arbitrarily to represent the coefficients "backwards": the first element is the 0th position, the second element is the 1st position, and so on. Looking back, I don't think this made the solution any nicer or any less nice. ([Browse the code](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/fec4f5550ba51299eac8da84cc7ff80496489544/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java))

# Crank Out the Permutations

Next, I added the linear cases. I added one non-zero coefficient at a time. This helped me sneak up on the solution with no stress.

Throughout this kata I followed this pattern:

- add new behavior with "`if` it's the old situation, do whatever was already there; `else` do the new thing", hardcoding the literal value for "the new thing"
- replace the hardcoded literal value with a calculation, if it's obvious
- try to collapse branches of the `if` statement

Although this might seem like overkill for a simple problem, this approach helps me add behavior with less stress in situations where I genuinely don't yet see the pattern, so I have come to trust it. I committed after each step, so that you can see how I did it.

I first implemented the case **ax**, then I implemented **ax+b**. [By this point](https://github.com//jbrains/evaluate-polynomial-of-one-variable/blob/dcc9592e7194113876593c0bd236d64395c3dba3/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java) I had polynomials of degree 1 working.

# Uh... Zero!

I quickly realize that I'd forgot about 0, so I attended to that next. There is only one "empty" polynomial and it evaluates to 0 at all points. First I wrote a concrete example, then generalized it to a property. ([Browse the code](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/566ff9a0b2daf84e353c545cf3eb9761e9fe2b7f/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java))

# Vavr!

At this point I knew I wanted to start taking advantage of a nicer collections library, so I installed [vavr](https://vavr.io) and migrated away from a naked Java array to a Vavr List. I freely admit that for an exercise this simple, such a decision is overkill; however, I like the libraries I like.

I used the technique that I learned from Kent Beck decades ago:

1. Add the new thing
2. Migrate the clients
3. Remove the old thing

Step 0, if you like, involves [renaming something to make room for the new thing](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/eec1289442edad13eb2d98f5775c90f2ae70a9f6/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java). I like to use the trick of renaming `blah` to `legacyBlah` in order to make room for the new thing that I'd prefer to call `blah`.

In this case, I [combined steps 1 and 2 into the same commit](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/119aa1d43791ea216ab0b7702c50ac2104abab15/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java). Then [I performed step 3 in its own commit](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/44924f4d17afaa01cae7d879d82dd7b67a477a5a/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java). Finally [I cleaned up before moving on](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/a86915061edc25eb15ae8ca896846c16e0a332f5/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java).

# Make Similar Code More Similar

From here, I used a few fundamental tricks to continue:

1. Add behavior incrementally by adding non-zero coefficients one at a time.
2. First hardcode the answer, then replace literal values with expressions, working from the output towards the input.
3. Made similar code more similar in order to make duplication easier to stop, then remove.

Once I had degree-2 polynomials working, I mostly made similar code more similar until I could sense a pattern of recursion. After [scrambling to make the degree-2 case work](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/334d77c441d2db530d7fd18c6d30a65ffd358b7a/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java), I just kept making similar code more similar commit by commit until [similar code became identical](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/de1e23594ecfde93fa458cc3ada4b704404bbedb/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java). At that point, it felt easy to remove the duplication.

# Remove Duplication

From this point, I mostly removed duplication until I felt satisfied that there was none left to remove. At the same time I replaced recursion with iteration for computing **x^n^** and I improved some names by using conventional terms from the domain of mathematics.

# Degree 3?

By the time I reached degree-3 polynomials, I felt entirely confident that I already computed them correctly, so I didn't bother writing any more tests. If I were pairing with you and you had wanted to write more tests, I'd have written as many as it took to give you enough confidence to move on.

# The Thrilling Conclusion

That's it. Here's [the final code](https://github.com/jbrains/evaluate-polynomial-of-one-variable/blob/main/lib/src/test/java/ca/jbrains/math/EvaluatePolynomialAtOnePointTest.java).

```java
package ca.jbrains.math;

import io.vavr.collection.List;
import net.jqwik.api.ForAll;
import net.jqwik.api.Property;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class EvaluatePolynomialAtOnePointTest {
    @Property
    void empty(@ForAll int point) {
        Assertions.assertEquals(0, Polynomial.of().at(point));
    }

    @Test
    void constant() {
        Assertions.assertEquals(5, Polynomial.of(5).at(2));
    }

    @Test
    void linearWithZeroIntercept() {
        Assertions.assertEquals(10, Polynomial.of(0, 5).at(2));
    }

    @Test
    void linearWithNonZeroIntercept() {
        Assertions.assertEquals(31, Polynomial.of(3, 4).at(7));
    }

    @Test
    void simplestQuadratic() {
        Assertions.assertEquals(45, Polynomial.of(0, 0, 5).at(3));
    }

    @Test
    void quadraticWithNonZeroLinearCoefficient() {
        Assertions.assertEquals(7 * 4 * 4 + 3 * 4, Polynomial.of(0, 3, 7).at(4));
    }

    @Test
    void quadraticWithNonZeroLinearCoefficientAndNonZeroConstant() {
        Assertions.assertEquals(7 * 4 * 4 + 3 * 4 + 9, Polynomial.of(9, 3, 7).at(4));
    }

    @Property
    void constantIsConstant(@ForAll int zerothPowerCoefficient, @ForAll int atPoint) {
        Assertions.assertEquals(zerothPowerCoefficient, Polynomial.of(zerothPowerCoefficient).at(atPoint));
    }

    private static class Polynomial {
        private final List<Integer> coefficients;

        public Polynomial(List<Integer> coefficients) {
            this.coefficients = coefficients;
        }

        public static Polynomial of(int... coefficients) {
            return new Polynomial(List.ofAll(coefficients));
        }

        public int at(int point) {
            if (coefficients.length() == 0) return 0;
            return coefficients.last() * pow(point, coefficients.length() - 1) + Polynomial.of(coefficients.init()).at(point);
        }

        // CONTRACT exponent >= 0
        private int pow(int base, int exponent) {
            int result = 1;
            while (exponent-- > 0) {
                result *= base;
            }
            return result;
        }

        private static Polynomial of(List<Integer> coefficients) {
            return new Polynomial(coefficients);
        }
    }
}
```

Your comments and questions are welcome.


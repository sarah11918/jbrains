---
title: "11ty By Intention"
date: 2021-02-15
tags:
    - Adventures in 11ty
    - Simple Design
# summary: >
#     I started out by wanting a Nunjucks filter to reverse
#     a collection of posts, from which I would later
#     "take 10", but then I realized I could simply program
#     _by intention_.
# imageUri: "/images/Adventures-in-11ty-Twitter-Post.png"
---
Over at [The 260 Bowler](https://the260bowler.ca) I've added a handful of diary entries (just _blog posts_), so now I want a diary page (think _recent posts_). I started simply, iterating over all the entries, summarizing them, then starting to add nice styles so that they look vaguely like a diary page. I'll make it look really nice before I move on.

<figure>
![I'm designing mobile-first. Are you proud of me?]({% link images/11ty-by-intention/diary-page-before.png %})
</figure>

I thought, "Hey! I should show these in reverse order, and then limit then to something like 5 or 10 entries." When I thought about how to do that, I immediately jumped to writing Nunjucks filters, since that's how I did things with Jekyll and Liquid. I had in mind something like this:

{% raw %}

```javascript
{% for entry in collections.diary_entries | reverse | limit(5) %}
[...]
```

{% endraw %}

I started trying to build some Nunjucks filters, when I realized that I could simply things considerably by writing the whole thing natively in Javascript. (This is one of the primary advantages of 11ty: the configuration is Javascript, which removes 99% of the resistance to extending the "language" of the site.) This opens up the opportunity to do something that we know and love: **programming by intention**.

<details class="aside">    
<summary>Don't remember what **programming by intention** means? Click here.</summary>
We **program by intention** when we focus on the overall workflow and defer implementing the parts. We simply invoke the functions or methods that we wish existed, then implement them later. I often find it helpful to do this when I worry about becoming bogged down in the implementation details. Programming by intention relates strongly to the **Composed Method** pattern that Kent Beck wrote about in [_Smalltalk Best Practice Patterns_](https://www.amazon.com/Smalltalk-Best-Practice-Patterns-Kent-ebook-dp-B00BBDLIME/dp/B00BBDLIME?&linkCode=ll1&tag=jbrains.ca-20&linkId=d9d1565c73facc4e15fce19c98ebe6e2&language=en_US&ref_=as_li_ss_tl).
</details>

Programming by intention generally means **attending to names**, so I started there:

{% raw %}

```javascript
{% for entry in collections.recent_diary_entries %}
[...]
```

{% endraw %}

After that, I felt free to express myself completely in Javascript, rather than feel restricted by the syntax of a template language such as Nunjucks or Liquid.

```javascript
// Inside a function that uses eleventyConfig as a Collecting Parameter

// shouldPublishDiaryEntry :: Post -> Boolean

const collectRecentDiaryEntries = (collection) =>
  collection.getAllSorted().filter(shouldPublishDiaryEntry).reverse();

eleventyConfig.addCollection(
  "recent_diary_entries",
  collectRecentDiaryEntries
);
```

In this case, I typed in the Obvious Implementation and _it just worked_.

<figure class="interstitial-visual-element">
![](https://media.giphy.com/media/o75ajIFH0QnQC3nCeD/giphy.gif)
</figure>

# References

11ty Documentation, ["Shortcodes"](https://www.11ty.dev/docs/shortcodes/). A reference on adding _shortcodes_, which act like library functions.

Kent Beck, [_Smalltalk Best Practice Patterns_](https://www.amazon.com/Smalltalk-Best-Practice-Patterns-Kent-ebook-dp-B00BBDLIME/dp/B00BBDLIME?&linkCode=ll1&tag=jbrains.ca-20&linkId=d9d1565c73facc4e15fce19c98ebe6e2&language=en_US&ref_=as_li_ss_tl). I recommend this, whether you ever intend to write Smalltalk or don't.

Jeff Langr, [_Essential Java Style: Patterns for Implementation_](https://www.amazon.com/Essential-Java-Style-Patterns-Implementation/dp/0130850861?&linkCode=ll1&tag=jbrains.ca-20&linkId=8705510187eb5691e7c769a6641494a0&language=en_US&ref_=as_li_ss_tl). If you just can't read a book on Smalltalk, then read this one, which is very much the same book, but in Java. From 1999. It's fine.

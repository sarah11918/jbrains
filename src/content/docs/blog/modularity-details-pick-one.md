---
title: "Modularity. Details. Pick One."
date: 2013-01-31
lastUpdated: 2020-11-12
tags:
    - Simple Design
    - Refactoring
excerpt: >
   You have to choose between modularity and seeing more details more often.
   If you want more modularity, then complain that you can't see all the code
   at once, then you have an inner conflict to resolve. I understand.
---
The bottom line:

> Modularity. Details. Pick **one**.

I often spend time with programmers who don't like small methods and small classes, in spite of all the benefits of small methods and small classes:

* easier to test
* easier to read, quicker to skim
* costs less to understand, less to understand at once
* easier to build correctly, quicker to build
* easier to compose into working systems

These programmers range from feeling vaguely uncomfortable to showing strong and open antipathy towards small methods and small classes. They cite these two problems most often:

* "I can't find stuff!"
* "I have to click too much to see what's happening!" 

In an article titled "Why Shorter Methods Are Better", which seems to have been removed from the internet, Kevin Rutherford reminded me of this issue. While Kevin extols the virtues of small methods, he admits that he feels both of these two things, but doesn't tell us how he handles them. I started writing a comment on his article, but that expanded into this article. When I hear programmers complain (rightly) about these things, I offer the following two responses to them.

## Would searching feel better than browsing?

I have paired, albeit mostly briefly, with thousands of programmers by now. To my surprise, they _browse_ or *navigate* their code bases to find things, whereas I would insist on _searching_. By this, I mean that they open up folders in a navigator view in their IDE, or navigate the file system, in order to locate a file containing the code that they want to read or change. This used to really bother me; in those days, [I probably gave them a bad pair programming experience](https://www.youtube.com/watch?v=OQXEzwXtzJ8) by asking too many annoying questions too early about microtechniques. I trained myself over time to watch them patiently, focus on the bigger picture, earn their trust, and then _eventually_ I stop them and ask:

> I would typically search for that, rather than navigating to it. Do you think that might help you?

I learned over the years to stop caring *where* to find things any more. It costs me much less in mental energy to know that "they're somewhere in this room"[^summer-school]. I navigate when searching fails me and I don't have the energy to sharpen my searching skills. Sometimes I realize that I got the search pattern wrong; sometimes I realize that I don't know how to use the relevant search tool; occasionally I don't even have the faintest idea how to search for something. In those situations, I navigate, then make a note to figure out how to search for it next time. (I really like `ripgrep-all`.)

The classic book [The Pragmatic Programmer](https://link.jbrains.ca/WNg8Se) teaches us to learn one editor well, which I try to do, but as part of classroom training and mentoring thousands of programmers, I find myself working in unfamiliar environments quite often. When I work in a new one, I spend some time learning how to search for things. And search tools don't only mean `grep` or `Ctrl+F`. I look for specialized search tools, because their context-specific behavior makes them especially powerful. In Eclipse, I use "Open Type" and "Open Resource" extensively. In IntelliJ IDEA, I lean on `Ctrl+F12` extensively ("File Structure") to quickly find a method by some small part of its name. Before I knew anything useful about `vim` (now [kakoune](https://kakoune.org)), I learned to press `/` to find text in a file. Before I knew anything useful about Unix, I could clumsily use `grep`, and more recently I've learned about `ack`, `ag`, `ripgrep`, and now even `ripgrep-all`. (Maybe I have a search tool problem; _I_ think I have a search tool solution!) I don't use Emacs any more, but I always loved its incremental search feature. Why do I rely on searching so much? I have this computer; I want it to do the things that computers are good at. Computers _find_ things really well, especially something as simple as an exact pattern of text. Humans get that wrong too often---certainly, _I_ do.

I *still* see programmers *scan web pages with their eyes to find exact text*, rather than use the "find in page" feature of their browser. I understand this when they're not sure what they're looking for, but when trying to find exact text? It surprises me every time. I've even enjoyed working in environments *where I don't even know that it stores my code in **files***![^vajava]  (Well, I want my code in files in order to put them into a version control repository, but that's another article.)

This brings me to my other response---the one related to software design.

[^summer-school]: Find and watch [this film](https://www.imdb.com/title/tt0094072). Don't be put off by the inclusion of Kirstie Alley.

[^vajava]: I would really have loved Visual Age for Java if it didn't corrupt the workspace so frequently.

## Modularity. Details. Pick One.

If you ask programmers whether they want more modularity in their code, many say that they do. Some of them genuinely want it and some others think that they _ought_ to want it and still others think it's important to be seen saying that they want it. Even assuming the purest of intentions, many programmers who want more modularity don't seem to understand that **modularity comes from abstraction**, that **abstraction literally means hiding details**, and that **hiding details means moving them out of view, so that you have to go looking for them**. If you want to see the details here and now, that reduces modularity; and if you want more modularity, then you have to move details out of your immediate view. To those who still feel uncomfortable about this, I suggest repeating a little mantra all day today:

> I don't care. I don't need to know. **I don't want to know.**

If that feels too informal, then I make some impressive-sounding argument with phrases like _reducing cognitive load_ and _taking advantage of chunking_. Some people just like that kind of thing; I'm not above resorting to such tricks to help people past their own interference. I find it downright delightful when I see other people use these same tricks on me, especially when it works!

Giving up your desire to see more details won't lead you directly to writing more modular code, but **clinging to details will keep you from it**. The more your code knows about its neighbors, the more it costs to change or replace those neighbors. Changes ripple out to the rest of the system. When you do this, you're writing more legacy code.

> Modularity needs abstraction. Abstraction means hiding details. If you cling more to details, then you will not create enough abstractions, and you won't achieve the modularity that you want. **Modularity improves as you refuse to be distracted by irrelevant details.**

I noticed that my designs improved once I began more-stubbornly refusing to know more than I needed to achieve my current goal. You can frame this as refusing to be burdened or as allowing yourself to let go. "I don't care. I don't need to know. **I don't want to know**. It's OK not to know."

### SOLID: Effective ignorance

Look at the SOLID principles and how they relate to letting go of the details.

* Single Responsibility: I only care about what happens here right now.
* Open/Closed: I only care about how to make my new feature fit into the existing workflow right now. Other workflow users don't matter to me.
* Liskov Substitution: I only care about the contracts of surrounding things, not their implementation details.
* Interface Segregation: I only care about the specific parts of surrounding things that help me achieve my goal.
* Dependency Inversion: I only care about what I can do without worrying about why others might use me.

When I put it this way, the SOLID principles feel downright peaceful!

## You don't want more modularity? That's fine with me.

I've assumed in this article that we *want* more-modular systems. You might not. I didn't intend to argue for the merits of modularity here. Instead, I only wanted to help readers who feel stuck trying to have two fundamentally contradictory things at the same time, in case they interpreted their failures as personal failures. You didn't fail; you tried to do the impossible. You can let go now.

> **Modularity and fixation on details simply don't work together. If you want one, then you need to let go of the other. Pick one.**


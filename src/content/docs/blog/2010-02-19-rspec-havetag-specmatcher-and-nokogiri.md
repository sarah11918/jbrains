---
title: RSpec, have_tag(), Spec::Matcher and Nokogiri
tags: []
---
One of my faithful readers at [https://www.jbrains.ca](https://www.jbrains.ca) told me that he couldn't find an RSS feed icon in his Firefox address bar. I thought I could implement that fairly easily, so I agreed to do it. In the process, I wrote this spec:

{% gist 306627 %}

Ruby follows the Principle of Least Surprise, so I tried this:

{% gist 306629 %}

That doesn't work, as I found no `#with_attribute` nor anything like it. After I dug a little, I found out that I should write this:

{% gist 306632 %}

I don't like this, because it checks two things at once: it looks for an "RSS tag" and checks the `href` attribute. That HTML implemented the "RSS tag" as attributes on `<link>` creates the confusion. The extremist in me calls this an [integrated test](https://www.jbrains.ca/integrated_tests_are_a_scam), but I prefer not to go there today. Suffice it to say that when this check failed, I didn't immediately know why, and I insist on immediately knowing why a check fails. When I've done this in the path with XPath assertions in XHTMLUnit or XMLUnit, I've resorted to writing duplicate checks that build on one another, so I tried that here:

{% gist 306634 %}

Here I sacrificed duplication to improve the clarity of the assertions. I just now noticed that that contradicts my usual rule that removing duplication matters more than improving clarity. I dno't know what to say about that just yet. Even if I remove the duplicate code, I still have the duplicate check, so extracting to a method won't really do much here. I want `#with_attribute`!

Not deterred, I tried introducing a custom RSpec matcher, since I don't know what benefit that would give me, but it would benefit me somehow. When I tried to do that, RSpec told me that it couldn't understand `response.should have_tag` because it couldn't find a `has_tag?` on the response. I didn't like the looks of the stack trace; I felt I would have to delve deeply into RSpec or `assert_select`, and I didn't find myself in the mood to do either, so I switched to Nokogiri.

{% gist 306635 %}

Here I got to write the spec the way I wanted to: assume you will find "RSS feed tag", then check that its `href` attribute matches the right URL. If the response has no "RSS feed tag" at all, then complain violently, because of the higher severity of the mistake.

Of course, if you have another suggestion, I'd like to see it. Add your comment below.

Special thanks to [Frivolog](https://bit.ly/a3P4aU) for helping me get the original `have_tag` code working.

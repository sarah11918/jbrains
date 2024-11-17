---
title: "Publish posts later with Jekyll/Octopress"
date: 2012-12-06
lastUpdated: 2014-10-15
tags:
---
<style type="text/css">
span.keep-together { white-space: nowrap; }
</style>

I really like Octopress, which is built on Jekyll. You can read a lot of articles about the advantages and disadvantages of pre-baked blogs, so I won't bore you with those details. Instead, I'll bore you on the subject of the one feature I miss with pre-baked blogs: scheduling posts for later publication.

When I switched to a pre-baked blogging tool like Octopress, I gave up the ability to upload a post, but publish it later. Well, I didn't really give it up entirely, but pre-baking my blog means thinking of my blog as a static web site, rather than a dynamic one, which implies having to re-deploy every time I wanted to change its content. This makes scheduling posts in the future a bit more tricky.

Using Heroku and its read-only file system make it even trickier, since I can't regenerate the blog in production.

I just wanted to share my solution with you, in case it interests you.
<!-- more -->

First, I added to Octopress the ability to generate the blog without future-dated posts. This looked difficult, especially with Octopress's existing "preview mode" feature, but I discovered that Jekyll supports omitting future-dated posts directly with <span class="keep-together">`jekyll --no-future`</span>, so I augmented Octopress to use this feature. If you'd like to explore the details, [click here](https://link.jbrains.ca/11rxWGB).[^pull-request]

[^pull-request]: I've submitted a [pull request](https://link.jbrains.ca/11Hde4E) for this, but I think Octopress's maintainer has other, more important stuff to do these days.

Next, I needed a way to republish my Octopress site regularly in order to include new posts as their publication instant arrives. I asked my tweeps for ideas, and we agreed that we couldn't get around having a machine Out There Somewhere that's always on that would poll a `git` repository for changes, then regenerate and publish to Heroku. I settled on the following architecture.

![You can smell the Architecture!](/images/PublishLater-Octopress-Heroku/blog-architecture.png)

I followed these basic steps:

1. Added an SSH public key from "Monitor/Staging" to "Production", so that the former could `push` to the latter.
1. Installed a script into "Monitor/Staging" to, well, monitor, stage, then `push`.
1. Cloned my local `git` repository to "Integration" so that it will always be available to "Monitor/Staging".

Complicated, sure, but--and you'll tell me if you disagree--just barely sufficiently complicated, and no worse. I can handle that.

My workflow hasn't changed much. I compose posts, preview, and `push` to "Integration" when I finish. "Monitor/Staging" runs the following script every 10 minutes.

{% include code/deploy-blog.thecodewhisperer.com.sh %}

I write posts to the branch `master`, and "Monitor/Staging" merges them to the branch `publish`, then deploys them to "Production"'s branch `master`.

Of course, I will monitor this closely over the next few days, looking for anomalies. In particular, I worry a little about what happens when "Monitor/Staging" can't merge `master` to `publish` automatically. I suppose in that case I'll have something to worry about, and in the worst case, no changes will publish to production, which could cause annoyance, but sounds like safe default behavior.

If you see any problems with this setup, please don't keep them to yourself!

## There's More!

In 2014 Jason Fox of [neverstopbuilding.com](https://www.neverstopbuilding.com) wrote about how he used Heroku to run a little blog updating application that wakes up on a schedule and tries to publish queued-up posts. He used this article as a jumping-off point. Finally, after two years of looking, I found Jason's article and adapted his approach for myself, rather than needing to run own custom process on a custom server somewhere. I plan to replace this sentence with details on how I did it and a link to a repository you can use as the starting point for solving this problem for yourself. If I haven't done this by December 1, 2014, then [tell me](https://tell.jbrains.ca) that I haven't done it yet. Be sure to link to this article.

## References

Jason Fox, [_Simple Queuing of Jekyll Posts with Heroku (or How to Have Heroku Push to Heroku)_](https://bit.ly/1w2RjEq).

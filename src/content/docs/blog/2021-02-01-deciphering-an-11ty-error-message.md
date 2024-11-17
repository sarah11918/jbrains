---
title: "Deciphering An 11ty Error Message"
date: 2021-02-01
tags:
    - Adventures in 11ty
    - Refactoring
summary: >
    In the process of refactoring an 11ty configuration,
    I ran into an error message that I had to work hard
    to understand. Fortunately, microcommitting made it
    relatively easy to diagnose and fix the problem.
imageUri: "/images/Adventures-in-11ty-Twitter-Post.png"
---

I recently started a [new project](https://the260bowler.ca/) and used this as an opportunity to learn and practise a few things, among which we find [11ty, a static site generator](https://www.11ty.dev/). I fancy myself a static site generator hipster&mdash;I did it before people called it "JAMstack" and made it cool&mdash;first with Octopress, then with [Jekyll](https://www.jekyllrb.com/). Indeed, I've built my other sites with Jekyll and even built the occasional plug-in, taking advantage of my experience working in Ruby.

In spite of my successes with Jekyll, I became especially enamored with the idea of a configuration system based on a programming language (Javascript in the case of 11ty), rather than a file format (such as **yaml**), due to the potential for flexible configuration without adding a preprocessing step to building the site. Various people had alerted me to Hugo, Gatsby, and 11ty, and I decided that now felt like a suitable time to experiment. I didn't want to work in **go** nor **React**, so that left 11ty as the candidate.

After a bumpy start, as seems common when learning a new platform, I began to settle in and gradually noticed myself starting to ship new content with decreasing friction. I had learned the very basics and could at least write posts and link pages to each other. I even made it through a particularly rough episode of forgetting that 11ty was using Liquid to process my Markdown pages, even though those pages were using Nunjucks templates for layouts. I won't lie: that episode shook my faith in the entire project for a few hours, but after sleeping on it, I felt better.

So imagine by surprise when, as I was minding my own business, refactoring my 11ty site, this happened.


```bash
$ DEBUG=Eleventy* npm run build
[... many things ...]
`Template render error` was thrown:
$TIMESTAMP Eleventy:EleventyErrorHandler (error stack): Template render error: (./source/_includes/$LAYOUT_TEMPLATE_NAME.njk)
  TypeError: collection is not iterable
    at Object._prettifyError (/home/jbrains/Workspaces/the260bowler.ca/node_modules/nunjucks/src/lib.js:36:11)
    at /home/jbrains/Workspaces/the260bowler.ca/node_modules/nunjucks/src/environment.js:561:19
    at Template.root [as rootRenderFunc] (eval at _compile (/home/jbrains/Workspaces/the260bowler.ca/node_modules/nunjucks/src/environment.js:631:
18), <anonymous>:59:3)
    at Template.render (/home/jbrains/Workspaces/the260bowler.ca/node_modules/nunjucks/src/environment.js:550:10)
    at /home/jbrains/Workspaces/the260bowler.ca/node_modules/@11ty/eleventy/src/Engines/Nunjucks.js:236:14
    at new Promise (<anonymous>)
    at /home/jbrains/Workspaces/the260bowler.ca/node_modules/@11ty/eleventy/src/Engines/Nunjucks.js:235:14
    at TemplateLayout.render (/home/jbrains/Workspaces/the260bowler.ca/node_modules/@11ty/eleventy/src/TemplateLayout.js:152:31)
    at processTicksAndRejections (node:internal/process/task_queues:94:5)
    at async Template.renderPageEntry (/home/jbrains/Workspaces/the260bowler.ca/node_modules/@11ty/eleventy/src/Template.js:603:17)
[...many more things...]
```

<figure class="interstitial-visual-element"><img src="{% link /images/icons/noun_decrypt_2120627.png %}" /></figure>
This happened when I tried to replace a [tag-based collection of posts](https://11ty.rocks/posts/create-your-first-basic-11ty-website/#create-posts-collection-via-tags) with [an explicit collection of posts](https://www.pborenstein.com/posts/collections/), following Philip Borenstein's the helpful advice. (Thank you!) These kinds of errors create significant resistance for newcomers to a platform. I didn't know at the moment how to interpret the error message: literally or as a distraction from the real problem? I didn't (and still don't) know 11ty well enough to judge.

After recovering from my mild disappointment and vague frustration, I was able to fall back on the Ratchet Effect of incremental development and microcommitting: I couldn't have fallen too far, so I must have made the mistake quite recently, which meant that I knew more or less where to look.

<figure class="interstitial-visual-element"><img src="{% link /images/icons/noun_Story_2658653.png %}" /></figure>
Here is the story of how I arrived at this point. I hope you're sitting comfortably.

Once upon a time, I wrote a few sample blog posts, which I think of as "diary entries", at least for this project. Since I had followed [Stephanie Eckles' instructions](https://11ty.rocks/posts/create-your-first-basic-11ty-website/) when I first created the site, I had tagged every diary entry as "diary entries" by putting a `diary.json` file inside my `diary` folder. This JSON file contained the entry `tags: diary_entries` so that _every_ document inside that directory would have this tag in its front matter/metadata. Accordingly, 11ty would create a Page Collection called `diary_entries` that I could use in my Nunjucks templates as `\{\{ collections.diary_entries \}\}`. I understood this, I did it correctly, and all seemed well.

One day, I decided to refactor my 11ty site, changing how I marked these diary entries as members of the Page Collection `diary_entries`. I would write a function in the 11ty configuration file to collect all the pages marked with the metadata attribute `diary_entry: true` instead of relying on the convention of using a tag. I wrote a function `collectDiaryEntries()` to do exactly that. I understood it and I felt good about it.

So far, I'd followed the sage advice I'd learned two decades ago from Kent Beck. When changing the implementation details:

1. Add the new implementation.
2. Migrate the clients.
3. Remove the old implementation.

When we follow these steps, we change behavior safely, as opposed to ripping out the old thing, then jamming in the new thing under pressure and hammering on it until it works. Delightful!

<figure class="interstitial-visual-element"><img src="{% link /images/icons/noun_Rain_39335.png %}" /></figure>
Just as I tried to remove the `tags: diary_entries` metadata from `diary.json`, in order to migrate from the implicit, magical tag-based implementation to the explicit, transparent add-a-collection-based implementation, thunder cracked in the distance. Lightning struck a few seconds later only a few metres from where I sat.

```typescript
TypeError: collection is not iterable
```

Fortunately, I had been committing small, independent changes frequently, so once I got past the immediate annoyance over the terse error message, I found the source of the problem.

<figure class="interstitial-visual-element"><img src="{% link /images/icons/noun_cloudy_2691334.png %}" /></figure>
I know that if I take a deep breath and just _look_ at what I've done, I often notice the problem quite quickly. I started laughing within seconds. Can you spot the mistake?

{% raw %}

```diff
 eleventy-config.js      | 12 ++++++++++++
 source/diary/diary.json |  2 +-
 2 files changed, 13 insertions(+), 1 deletion(-)

diff --git a/eleventy-config.js b/eleventy-config.js
index bfce2fa6d1f05afce9c13416213258c3c2584d83..6348ff9cdef727e9dcb34807ffc55dfafc43d6f2 100644
--- a/eleventy-config.js
+++ b/eleventy-config.js
@@ -72,6 +72,15 @@ const shortcodesForInterstitialVisualElements = function (eleventyConfig) {
   );
 };
 
+const collectDiaryEntries = function (eleventyConfig) {
+  const isDiaryEntry = (item) =>
+    item.data.diary_entry && item.data.diary_entry === "true";
+
+  eleventyConfig.addCollection("diary_entries", (collection) => {
+    return collection.getAllSorted().filter(isDiaryEntry);
+  });
+};
+
 const dynamicAssetsSourcePath = "source";
 module.exports = function (eleventyConfig) {
   enableRss(eleventyConfig);

   filtersForFormattingDates(eleventyConfig);
   shortcodesForInterstitialVisualElements(eleventyConfig);
 
   buildRules(eleventyConfig);
 
   return {
diff --git a/source/diary/diary.json b/source/diary/diary.json
index 480a24c665f7a17211ad286164cf1bf4f567b176..5f00c03a887e79a129bd031d8020146edbd180a0 100644
--- a/source/diary/diary.json
+++ b/source/diary/diary.json
@@ -1 +1 @@
-{ "layout": "diary-entry.njk", "tags": "diary_entries", "permalink": "/diary/{{ title | replace(':', '') | slug }}/index.html" }
+{ "layout": "diary-entry.njk", "diary_entry": "true", "permalink": "/diary/{{ title | replace(':', '') | slug }}/index.html" }
```

{% endraw %}

<figure class="interstitial-visual-element"><img src="https://media.giphy.com/media/5PkWUpoNuubjSeiyaU/giphy.gif" /></figure>
I _wrote_ the function `collectDiaryEntries()` to ask 11ty to add a `diary_entries` Page Collection, but I didn't _invoke_ the function `collectDiaryEntries()` to ask 11ty to add a `diary_entries` Page Collection.

<figure class="interstitial-visual-element"><img src="https://media.giphy.com/media/5t9pOg5hFJ7E8SJ4mi/giphy.gif" /></figure>
When I removed the `diary_entries` tag from all the pages in the `diary` folder, I was left with "previous entry" and "next entry" links trying to refer to a Page Collection that did not exist. Evidently, in this context, the error message means "`diary_entries`? Which `diary_entries`? Never heard of it."

<figure class="interstitial-visual-element"><img src="https://media.giphy.com/media/80mXWlPqTSU1y/giphy.gif" /></figure>
OK... now that I know what I'm looking for, I can make sense of this message:

```typescript
TypeError: collection is not iterable
```

"OK, this thing I'm calling `collection`, I tried doing some iterating on it and that totally didn't work."

<figure class="interstitial-visual-element"><img src="{% link /images/icons/noun_Repair_3194681.png %}" /></figure>
By now, you know how the story ends.

```javascript
 eleventy-config.js | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)

diff --git a/eleventy-config.js b/eleventy-config.js
index 6348ff9cdef727e9dcb34807ffc55dfafc43d6f2..015a33fa15276ce1206e3af6658da90188739133 100644
--- a/eleventy-config.js
+++ b/eleventy-config.js
@@ -89,8 +89,7 @@ module.exports = function (eleventyConfig) {
   filtersForFormattingDates(eleventyConfig);
   shortcodesForInterstitialVisualElements(eleventyConfig);
 
+  collectDiaryEntries(eleventyConfig);
 
   buildRules(eleventyConfig);
```

Great success!

# References

Stephanie Eckles, ["Create Your First Basic 11ty Website"](https://11ty.rocks/posts/create-your-first-basic-11ty-website). I really enjoyed this tutorial. If you wish to get started with 11ty, then I encourage you to start here.

Philip Borenstein, ["Working with Collections"](https://www.pborenstein.com/posts/collections/). Clear, simple, concise.
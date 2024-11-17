---
title: "Losing time to Faraday"
date: 2013-11-17
tags: []
---
I just wanted an HTTP client.

I asked my Twitter community which HTTP client to use. Certainly not [HTTParty](https://github.com/jnunemaker/httparty), because cool people don't use [HTTParty](https://github.com/jnunemaker/httparty) anymore. One takes these risks when one falls out of the loop with the latest and greatest tools.

"Use [Faraday](https://github.com/lostisland/faraday)", they said. "It's the best", they said.

Everything went fine until I needed to follow a redirect. What happened from that point forward could form the basis of a solid one-act play. I'll spare you the horror and send you directly to the punch line.

> `connection.adapter Faraday.default_adapter`

<!-- more -->

## When Is A Default Not Really A Default?

When you use middleware with Faraday. Specifically when you use `FaradayMiddleware::FollowRedirects` to follow redirects with Faraday.

I tried to read the documentation. Honestly. I read [Stack Overflow](https://stackoverflow.com/questions/13258068/work-around-rubys-broken-uri-parse-follow-redirects). I read the [Faraday Middleware wiki](https://github.com/lostisland/faraday_middleware/wiki). I even read the [source](https://github.com/lostisland/faraday_middleware/blob/master/lib/faraday_middleware/response/follow_redirects.rb). Nothing seemed to warn me about this "default adapter" business, and given the name "default", shouldn't it&mdash;you know&mdash;be the default?!

> Remember: [ask why, but never answer](https://link.jbrains.ca/qVNty9)

I looked through [Faraday Middleware's issues](https://github.com/lostisland/faraday_middleware/issues) and found evidence that other people had successfully followed redirects with `FaradayMiddleware::FollowRedirects`, and so I concluded that I'd done something wrong. I looked for any issue that related to redirects for a clue. I ended up reading [an issue](https://github.com/lostisland/faraday_middleware/issues/75) that suggested the possibility of following redirects depending on more details in the original request: follow redirects for this path info, but not that path info, for example.

Something caught my eye.

<blockquote>
<p>Consider the following code slightly adapted from the readme:</p>

```ruby
connection = Faraday.new 'https://example.com/api' do |conn|
  conn.use FaradayMiddleware::FollowRedirects, limit: 5
  conn.adapter Faraday.default_adapter
end
```

<p>Every request will follow redirects based on the configuration above.</p>

<p style="text-align: right">&ndash;<a href="https://github.com/Zorbash">Dimitrios Zorbas</a></p>
</blockquote>

*What the hell is this default adapter business?!* I wondered.

Then I tried it.

Then it worked.

Then I tweeted something.

Then my wife found some calming Dylan Moran comedy[^calming-dylan-moran-comedy] and I felt better.

Of course, *now that I know what to look for*, I find [the exact issue that I've just run into](https://github.com/lostisland/faraday_middleware/issues/32)&mdash;and it's **TWO YEARS OLD** as of the time I write these words.

In that issue, [Mislav Marohni&#263;](https://github.com/mislav) helpfully points the problem out and suggests following an issue that no longer exists to receive notification when this curious behavior changes. Fortunately, I could easily track down the issue he *means*, as the project has since moved. He means [this issue](https://github.com/lostisland/faraday/issues/121). I've started following it, and now so can you, in case you want to know when you can safely ignore the dreaded `default_adapter`.

[^calming-dylan-moran-comedy]: You don't know Dylan Moran?! [Start here](https://www.youtube.com/watch?v=wDIiPIJmXcE).

## What Does This All Mean?!

It means that if you have this:

```
def http_get(base, uri)
  Faraday.get(base + uri)
end
```

and you want to refactor it to add middleware, **you absolutely positively must write this**:

```
def http_get(base, uri)
  Faraday.new(base) { | connection |
    # IMPORTANT Without this line, nothing will happen.
    connection.adapter Faraday.default_adapter
  }.get(uri)
end
```

If you forget to specify the `adapter`, then you have not refactored. I hope this helps.

## But Wait! There's More!

I really loved [*The Pragmatic Programmer*](https://link.jbrains.ca/WNg8Se), and will probably always remember its section on "programming by coincidence" or, as I like to call it, *programming by accident*. One brand of programming by accident involves moving statements around until they work. This relates to *temporal coupling*, the extent to which statements depend not just on each other, but on the sequence in which they occur. Some temporal coupling makes perfect sense:

```
list = []
list << "hello"
list.empty? => false
```

Rearrange these statements and they say something fundamentally different. This temporal coupling seems quite reasonable to me.

Accidental[^essential-accidental] temporal coupling, however, creates problems for everyone, except possibly the programmer who created the accidental temporal coupling. *Of course*, I had to find out whether this code exhibits accidental temporal coupling. It does.

[^essential-accidental]: As in Fred Brooks and his distinction between essential complication and accidental complication in his classic essay, "No Silver Bullet". Read more about this distinction in ["The Eternal Struggle Between Business and Programmers"](/permalink/the-eternal-struggle-between-business-and-programmers).

```
def http_get(base, uri)
  Faraday.new(base) { | connection |
    # IMPORTANT Without this line AT THE END OF THIS BLOCK, nothing will happen.
    connection.adapter Faraday.default_adapter
  }.get(uri)
end
```

It behooves me, the programmer, to introduce this:

```
def faraday_with_default_adapter(base, &block)
  Faraday.new(base) { | connection |
    yield connection

    # IMPORTANT Without this line, nothing will happen.
    connection.adapter Faraday.default_adapter
  }
end
```

which I can use like this:

```
def http_get(base, uri)
  faraday_with_default_adapter(base) { | connection |
    connection.use FaradayMiddleware::FollowRedirects, limit: 1
  }.get(uri)
end
```

Thus I program *deliberately*.

It behooves me more, even, to contribute this back to [Faraday](https://github.com/lostisland/faraday). I'm tired. I'll do it later.


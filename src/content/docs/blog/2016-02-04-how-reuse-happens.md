---
title: "How Reuse Happens"
date: 2016-02-04 11:45 -0400
tags:
  - Dependency Inversion Principle (DIP)
summary: >
    Reuse is not a myth; you can choose to make code reusable. If you try to test it, you'll feel
    positive pressure to make it reusable, anyway. If you want to test `private` code, then you
    already feel this pressure. Go with it.
---
I often hear this: _Why should we extract this code? We only use it in one place. It doesn't make sense to extract it._ And yet, that same person wants to write tests for `private` (or otherwise invisible) behavior. That person is only hurting themselves: they want to treat this code like a separate thing (because they want to test it), but they resist extracting it because "it doesn't feel right". I have safely extracted numerous mini-frameworks and mini-libraries and my only regret remains that I couldn't easily have used someone else's library for this in the first place. (How many times to we need to reimplement processing command line arguments? Mapping data from Java to SQL? Processing HTTP request headers? Hasn't someone solved these already?)

If you want reuse, you have to make it happen. Fortunately, you don't need to be psychic; it's enough to start by removing duplication, which makes opportunities for reuse easier to spot. Let me show you an example from code I'm working on to generate Nginx server block configurations I need to support some pretty URLs.

<aside>

Since I wrote this article, I have begun retiring my Typeform forms, so if there are any broken links here to a Typeform form, then that's to be expected. Please don't report those.

</aside>

I have some Typeform forms that I like to expose to the world with simpler addresses than Typeform generates by default. For example, if you want to ask me a question, you don't visit [https://jbrains.typeform.com/to/RBZyN6](https://jbrains.typeform.com/to/RBZyN6) when you could instead simply go to [https://ask.jbrains.ca](https://ask.jbrains.ca). I'm porting these redirect rules from Apache to Nginx and since I'm not under pressure to get it working _right now_, I can take time to remove duplication. I'm using Erubis to generate the Nginx server block configurations from a template.

When it came time to glue the pieces together, I reached the following code.

```{caption="generate_nginx_server_blocks_for_subdomain_redirects.rb"}
$LOAD_PATH.unshift(File.expand_path(File.join(File.dirname(__FILE__), "lib")))

require 'simple_subdomain_redirect'

nginx_http_server_configuration_path = ARGV[0] || "."

simple_subdomain_typeform_redirect_rules = {
  "ask" => "RBZyN6",
  "tell" => "dPumsI",
  "sign-up" => "rpvXwR",
  "whatwouldthatgiveyou" => "Z5URkO",
  "book-training" => "ljJ9Np",
  "get-me-out-of-this-job" => "xmQEzU",
  "invite" => "lwP9Kx"
}.map { |k, v|
  ["#{k}.jbrains.ca", "https://jbrains.typeform.com/to/#{v}"]
}.to_h

# Collect all the rules here
simple_subdomain_redirect_rules = simple_subdomain_typeform_redirect_rules

simple_subdomain_redirect_rules.map { |k, v|
  [k, SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")]
}.to_h
.map { |k, v|
  File.open(File.expand_path(File.join(nginx_http_server_configuration_path, "redirect-#{k}.conf")), "w") do |f|
    f.write(v)
  end
}
```

<aside markdown="1">
Please ignore for now that this code [fiddles directly with the Ruby load path]({% link _posts/2016-01-12-relative-include-paths-and-the-slow-certain-march-towards-legacy-code.md %}) and [very sloppily handles command-line parameters](https://github.com/ManageIQ/trollop). I have those issues on my backlog; I'll get to them.
</aside>

If you scan this code, you'll notice some duplication. (Sure, there's only two copies, but I can very clearly envision wanting to do this more than twice, and like I said, I have time to try this kind of thing.)

```
{
  "ask" => "RBZyN6",
  "tell" => "dPumsI",
  "sign-up" => "rpvXwR",
  "whatwouldthatgiveyou" => "Z5URkO",
  "book-training" => "ljJ9Np",
  "get-me-out-of-this-job" => "xmQEzU",
  "invite" => "lwP9Kx"
}.map { |k, v|
  ["#{k}.jbrains.ca", "https://jbrains.typeform.com/to/#{v}"]
}.to_h
```

and

```
simple_subdomain_redirect_rules.map { |k, v|
  [k, SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")]
}.to_h
.map { |k, v|
  File.open(File.expand_path(File.join(nginx_http_server_configuration_path, "redirect-#{k}.conf")), "w") do |f|
    f.write(v)
  end
}
```

I notice the pattern of creating a Hash from another Hash by first converting to an Array of key-value pairs, then back to a Hash.

I also notice that I'm doing this in order to apply some little transformation to each key-value pair&mdash;otherwise, why would I bother?

## What Changes? What Stays the Same?

When I start to notice similarity in code, I look for what differs and what doesn't, then look to separate the differences from the identical parts. In this case, we have a tiny Template Method:

1. iterate over the Hash entries.
2. transform the key and value into a two-element Array.
3. collect the transformed entries into a new Array (of two-element Arrays).
4. turn the Array back into a Hash.

As with any Template Method, the individual steps might differ, although the overall algorithm remains the same. In this specific case, the step "transform the key and value into a two-element Array" seems like a sensible point of variation. It seems reasonable to model this transformation as two one-argument functions, transforming the key and value respectively (and separately).

Now, since "transform" is a very generic word, I look for a more concrete name for this operation. I don't like it _much_ more, but I settle on "patch" for now. This leads me to want to extract a function called `patch_keys_and_values()` that operates on a `Hash` and takes two functions, the first one patches the keys and the second one patches the values.

```
# Turns hash into a new hash after applying patch_key() to each key
# and patch_value() to each value.
def patch_keys_and_values(hash, patch_key, patch_value)
  return hash.map { |k, v|
    patch_key.call(k), patch_value.call(v)
  }.to_h
end
```

This function is very abstract; it cares nothing at all about the details of the keys, values, or the hash. I mark its reuse level with a comment.

```
# REUSE Library for Hash or data structure operations.
```

This seems so abstract, generic, and reusable that surely someone has thought of this and implemented it before, so I ask the Ruby community whether something like this already exists. If not, then I simply wait until I have a handful of similar functions, then extract them to a library and release it as a gem. Of course, I'd better test it really well.

## Premature Generalization?

Sadly, I can't use this function for the second copy of the pattern, since its "new value" combines information from both the old key and the old value.

```
simple_subdomain_redirect_rules.map { |k, v|
  [k, SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")]
}.to_h
```

Fortunately, although this changes the Template Method, it does so very little: it only changes the shape of the "transform" step. Actually... it doesn't even do that; it merely violates a small design choice I made, namely to transform the key and value separately from one another with two different functions. I can easily change that to a single function that turns a key-value pair into another key-value pair without disturbing the Template Method. It amounts to a tiny change. For now, I extract a second function, to see how the two compare, rather than changing the first one.

```
# REUSE Library for Hash or data structure operations.
# Turns hash into a new hash after applying patch_entry()
# to each entry, returning a new key, value pair.
# patch_entry : (key -> value) -> [new_key, new_value]
def patch_entries(hash, patch_entry)
  hash.map { |k, v| patch_entry.call(k, v) }.to_h
end
```

This shows the same level of reuse as the other function, so these two would go together in a new library.

I briefly consider destroying the transform-the-key-and-value-separately version and use the transform-the-key-value-pair-together version for both cases. I can see value in both, so I keep them both until the more specific one starts to annoy me.

## Avoiding Duplication

I can also find some potentially-reusable stuff just by imagining duplication and extracting it.[^experience] This means avoiding duplication, rather than removing it. I consider this riskier, because it leads to potentially premature optimization, but I can justify it (somewhat) on the grounds of improving names. The anonymous functions here stand out, because I can see their intent (for the moment, it's fresh in my mind), but the code doesn't express that intent.

<aside markdown="1">
Some anonymous functions express their intent quite clearly, such as something like `->(person) { person.age }`, so not having a name, on its own, doesn't always present a problem, nor even much of a risk.
</aside>

[^experience]: I would call this _advanced_ or _experienced_ practice. Generally, I recommend against speculating too much about duplication, waiting for three copies to happen, and if you and I were pairing, and you insisted that we not do this, I wouldn't fight you for more than a few seconds this time.

```
simple_subdomain_typeform_redirect_rules = patch_values_and_keys({
  "ask" => "RBZyN6",
  "tell" => "dPumsI",
  "sign-up" => "rpvXwR",
  "whatwouldthatgiveyou" => "Z5URkO",
  "book-training" => "ljJ9Np",
  "get-me-out-of-this-job" => "xmQEzU",
  "invite" => "lwP9Kx"
}, ->(k) {"#{k}.jbrains.ca"}, ->(v) {"https://jbrains.typeform.com/to/#{v}"})
```

Now that I've got some of the plumbing out of the way, I can see the "patch key" and "patch value" functions more clearly. I see that in this case, for "patch key" I really want to "resolve the subdomain within the domain `jbrains.ca`" and for "patch value", I really want to "resolve the Typeform form URL for Typeform user `jbrains`". To give these ideas names, I move them into named functions.

```
def resolve_jbrains_subdomain(subdomain)
  "#{subdomain}.jbrains.ca"
end

def jbrains_typeform_url(form_id)
  "https://jbrains.typeform.com/to/#{form_id}"
end
```

Don't stop here! I can make these functions reusable by avoiding duplication (really removing latent duplication) and removing the dependency on the detailed values `jbrains.ca` and `jbrains`, respectively. (When I extract cohesive details like this&mdash;both values are related to `jbrains`&mdash;I feel like I've got on a good track.)

```
# REUSE HTTP/DNS library
def resolve_subdomain(domain)
  ->(subdomain) {
    "#{subdomain}.#{domain}"
  }
end

# REUSE Typeform integration library
def typeform_url(user_id)
  ->(form_id) {
    "https://#{user_id}.typeform.com/to/#{form_id}"
  }
end
```

I like writing them this way to make it clearer that I intend to use them as factories for the functions that I'll pass to `patch_keys_and_values()`, but I think of them as two-argument functions that I intend to curry in order to pass to `patch_keys_and_values()` as one-argument functions. At a minimum, I've clarified the intent of the client of this code.

```
simple_subdomain_typeform_redirect_rules = patch_values_and_keys({
    "ask" => "RBZyN6",
    "tell" => "dPumsI",
    "sign-up" => "rpvXwR",
    "whatwouldthatgiveyou" => "Z5URkO",
    "book-training" => "ljJ9Np",
    "get-me-out-of-this-job" => "xmQEzU",
    "invite" => "lwP9Kx"
  },
  resolve_subdomain("jbrains.ca"),
  typeform_url("jbrains"))
```

I couldn't quickly figure out how to curry the two-argument functions in Ruby, so I asked Twitter, then moved on. (Currying lambdas? Easy. Currying Proc objects? Easy. Currying named functions? Not so much. [Do you know how to do it?](https://tell.jbrains.ca))

## Reuse Opportunities Abound!

So in just this little bit of code I've extracted four bits of reusable code, three of which (I argue) are quite widely-reusable and the fourth of which (the Typeform one) perhaps has narrower potential for reuse. Even so, we don't get reuse if we don't look for potentially-reusable code and take one or two extra steps to make it reusable.

Of course, you don't need clairvoyance. Simply follow the [Simple Design Dynamo](#references) and look either for duplication or for code that combines details from too many concepts at once (seemingly-unrelated names close together), then separate the families of concepts from each other. In my case, I saw:

- Duplication in the pattern of `hash.map { |k, v| [...make new key.., ...make new value...] }.to_h`.
- Different details too close together: pasting together subdomain and domain close to turning a Typeform form ID into the form URL.
- The detailed part of those two details (`jbrains.ca` and `jbrains`) happen to be quite similar, and so it might be nice to put them together somehow.

I can think of the second of these as potential duplication: at some point, it might be nice not to assume that the domain is `jbrains.ca` and that the Typeform form URL starts with `jbrains.typeform.com`.

Looking at the resulting code, all the data relates to the details of "jbrains"-ness: the redirect rules, the fact that my domain is `jbrains.ca`, and the fact that my Typeform user ID is `jbrains`. All the generic details, like resolving subdomains in a domain and resolve the URL of a Typeform form (in general), are hidden in code. This illustrates the [Pragmatic Programmer](#references) principle "Abstractions in code; details in metadata", and provides yet another example of how following the Simple Design Dynamo can nudge the programmer towards a higher-level, well-respected, generally-helpful design principle.

Nice, no?

## References

J. B. Rainsberger, ["Putting An Age-Old Battle To Rest"]({% link _posts/2013-12-05-putting-an-age-old-battle-to-rest.md %}). A description of the Simple Design Dynamo, which builds on Kent Beck's pioneering description of the Four Elements of Simple Design.

Andrew Hunt and Dave Thomas, [_The Pragmatic Programmer: From Journeyman to Master_](https://link.jbrains.ca/WNg8Se). Still one of those classics that demands a place on every programmer's bookshelf.

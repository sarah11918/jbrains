---
title: "A Tiny Cohesion Risk"
date: 2016-02-10 11:58 -0400
---
Today I'd like to share an example of a tiny cohesion risk. I leave it to you to evaluate the severity of the risk and the appropriateness of the refactoring. I like to deal with risks when they are small enough that their impact, while painful, probably won't kill.

![What a cute design risk!](//images.jbrains.ca/playful-tiger-cub.jpg)

Let's start with the code here:

```{caption="Write the subdomain redirect rules to files"}
patch_entries(simple_subdomain_redirect_rules,
  ->(k, v) { [k, SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")] })
.map { |k, v|
  File.open(File.expand_path(File.join(nginx_http_server_configuration_path, "redirect-#{k}.conf")), "w") do |f|
    f.write(v)
  end
}
```

This code writes an Nginx server block configuration of each of my _simple subdomain redirect rules_ to its own file. I've extracted the operation "patch entries" to its own function, which turns a Hash into a new Hash by transforming all the entries with the provided function.

<aside markdown="1">
I need this because `map()` turns a Hash into an Array of two-element Arrays, rather than into a new Hash.
</aside>

When I wrote this code, I thought of transforming the data this way.

1. Turn the subdomain redirect rules into an Array of Nginx server block configurations.
2. Wait, no. I need a filename for each server block configuration. I'll use the subdomain for part of the filename, so I need the original subdomain back. This means changing just the values of the Hash from target URL to server configuration block.
3. Now that I have a mapping of subdomain to server configuration block, I can turn the subdomain into a file path to which to write the file.

I thought of "generate Nginx server configuration block content" and "generate file path" as separate operations, so I arbitrarily put them in separate operations. Now that I've slept on it and come back to this code, I want to change that decision.

## Judging Cohesion

I don't mean judging the importance of cohesion, but rather what seems more cohesive. I see two alternatives.

1. Leave the code as it is, with file operations together, but separated from the _generate the Nginx server configuration block_ operation.
2. Move the _generate filename_ operation together with the _generate the Nginx server configuration block_ operation in the first `map()` call.

On the one hand, file operations together seem cohesive; on the other hand, it seems like generating a filename from a subdomain is quite specific to my current situation, whereas writing content to a file is very abstract, which I'd prefer to extract to its own function. Each options seems highly cohesive in its own way, so why does my intuition favor the second option over the first?

## DIP To the Rescue

Once again, the [dependency inversion principle](#references) helps break the apparent tie. In this case, it encourages me to move details up the call stack. "Write this stuff to a file" is quite generic, but "choose a filename _based on the subdomain_" is quite detailed, so I move the latter up the call stack towards the client. This idea leads me to propose a new guideline.

<p class="guideline">When in doubt, choose domain cohesion over layer cohesion.</p>

In other words, gathering all the file-related operations in one place might help, but gathering all the domain concepts in one place might help more. I say "might", because although it feels sensible, I haven't done it enough to proclaim it confidently from the rooftops. I'll have to try it out for a while and see what happens.

## The Resulting Code

```{caption="Domain cohesion over technology cohesion"}
patch_entries(simple_subdomain_redirect_rules,
  ->(k, v) {
    [File.expand_path(File.join(nginx_http_server_configuration_path, "redirect-#{k}.conf")),
    SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")]})
.map { |k, v|
  File.open(k, "w") do |f|
    f.write(v)
  end
}
```

Now I can think of the data transformation more simply as _turn the subdomain rules into a dictionary mapping the filename to the content to write to the file_. This version of the design "strips away the context" earlier, resulting in more generic code that's easier to get right and smaller, more self-contained, reusable pieces that are easier to compose.

For example, now I can clearly see value in extracting a function for "write this text to that file path", making this code even easier to understand.

```{caption="Better isolated"}
# REUSE Text File library
def write_text_to_file(file_path, text)
  File.open(file_path, "w") do |f|
    f.write(text)
  end
end

patch_entries(simple_subdomain_redirect_rules,
  ->(k, v) {
    [File.expand_path(File.join(nginx_http_server_configuration_path, "redirect-#{k}.conf")),
    SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")]})
.map { |file_path, server_block_configuration_text|
  write_text_to_file(file_path, server_block_configuration_text)
}
```

Now that I've forced myself to articulate this previously-anonymous and detailed lambda, I search the web for "write text file ruby" and discover that this library function already exists. Of course it did! They use `File.write()`.

```
patch_entries(simple_subdomain_redirect_rules,
  ->(k, v) {
    [File.expand_path(File.join(nginx_http_server_configuration_path, "redirect-#{k}.conf")),
    SimpleSubdomainRedirect.new(k, v).to_nginx_server_block_configuration("/home/nginx/servers")]})
.map { |file_path, server_block_configuration_text|
  File.write(file_path, server_block_configuration_text)
}
```

I would strongly prefer to use _eta-reduction_ on `File.write()` and write something like `hash.map(File::write)`, but that doesn't seem to work the way I expect. If you can suggest how to write that block more concisely, [please tell me](https://tell.jbrains.ca).

Now, if I want, I can extract the more-detailed code into little functions in order to make this chain of operations even clearer.

```
# REUSE Library for higher-order functions
# REFACTOR Clojure calls this "juxt"
# and extends it to n functions with the same argument list
# NOTE argument lists must match among the functions!
# f : (args...) -> c
# g : (args...) -> d
# foo : (args...) -> [c, d]
def juxtapose_two_functions(f, g)
  ->(*args) { [f.(*args), g.(*args)] }
end

patch_entries(simple_subdomain_redirect_rules,
  juxtapose_two_functions(
    nginx_http_server_block_configuration_path_for(nginx_http_server_configuration_directory),
    nginx_http_server_block_configuration_for(nginx_servers_directory)
  )
).map { |file_path, server_block_configuration_text|
  File.write(file_path, server_block_configuration_text)
}
```

I feel in this case like "juxtapose two functions" takes away some of the clarity of the code, but that might reflect my unfamiliarity with the concept more than the name I've applied. At a minimum, most of the plumbing has disappeared into the background and we're left with the following.

<div class="explanation" markdown="1">
Patch the "simple subdomain redirect rules" by replacing the keys with the Nginx HTTP server block configuration path for each subdomain and by replacing the values with the Nginx HTTP server block configuration based on where I've decided to put the Nginx servers. Then write each configuration to its file path. The end.
</div>

This sounds reasonable to me, at least if I give myself a chance to get used to "juxtapose two functions". Maybe I can improve the name by calling it `patch_entry()`.

```
# REUSE Library for Hash or data structure operations.
# patch_key : (key -> value) -> new_key
# patch_value : (key -> value) -> new_value
def patch_entry_with(patch_key, patch_value)
  juxtapose_two_functions(patch_key, patch_value)
end

 patch_entries(simple_subdomain_redirect_rules,
  patch_entry_with(
    nginx_http_server_block_configuration_path_for(nginx_http_server_configuration_directory),
    nginx_http_server_block_configuration_for(nginx_servers_directory)
  )
).map { |file_path, server_block_configuration_text|
  File.write(file_path, server_block_configuration_text)
}
```

I prefer the way this code reveals its intent, and hides most of the plumbing. If I could pass `File.write()` as a parameter directly to `Hash.map()`, then that would eliminate the last bit of plumbing; however, Ruby doesn't seem to allow that. (I'd have to convert the file path and content to a single argument, which I think would obscure the intent rather than reveal more of it.)

## More Reuse! Clearer Intent! Better Cohesion!

In the process of improving the cohesion (I firmly believe) of this code, I have introduced some additional reusable, recombinable elements, including `juxtapose_two_functions()` and `patch_entry()`. I can even see how to extend `juxtapose_two_functions()` into a general-purpose `juxtapose_functions()`.

I also find the intent easier to grasp, with the details safely hidden inside functions with intention-revealing names, like `patch_entry_with()`, `nginx_http_server_block_configuration_path_for()`, and `nginx_http_server_block_configuration_for()`. Not only do the names better point to the related concepts, but the absence of details makes the key points stand out more prominently.

In addition, the remaining code seems highly cohesive: it concentrates the Nginx-related code in one place, separating it from the generic Hash-related and File-related code. Similar things are closer together and different things are farther apart. Less risk of changing the wrong thing at the wrong time.

Sometimes it only takes moving a single concept from one part of the code to another to start a chain reaction of refactorings that clarifies the whole thing, so **don't be afraid to set the timer for 30 minutes and just try refactoring!** In the worst case, after 30 minutes, you type

```
$ git reset --hard HEAD
$ git clean --force
```

and pretend it never happened.

## References

J. B. Rainsberger, ["Demystifying the Dependency Inversion Principle"]({% link _posts/2013-01-29-consequences-of-dependency-inversion-principle.md %}). A place to start reading about the Dependency Inversion Principle. You can find more articles by [clicking here](https://duckduckgo.com/?q=site%3Ablog.thecodewhisperer.com+dependency+inversion+principle).

---
title: "No More Boilerplate Code"
date: 2016-10-09
tags:
  - "Simple Design"
  - Dependency Inversion Principle (DIP)
excerpt: We have standard workflows in our systems that programmers copy and paste from module to module in order to achieve some kind of standard behavior. Programmers call this <em>boilerplate</em>. If they extract the standard workflow from the boilerplate, then the copy/paste risk goes away, it becomes easier to gain confidence in the code, and everyone wins.
---
The name **template method** is a perfect example of a structural name: it describes the implementation rather than the meaning or purpose. This is what happens when programmers name things.

## The Problem

We have standard workflows in our systems that programmers copy and paste from module to module in order to achieve some kind of standard behavior. Programmers call this _boilerplate_. Programmers tend to copy and paste this code because —

+ They don't see the duplication, because usually not much code is duplicated.
+ Even if they see the duplication, they don't know how to remove the duplication, because they can't just highlight code and hit "Extract Method" in their refactoring tool.

Functional programmers tend to notice this duplication better than object-oriented programmers, because they more easily think of functions as potential parameters to a block of code.

## A Solution

To extract the standard workflow, identity the steps, extract each of them into a function, leaving behind the workflow (or _template_). Once the duplication in the workflow becomes obvious, extract a function whose parameters are the steps. You can now add similar features by combining the standard workflow with newly-implemented steps.

## An Example

There is a standard workflow for executing a query on an SQL database in Java:

1. Start with a Data Source.
2. Ask the Data Source for a Connection.
3. Ask the Connection for a Prepared Statement.
      1. Tell the Prepared Statement about the query that you wish to execute:
      2. `select * from products where products.id = ?`
4. For the parameter placeholder, use the ID `17923`.
5. Ask the Prepared Statement to execute the query, which returns a Result Set.
6. We expect exactly one row, because our SQL statement filters on a primary key column, so if there is no row in the result set, then return an answer that represents "no product". (Null Object? null reference? Exception? You decide.) The rest of the way, we can assume that there is at least one row.
7. Ask the Result Set to advance to the first row.
8. Ask the Result Set (now pointing to the first row) for the values of the various columns and use that information to create a Product object.
9. Ask the Result Set to advance to the next row. If you find a next row, then throw an Exception communicating "We found too many rows, and that's weird, because we thought we were finding rows by a primary key, and there should be just one matching row. The table in question is `products`, which is probably missing a uniqueness constraint. Check the DDL. Good luck." The rest of the way, we can assume that there is exactly one row.
10. Now that we have our Product object, we need to clean up:
     1. Close the Result Set, and if anything goes wrong, signal a warning about it, but keep going, because there's nothing we can do about it now.
     2. Close the Prepared Statement, and if anything goes wrong, signal a warning about it, but keep going, because there's nothing we can do about it now.
     3. Close the Connection, and if anything goes wrong, signal a warning about it, but keep going, because there's nothing we can do about it now.
11. Return the Product as our final answer.

I call most of this "JDBC noise", because, well, that's what it is. It's a noisy API. I don't consider this a problem, but rather just a fact: in order to add flexibility, we have to add noise. I don't know how to do it any other way. Sadly, however, most people do the same things the same way all the time… _almost_.

### Some Problems With This Code

**Some programmers are very optimistic** and don't protect against the situation where a primary key query — more correctly, _what they believed was a primary key query_ — matches multiple rows. _It should never happen_, but it might happen, and we should probably do better than merely matching the row that the database happens to put first in the list. If we think we're running a primary key query and the database finds multiple matching rows, _that's a mistake somewhere_, and we need to detect the mistake so that we can fix it. It's probably a simple typo in the DDL, but it could damage production data. I'd prefer to be able to detect this problem in the standard workflow, because _if we check it in some places and not others, then we either waste a lot of energy duplicating defensive code (and rememering to duplicate defensive code and complaining about duplicating defensive code) or we waste a lot of energy under pressure assuming that this situation can't happen and then wondering how the hell it's happening now, at 3 AM, when I'm supposed to be sleeping on vacation. I had a long day of relaxing on the beach planned!_

**Some programmers are inexperienced** and don't close their result sets, statements, and connections, and this leaks resources. This slows down the application and encourages other, more experienced programmers to show how clever they are about performance optimization. This leads to wasting energy trying to understand clever code instead of relaxing on the beach.

### The Main Difficulty With This Code

Many programmers just assume that they have to copy and paste the JDBC noise throughout their system because:

+ The duplicated code is interspersed with the unique code, so how do we tear these two things apart? I can see how to pass the SQL query as a parameter, because it's just a String, but what about the rest?
+ The unique steps look really different: the way to turn an SQL Result Set row into a Product differs a lot from turning a row into a Customer or an Order or any of the other 26 domain objects we have.
+ Even the return type of the function depends on the domain object type! How do we even create a standard type signature?

Some programmers see how to deal with these difficulties and others don't. In this particular case, the programmer needs to see different kinds of duplication, know how to make similar code even more similar, and then see how to remove the duplication. Not everyone knows how to do this. Fortunately, everyone can learn.

## The General Algorithm

1. Find similar blocks of code or functions and look at them all together.
2. Identify the identical steps, the similar steps, and the different steps. (There might not be steps in all three categories.) The identical steps are identical code; the similar steps differ only in data parameters; the different steps look, well, different.
3. Extract functions for the identical steps. If you're extracting _methods_, then it's possible for the identical steps to operate only on fields of the object and not need any extra parameters. If there are several identical steps in succession and they obviously belong together, then don't bother separating them just yet. (You might do this later.)
4. Extract functions for the similar steps. Even if you're extracting _methods_, it's likely that these functions require parameters for the data that differs among the original functions. In our database example, the SQL query is different for each query, even though the general shape of `select * from <table> where <id> = ?` is the same for each one. (There's a clue.)
5. Extract functions for the different steps. With any luck, the functions that you extract will all have an identical shape. With less luck, they'll have similar shape, such as having the same input parameters, but a different return type. If they have drastically different shapes, then we have to use a trick that I'll describe later.
6. After extracting functions for the various steps — the _steps_ of the workflow — you should have left behind very similar workflows in the original blocks of code. You might have chosen identical names or, at worst, similar names. You should be able to see an obvious pattern in the names of the steps. Take some time to make the pattern more obvious, such as by renaming the steps to follow a common naming scheme.

## Identical Steps in Our Example

I have highlighted the identical steps in our example. They correspond to literally identical lines of code.

1. **Start with a Data Source.**
2. **Ask the Data Source for a Connection.**
3. **Ask the Connection for a Prepared Statement.**
4. Tell the Prepared Statement about the query that you wish to execute:
     1. `select * from products where products.id = ?`
     2. For the parameter placeholder, use the ID `17923`.
5. **Ask the Prepared Statement to execute the query, which returns a Result Set.**
6. We expect exactly one row, because our SQL statement filters on a primary key column, so if there is no row in the result set, then return an answer that represents "no product". (Null Object? null reference? Exception? You decide.) The rest of the way, we can assume that there is at least one row.
7. **Ask the Result Set to advance to the first row.**
8. Ask the Result Set (now pointing to the first row) for the values of the various columns and use that information to create a Product object.
9. **Ask the Result Set to advance to the next row. If you find a next row, then throw an Exception communicating "We found too many rows, and that's weird, because we thought we were finding rows by a primary key, and there should be just one matching row. The table in question is `products`, which is probably missing a uniqueness constraint. Check the DDL. Good luck." The rest of the way, we can assume that there is exactly one row.**
10. Now that we have our Product object, we need to clean up:
     1. **Close the Result Set, and if anything goes wrong, signal a warning about it, but keep going, because there's nothing we can do about it now.**
     2. **Close the Prepared Statement, and if anything goes wrong, signal a warning about it, but keep going, because there's nothing we can do about it now.**
     3. **Close the Connection, and if anything goes wrong, signal a warning about it, but keep going, because there's nothing we can do about it now.**
11. Return the Product as our final answer.

Where there are multiple identical steps in succession, I can summarize the steps (hide the identical sections) to make the remaining differences stand out better.

1. **Start with a Data Source.**
2. **Transform the Data Source into a Prepared Statement.**
3. Tell the Prepared Statement about the query that you wish to execute:
     1. `select * from products where products.id = ?`
     2. For the parameter placeholder, use the ID `17923`.
4. **Ask the Prepared Statement to execute the query, which returns a Result Set.**
5. We expect exactly one row, because our SQL statement filters on a primary key column, so if there is no row in the result set, then return an answer that represents "no product". (Null Object? null reference? Exception? You decide.) The rest of the way, we can assume that there is at least one row.
6. **Ask the Result Set to advance to the first row.**
7. Ask the Result Set (now pointing to the first row) for the values of the various columns and use that information to create a Product object.
8. **Ask the Result Set to advance to the next row. If you find a next row, then throw an Exception communicating "We found too many rows, and that's weird, because we thought we were finding rows by a primary key, and there should be just one matching row. The table in question is `products`, which is probably missing a uniqueness constraint. Check the DDL. Good luck." The rest of the way, we can assume that there is exactly one row.**
9. Now that we have our Product object, **clean up the opened resources**.
10. Return the Product as our final answer.

You'll notice that in summarizing the identical steps, we have almost perfect alternation between identical steps and not-identical steps. This almost always happens, and so I interpret it as a sign that I have hidden the identical parts effectively.

## Similar Parts in Our Example

Now I look at the similar parts, which would be identical if it weren't for differences in data. I have highlighted the similarities and left the differences alone.

1. **Start with a Data Source.**
2. **Transform the Data Source into a Prepared Statement.**
3. _Tell the Prepared Statement about the query that you wish to execute_:
     1. `select * from products where products.id = ?`
     2. For the parameter placeholder, use the ID `17923`.
4. **Ask the Prepared Statement to execute the query, which returns a Result Set.**
5. <em>We expect exactly one row, because our SQL statement filters on a primary key column, so if there is no row in the result set, then return an answer that represents "no</em> product<em>". (Null Object? null reference? Exception? You decide.) The rest of the way, we can assume that there is at least one row.</em>
6. **Ask the Result Set to advance to the first row.**
7. _Ask the Result Set (now pointing to the first row) for the values of the various columns and use that information to create a_ Product _object_.
8. **Ask the Result Set to advance to the next row. If you find a next row, then throw an Exception communicating "We found too many rows, and that's weird, because we thought we were finding rows by a primary key, and there should be just one matching row. The table in question is `products`, which is probably missing a uniqueness constraint. Check the DDL. Good luck." The rest of the way, we can assume that there is exactly one row.**
9. _Now that we have our_ Product _object_, **clean up the opened resources**.
10. _Return the_ Product _as our final answer_.


We can summarize the differences this way:

+ The SQL query text differs. (We'll ignore for now the similarity in the structure of the SQL query.)
+ The values of the SQL query parameter placeholders differ.
+ The type of domain object we're looking for differs.
+ The way that we turn a Result Set row into a domain object differs.

Notice that I could summarize the differences without making a reference to the concrete differences themselves. (I never wrote "Product" or "product ID" or "the table `products`"). This means that I understand the differences enough to be able to turn similar code into identical code.

## Turning Similar Code into Identical Code

If you have two blocks of code with differing values, then you can simply extract the values, leaving behind parameters, and that turns similar code into identical code.

For the SQL query text, we can simply make that a parameter.

1. **Start with a Data Source and the text of an SQL query that describes a "find, expecting a single match" scenario.**
2. ...
3. _Tell the Prepared Statement about the query that you wish to execute_:
     1. _Use the SQL query provided to this function as the prepared statement query text_.
     2. For the parameter placeholder, use the ID `17923`.
4. ...continue as before.


Sometimes the differences don't have exactly the same shape, but we can make them have the same shape by thinking of what they have in common. We do this with the SQL statement parameters, because perhaps the number and type of parameters changes from statement to statement. We can use the _universal trick_ of naming the values, then putting the names and values into a lookup table. This means changing the SQL query to use named parameter placeholders instead of positional parameter placeholders — and even that _really_ just makes the whole thing easier to understand and harder to get wrong.

We change our query details from this:

+ `select * from products where products.id = ?`
+ `17923`

to this:

+ `select * from products where products.id = :product_id`
+ `{ :product_id => 17923 }`

Now, the way we turn "find a single row query details" into a Prepared Statement is the same for any SQL query that expects to find a single row. We just have a few rules about "find a single row query details" —

1. The _query text_ uses named placeholders for the parameters.
2. The _query parameters_ has an entry for each placeholder, and the keys of the query parameters match the names of the placeholders in the query text. The types of the values of the query parameters match the expected types of the placeholders in the query text. (We probably want to document the expected types, since SQL doesn't force us to declare them in the query text itself.)

As long as we follow these rules, our "find a single row query" procedure will work as expected, and now we turn a similar step into an identical step.

1. **Start with a Data Source and an SQL Query Description that describes a "find a single row" query.**
2. ...
3. _Tell the Prepared Statement about the query that you wish to execute_:
     1. _Use the SQL Query Description's query text as the Prepared Statement's query text._
     2. _For each query parameter in the SQL Query Description, tell the Prepared Statement to bind the parameter value to the corresponding parameter name._
4. ...continue as before.

Now that the similar parts are identical, let's mark them as identical.

1. **Start with a Data Source and an SQL Query Description that describes a "find a single row" query.**
2. ...
3. **Tell the Prepared Statement about the query that you wish to execute**:
     1. **Use the SQL Query Description's query text as the Prepared Statement's query text.**
     2. **For each query parameter in the SQL Query Description, tell the Prepared Statement to bind the parameter value to the corresponding parameter name.**
4. ...continue as before.


In this case, since the differences were "only" data (and not code), we can tell the overall procedure to just ask for that data as incoming parameters.

We can do the same thing for all the places where the overall procedure mentions the table name `products` in its exception message. We can pass the table name separately as an incoming parameter, then put a placeholder `<table name>` in the exception message. This turns similar code into identical code.

> **Ask the Result Set to advance to the next row. If you find a next row, then throw an Exception communicating "We found too many rows, and that's weird, because we thought we were finding rows by a primary key, and there should be just one matching row. The table in question is `<table name>`, which is probably missing a uniqueness constraint. Check the DDL. Good luck." The rest of the way, we can assume that there is exactly one row.**

What about differences in code?

## Turning Different Code Into Identical Code

The most difficult step involves turning an SQL Result Set row into a Product… or Customer or Order or whatever, because those steps require fundamentally different code — or do they? We can use another _universal trick_ to turn code into data. You can thank John von Neumann for this.

>  To turn different blocks of code into data, extract the blocks of code into a function with identical (or even similar) signatures, and then hide the differences until they're all gone. What's left is a _common interface_.

In the case of turning an SQL Result Set row into a Product, we have a bunch of code like this —

```java
ResultSet row = ...;
final int id = row.getInt("id");
final String description = row.getString("description");
final int priceInCents = row.getInt("price_in_cents");
final int shippingWeightInKilograms = row.getInt("weight_in_kg");
...
Product product = new Product(id, description, priceInCents, shippingWeightInKilograms, ...);
```

and in the case of turning an SQL Result Set row into a Customer, we have a bunch of code like this —

```java
ResultSet row = ...;
final int id = row.getInt("id");
final String firstName = row.getString("first_name");
final String lastName = row.getString("last_name");
final Date dateOfBirth = row.getDate("date_of_birth");
...
Customer customer = new Customer(id, firstName, lastName, dateOfBirth, ...);
```

Although these blocks of code look wildly different, they both turn a ResultSet into a Thing (where _thing_ is a highly technical term meaning "Something I'm not sure about"). In some languages (Java, C#, C++, Haskell) we can use a generic type placeholder, which we conventionally call `T`. In other languages (which ones?) we either can't do this or don't have to, in which case we can use the universal type that many languages call `Object`. (We used to have to do this in Java, remember? Just me?) With this, we can extract both of these blocks of code into functions of type

```java
public <T> T mapRow(ResultSet row) throws RowMappingException { ... }
```

or, in the worst case

```java
public Object mapRow(ResultSet row) throws RowMappingException { ... }
```

What we do next depends on our programming language. Either we pass the function directly into our overall procedure as a parameter or we create an interface that declares this function as _abstract_ (not implemented) and pass an instance of that interface into our overall procedure as a parameter. In C# we might use a Delegate. In Java we might use a first-class Function or declare an interface called `RowMapping`.

```java
interface SqlRowMapping<DomainObjectType> {
  DomainObjectType mapRow(ResultSet row) throws RowMappingException;
}
```

Since we know something about what `T` represents, there's no reason to call it `T`.

<aside markdown="1">

In some cases, you don't know _anything_ about what `T` represents, such as "a list of things". In this case, a type signature of `List<T>` seems entirely appropriate. Don't just call type parameters `T` in order to blindly follow something that looks like a convention. In type names, `T` is not a convention; instead, **it's a worst-case scenario**.

</aside>

Whew! Now we can pass our "thing that maps a Result Set row into a domain object" into our overall procedure, and turn different code into identical code!

1. **Start with a Data Source, an SQL Query Description that describes a "find a single row" query, and a Transformation that turns an SQL row into a Domain Object whose type matches what the SQL Query Description expects to find.**
2. ...
3. ...
4. ...
5. ...
6. ...
7. **Use the Transformation to turn the Result Set (now pointing to the first row) into a Domain Object.**
8. ...continue as before.


Finally, we change the domain object type in our overall procedure from `Product` to "generic thing". We do this either by using the ancestor object type in our language (`Object`) or by using a type parameter (`T`, which we rename immediately to `DomainObjectType`). Now — at last — we have a single universal procedure, which is our workflow.

1. **Start with a Data Source, an SQL Query Description that describes a "find a single row" query, and a Transformation that turns an SQL row into a Domain Object whose type matches what the SQL Query Description expects to find.**
2. **Transform the Data Source into a Prepared Statement.**
3. **Tell the Prepared Statement about the query that you wish to execute**:
     1. **Use the SQL Query Description's query text as the Prepared Statement's query text.**
     2. **For each query parameter in the SQL Query Description, tell the Prepared Statement to bind the parameter value to the corresponding parameter name.**
4. **Ask the Prepared Statement to execute the query, which returns a Result Set.**
5. **We expect exactly one row, because our SQL statement filters on a primary key column, so if there is no row in the result set, then return an answer that represents "no Domain Object thing". (Null Object? null reference? Exception? You decide.) The rest of the way, we can assume that there is at least one row.**
6. **Ask the Result Set to advance to the first row.**
7. **Use the Transformation to turn the Result Set (now pointing to the first row) into a Domain Object.**
8. **Ask the Result Set to advance to the next row. If you find a next row, then throw an Exception communicating "We found too many rows, and that's weird, because we thought we were finding rows by a primary key, and there should be just one matching row. The table in question is `<table name>`, which is probably missing a uniqueness constraint. Check the DDL. Good luck." The rest of the way, we can assume that there is exactly one row.**
9. **Now that we have our Domain Object, clean up the opened resources**.
10. **Return the Domain Object as our final answer.**


This gives you the workflow. You can now extract this workflow into a separate library function in order to provide standard behavior for the parts that shouldn't change, such as handling errors and cleaning up resources. To use this library function, you only need to specify the differences, which means that you can focus on the important parts of your SQL queries: the table, the columns, how to turn a generic SQL row into a Product, Customer, or Order. You can check these things much more easily in isolation with microtests, rather than forcing yourself to use a database for each of those tests. Most importantly, once you see the pattern in this kind of behavior, you'll start noticing high-level patterns of behavior throughout your system, which leads to less copy/paste and fewer mistakes of the kind "Hey! Why didn't you do it 'the normal way'?!"

That's the point of Template Method or **Extract Workflow**, as I like to call it.

## Hey, Wait… This Isn't a Template Method!

You caught me. It isn't really a Template Method. I don't mind. Fortunately, what I did is _isomorphic_ to a Template Method, which means that there is a mechanical, universal code transformation between Template Methods and Standard Workflows of the type that I've extracted.

The **Template Method pattern** assumes that you want to pull the common steps up into a superclass and push the different (abstract) steps down into a subclass. In such a design, you would have a class for our query that looks something like this —

```java
abstract class FindOneItemQuery<DomainObjectType> {
  public FindOneItemQuery(String sqlQueryTextWithNamedPlaceholders, Map<String, ?> sqlQueryParametersByName, String tableName) {
    // assign parameters to fields
  }

  // Our overall procedure!
  // It returns "maybe a Domain Object".
  // If anything low-level goes wrong, it throws a database-driver-neutral exception.
  public final Optional<DomainObjectType> executeOn(DataSource dataSource) throws DatabaseCommandException;

  public abstract DomainObjectType mapRow(ResultSet row) throws RowMappingException;
}
```

and then you would subclass to provide only the details.

```java
class FindProductByIdQuery extends FindOneItemQuery<Product> {
  public FindProductByIdQuery(int productId) {
    super(
      "select * from products where product.id = :product_id",
      Collections<String, Integer>.singletonMap("product_id", productId),
      "products"
    );
  }

  public Product mapRow(ResultSet row) throws RowMappingException {
    final int id = row.getInt("id");
    final String description = row.getString("description");
    final int priceInCents = row.getInt("price_in_cents");
    final int shippingWeightInKilograms = row.getInt("weight_in_kg");
    ...
    return new Product(...);
  }
}
```

I don't like this option, because of the possibility that `FindProductByIdQuery` becoming tightly coupled to details in `FindOneItemQuery`, making it impossible to test `mapRow()` without having to deploy this SQL query into the production database environment. No thanks! I would rather be able to create a `ResultSet` (itself an interface!) in a test and, in the worst case, I have to carefully simulate `ResultSet` (a pretty terrible interface!) in order to avoid integrating with my production JDBC driver.

<aside markdown="1">

In an industrial-strength situation, I would not depend on `ResultSet` directly, but instead use some kind of Narrowing API that I can implement with an Adapter to JDBC **or** use a real database driver for an in-memory database system and restrict myself very carefully to only the exact SQL standard that both database drivers mutually support. Both carry risks and I can't evaluate those risks in the abstract; I'd have to consider a concrete situation to make that decision.

</aside>

## One More Universal Trick!

Fortunately, there is a universal transformation for turning every abstract class (the usual design of a Template Method) into a design that doesn't require inheriting implementation.

1. Create an interface that the abstract class will collaborate with, ideally by injecting the collaborating interface into the abstract class's constructor. (You know, passing it as a parameter.)
2. Copy the abstract methods from the abstract class onto the interface.
3. Implement each abstract method on the abstract class to delegate to the collaborating interface.
4. Now that the abstract class is no longer abstract (all its methods have an implementation), stop marking the class as `abstract`.
5. Clean up the (now) concrete class, removing references to fields that now belong in implementations of the collaborating interface. _The abstract class shouldn't have cared about those details in the first place!_
6. Now, add variation by implementing the collaborating interface, rather than by subclassing the formerly-abstract class.

This design turns a Template Method into a Standard Workflow (concrete class) that collaborates with Varying Steps (interface). It [replaces inheritance with delegation][replace-inheritance-with-delegation], which is almost always a good idea. A functional programmer would just design it that way, anyhow, since they easily pass functions into other functions as parameters. In modern (as of 2016) object-oriented languages, we can do this with _lambda expressions_ just like the cool kids do in their fancy functional programming languages. Damn kids.

[replace-inheritance-with-delegation]: https://refactoring.com/catalog/replaceInheritanceWithDelegation.html

## One More Thing!

Functional programmers do a lot of [Pipeline Programming][pipeline-programming]. This means that they create a bunch of functions that each take a single argument and return a single value, then compose those functions together to build wonderful, complicated algorithms in which they have total confidence. The languages usually have [some nice chaining operator to make the syntax really pretty][elixir-pipeline-operator]. This makes it possible to write things like —

```
def find_one_query(data_source, sql_query_description, map_row) {
  return data_source
    |> get_connection
    |> get_statement
    |> bind_statement(sql_query_description)
    |> execute_find_one_query
    |> map_row
}
```

(Syntax approximate. No warranty is provided nor implied. Do not try to compile.)

Here, `bind_statement` takes the output from `get_statement` and combines it with the `sql_query_description`, putting the SQL query text in the right place and binding the parameters to their respective placeholders. It answers the Prepared Statement, ready to be executed. Then `execute_find_one_query` executes the statement, expecting a single row, the returning it. Finally, `map_row` turns the generic row into a domain object (or `Nothing`, if there's no row to transform or something has gone wrong somewhere). I like this syntax, because it lets me see at a glance that the overall procedure is probably correct. If the types line up, then it will probably work. I like this about functional programming.

In a language like Haskell, I guess you'd write it as function composition — and by "guess" I mean "this probably isn't valid Haskell, but you get the idea".

```haskell
-- sql_query_description contains query text and query parameters
-- map_row : SqlRow -> DomainObject
-- data_source comes from the SQL library
find_one_query sql_query_description map_row data_source =
	(map_row
		. execute_find_one_query
		. (bind_statement sql_query_description)
		. get_statement
		. get_connection) data_source
```

Here, we could use eta conversion to avoid specifying the last parameter, `data_source`, but I wanted to make the example a little clearer to people like me who only know enough functional programming concepts to be dangerous. I probably could have designed this better. Feel free to suggest improvements! I notice some similarities in the syntax, anyway.

[pipeline-programming]: https://martinfowler.com/articles/collection-pipeline/ "This provides an example of this style of programming for operating on collections, where I find it particularly pleasing and convenient."

[elixir-pipeline-operator]: https://pragprog.com/magazines/2013-07/programming-elixir "This article shows a really nice example of how to use the pipeline operator."

### Tangent Much?

Oh, yes! My point… **a Pipeline is just a special kind of Standard Workflow (or Template Method) where each step sends its output into the next step as input**. So there's nothing special or weird about a Pipeline, and it's nothing particularly advanced or scary, and so you should just try designing with them and see what happens. No monads, even! (OK, maybe a monad, but it'll be fine.)

## Try This At Work!

Are you working on an application with a typical user interface? Web? Desktop? CLI? Doesn't matter. I bet you that you have some Controllers with a Standard Workflow:

1. Validate parameters from the Request, replying with a Failure Response View if the parameters are invalid.
2. Assuming that the Request is now worth processing, handle the Request, querying/updating the Model, then choosing a Response View.
3. Render the Response View by combining it with data from the Model or the original Request.

Extract that workflow! Now you have standard error handling, logging, auditing, authentication, authorization, all that wonderful stuff. (OK… you'll have it _eventually_.) Where can you use these workflows in other parts of your system? What are the 3-5 Standard Workflows in your entire system? (There are probably only 3-5.) How do those Standard Workflows build on each other? Combine this with [pushing details up the call stack](#references) and look at how easy it becomes to do two important things —

1. Check the details of the steps without having to run the Standard Workflows that you already know work!
2. Replace a simpler Standard Workflow with a more complicated Standard Workflow when things change. Changing authentication providers, for example, should be easy.

Maybe you can find some other Standard Workflows in your system:

+ Putting messages onto your messaging bus, dealing with MQ/JMS noise.
+ Sending email, dealing with SMTP noise.
+ Parse-Process-Format, such as what SOAP or other similar libraries are _supposed_ to do for you.
+ REST something something, I don't know. Almost certainly there, too.

# References

J. B. Rainsberger, ["Demystifying the Dependency Inversion Principle"](https://link.jbrains.ca/1Sb2djy). The parts about dependency injection containers are the most relevant in this situation.

J. B. Rainsberger, ["Refactor Your Way to a Dependency Injection Container"](https://link.jbrains.ca/2d0p0GB). You don't have to run screaming from dependency injection containers, but you _do_ need to understand what such a container is actually supposed to be doing.

J. B. Rainsberger, ["How Reuse Happens"](https://link.jbrains.ca/2dDCqqa). This whole article is an example of how reuse happens: you have to practise extracting similarities and you have to learn how to see past the differences to the deeper similarities.


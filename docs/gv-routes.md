---
id: routes
title: Routes
sidebar_label: Routes
slug: routes
---

A route (`IRoute`) represents the code you want to run and the conditions under which you want it to be run. Any method or function you want to execute must be asynchronous (returns a `Task`) and take a single parameter of type [`IHttpContext`](gv-httpcontext.md).

A route requires three things:
1. The code to execute
2. The the HTTP method ([`HttpMethod`](gv-http-method.md))
3. A route template

If the method is omitted, the route is assigned the default method `HttpMethod.Any`, which, as the name suggests, will match any HTTP method.

If the route template is omitted, the route is assigned a default template that will match for any endpoint and no endpoint.

Omitting both the method or the route template when creating a route will result in the creation of a catch-all route, which may or may not be desireable.

The router will pass the `IHttpContext` to the method `IRoute.Matches(IHttpContext context)` to determine if the route should be executed or not. If the HTTP method on the request matches and the endpoint matches the route template (as well as any header matches that are defined), the method will be executed.

## Creating A Route From A Lambda

You can create a route from a lambda expression:

```csharp
var route = new Route(async (context) =>
{
    await context.Response.SendResponseAsync("route from lambda expression");
}, "Get", "/lambda"));
```

## Creating A Route From A Function

You can generate a route using a `Func<IHttpContext, Task>`:

```csharp
Func<IHttpContext, Task> callback = async (context) =>
{
    await context.Response.SendResponseAsync("route from func");
};

var route = new Route(callback, "Get", "/function");
```

## Creating A Route From A Method

Routes can be generated from both static and instance methods. Instance methods must be on a class that can be instantiated.

### Instance Method

When using an instance method, we will generate a route with a generic parameter.

```csharp
public class TestResource
{
    public async Task TestRoute(IHttpContext context)
    {
        await context.Response.SendResponseAsync("route from method");
    }
}

var methodInfo = typeof(TestResource).GetMethod("TestRoute");
var route = new Route<TestResource>(methodInfo, "Get", "/instance-method");
```

:::caution
Best practice is to use the [Route Scanner](gv-route-scanner.md) to generate routes from methods in classes.
:::

### Static Method

When generating a route from a static method, you assign the static method like you would a delegate.

```csharp
public static class StaticTestResource
{
    public static async Task StaticTestRoute(IHttpContext context)
    {
        await context.Response.SendResponseAsync("route from static method");
    }
}

var route = new Route(StaticTestResource.StaticTestRoute, "Get", "/static-method");
```

## Specifying An Http Method

The [`HttpMethod`](gv-http-method.md) helper class can be used to specify the method for matching routes. It contains a number of static properties that ensure consistency.

```csharp
var route = new Route(callback, HttpMethod.Get, "/some/path");
```

In order to avoid ambiguity between `Grapevine.HttpMethod` and `System.Net.Http.HttpMethod`, you can also use a string to specify the method. It will be implicity converted to an instance of `HttpMethod`.

```csharp
var route = new Route(callback, "Get", "/some/path");
```

## Specifying A Route Template

A route template is generated from a string that defines the pattern. This pattern can be a literal string, a regular expression string, or a parameterized string. Literal and parameterized strings are case insensative matches. Regular expression strings are only case insensative if defined in the regular expression.

### Using Literal Strings

This is the most straight forward approach. In the example below, this route will execute when the endpoint is `/some/path`.

```csharp
var route = new Route(callback, "Any", "/some/path");
```

### Using Regular Expressions

You can express the route template as a regular expression string or as a `Regex` instance. The `Route` constructor will treat the route template string as a regular expression if it begins with a caret (`^`).

```csharp
var expr = @"^/users/(\d{3,5})";
var route1 = new Route(callback, "Any", expr);
var route2 = new Route(callback, "Any", new Regex(expr));
```

### Using Parameterized Strings

You can put route parameters in the route template by enclosing them within `{}` curly braces.

```csharp
var route = new Route(callback, "Any", "/users/{id}");
```

In the above example, the route would respond to calls made to all of `/users/1234`, `/users/rudy` and `/users/1a2b3c`, but not to `/users` or `/users/1234/rudy`.

Route templates may contain more that one route parameter, and you can have more than one route parameter in a route segment, however route parameters **must** be separated by a literal value and **must** have a name unique to the route template. Literal text other than the route parameter and path separator must match the text in the URL.

```csharp
// This will not fail, but it will cause unexpected behavior because
// there is no literal value between route parameters.
var route = new Route(callback, "Any", "/{resource}{id}");

// This will cause a runtime exception because route parameter
// names are not unique to the template.
var route = new Route(callback, "Any", "/{id}/{id}");

// This will work just fine.
var route = new Route(callback, "Any", "/{resource}/{id}");
```

:::caution
If you need to match a literal route parameter delimiter `{` or `}` in your route template, it is recommended that you use a regular expression.
:::

### Route Parameter Constraints

Route parameters may have constraints that must match the route value bound from the URL. Adding `:` and constraint name after the route parameter name specifies an inline constraint on a route parameter. If the constraint requires arguments, they're enclosed in parentheses `(...)` after the constraint name.

:::caution
Route constraints are not intended to be used for input validation, but to disabmiguate between similar routes. If constraints are used for input validation, invalid input results in a 404 Not Found response, when it should instead produce a 400 Bad Request response.
:::

The following table lists the built-in route constraints and their behavior. All inline constraints can have an additional length constraint added to it by appending another `:` and the length constraint name (`minlength`, `maxlength` and `length`).

| constraint     | Example                | Example Matches | Notes |
|----------------|------------------------|-----------------|-------|
| `alpha`        | `{greeting:alpha}`     | `hello`         | All uppercase and lower case letters.
| `alphanum`     | `{err-code:alphanum}`  | `Z1152a`        | All letters, numbers and the underscore `_`.
| `guid`         | `{id:guid}`            | `14c412f0-bf7e-41c0-a6a1-d6165079ec8d` | Matches guids with and without dashes, as well as with or without enclosing `{` `}` or `(` `)`.
| `num`          | `{id:num}`             | `1234`, `90210` | An unlimited number of digits |
| `string`       | `{type:string}`        | `Gr@p3v1ne~`    | An unlimited length of any text that isn't the route segement seperator `/`. This is the default constraint applied if none is specified when using the length constraints, or if the constraint specified is not otherwise found.
| `minlength(n)` | `{name:minlength(5)}`  | `Samantha`      | String must be at least `n` characters in length.
| `maxlength(n)` | `{name:maxlength(20)}` | `Samantha`      | String must be no more than `n` characters in length.
| `length(n)`    | `{state:length(2)}`    | `NE`, `OH`      | String must be exactly `n` characters in length.
| `length(m,n)`  | `{name:length(5,20)}`  | `Samantha`      | String must be between `m` and `n` characters in length.

## Accessing Route Parameter Values

Route parameter values are accessed via keys on the `IHttpRequest.PathParameters` property. All values are strings that will need to be cast to other types as required.

- If your route template was a literal string, there will not be any key/value pairs
- If your route template was a regular expression string, the key for each capture groups will be the string `p-` followed by the number of the capture group, e.g. `p-0`, `p-1`, etc.
- If your route template was a parameterized string, the the key will be the name you used for the parameter.

You can add keys to route templates that were generated from regular expressions by adding them, in order, to the `IRoute.RouteTemplate.PatternKeys` list.

## Limit Route Matching Using Headers

You can also further limit whether a route is matched to a request based on the value of any header. The method call takes the header key as a string and a regular expression to match the value. Only one regular expression can be defined per header value.

```csharp
var route = new Route(callback, "Get", "/some/path")
    .WithHeader("Host", new Regex(@"^localhost:1234$"));
```

This method is chainable, so you can add as many header conditions as needed.

## Enable And Disable Routes

Routes can be enabled and disabled. Only enabled routes will be matched by the router, and only enabled routes will be invoked.

```csharp
var route = new Route(callback, "Get", "/some/path", false)
    .Enable()   // extension method
    .Disable(); // extension method

// Direct property access
route.Enabled = true
```

## Route Name and Description

The `Name` and `Description` properties are primarily used in output when debugging and logging. You can change them at any time. You can also use the `Name` property to retrieve a route from the routing table on the router. While uniquness is not required, it would be helpful in this last case if your route names are unique.

```csharp
var route = server.Router.RoutingTable
    .Where(r => r.Name == "Some Unique Name")
    .FirstOrDefault();
```
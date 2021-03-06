---
id: overview
title: Server Overview
slug: /
---

Grapevine is a fast, unopinionated, embeddable, minimalist web framework for .NET. Grapevine is not intended to be a replacement for IIS or ASP.NET, but rather to function as an embedded REST/HTTP server in non-ASP.NET projects.

- Grapevine listens for incoming requests and routes them to specific functions and methods in your code
- Grapevine can serve static HTML, JavaScript, CSS and images, as well as other static assets

## Inspiration

Grapevine is modeled after my experience using the popular Node.js library [Express](http://expressjs.com/), which was itself inspired by the Ruby [Sinatra](http://sinatrarb.com/) library. When an incoming request is received, the request and response objects (collectively part of the `IHttpContext` object) gets routed to all matching routes until one of them sends a response - after which no more routes are invoked. If no matching routes are found, or if no route responds, then a `Not Implemented` response is sent.

## Getting Started

Grapevine is easy to get started with.

Create a simple route. This is the code that you want to run when a request comes in using the specificed HTTP verb and path. **Route methods must be [asynchronous](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/)!**

The only argument to your method is an `IHttpContext` object. This contains (among other things) the request and response objects. Since at least one of our route methods should respond to the request, we'll do that in this method.

```csharp
[RestResource]
public class MyResource
{
    [RestRoute("Get", "/api/test")]
    public async Task Test(IHttpContext context)
    {
        await context.Response.SendResponseAsync("Successfully hit the test route!").ConfigureAwait(false);
    }
}
```

:::tip
Consult [this guide](https://devblogs.microsoft.com/dotnet/configureawait-faq/) to see if `.ConfigureAwait(false)` is right for you.
:::

Next, create your first server using provided defaults with the `RestServerBuilder` class and start your server up!

```csharp
using (var server = RestServerBuilder.UseDefaults().Build())
{
    server.Start();

    Console.WriteLine("Press enter to stop the server");
    Console.ReadLine();
}
```

Open your prefered browser and go to `http://localhost:1234/api/test`. You should see the following output in your browser:

```
Successfully hit the test route!
```

:::note
Grapevine use `Microsoft.Extensions.DependencyInjection` for dependency injection and `Microsoft.Extensions.Logging` for logging. The default `RestServer` implementation is a wrapper for the ubiquitous [`HttpListener`](https://docs.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-5.0) class, although it is possible to create an implementation that does not have this dependency.
:::

---
id: overview
title: Overview
slug: /
---

Grapevine is REST/HTTP server that listens for incoming requests and routes them to specific methods in your code. It can also serve static assets. While it is flexible in how it can be used, it is not intended to be a replacement for IIS. Rather, it's intended use is to be an embedded server in an application whose primary purpose is not a web server. You can embedd it in a Windows Service, a desktop application or a console application.

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
        await context.Response.SendResponseAsync("Successfully hit the test route!");
    }
}
```

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

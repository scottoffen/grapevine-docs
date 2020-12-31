---
id: overview
title: Overview
---

Grapevine is REST/HTTP server that listens for incoming requests, routes them to specific methods in your code, and returns a response. It can serve both static assets and produce dynamic responses. While it is flexible in how it can be used, it is not intended to be a replacement for IIS. Rather, it's intended use is to be an embedded server in an application whose primary purpose is not a web server. You can embedd it in a Windows Service, a desktop application or a console application. You can even run multiple instances of the server at the same time, as long as they aren't trying to listen on the same prefix (or port).

:::note
The default `RestServer` implementation is a wrapper for the ubiquitous [`HttpListener`](https://docs.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-5.0) class, although it is possible to create an implementation that does not have this dependency.
:::

Grapevine is modeled after my experience using the popular Node.js library [Express](http://expressjs.com/), which was itself inspired by the Ruby [Sinatra](http://sinatrarb.com/) library. When an incoming request gets routed, the routing table is first filtered for matching routes. A match is based on the HTTP method and the path info, and can further be filtered by matching headers. The path info and the header matches are determined by regular expressions. All matching routes are then executed in order until one of them sends a response, after which no further routes are executed.

Grapevine use `Microsoft.Extensions.DependencyInjection` for dependency injection and `Microsoft.Extensions.Logging` for logging.

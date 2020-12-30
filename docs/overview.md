---
id: overview
title: Overview
---

Grapevine is REST/HTTP server that listens for incoming requests, routes them to specific methods in your code, and returns a response. It can serve both static assets and produce dynamic responses. While it is flexible in how it can be used, it is not intended to be a replacement for IIS. Rather, it's intended use is to be an embedded server in an application whose primary purpose is not a web server. You can embedd it in a Windows Service, a desktop application or a console application. You can even run multiple instances of the server at the same time, as long as they aren't trying to listen on the same prefix (or port).

Grapevine is modeled after my experience using the popular Node.js library [Express](http://expressjs.com/), which was itself inspired by the Ruby [Sinatra](http://sinatrarb.com/) library.

:::note
The default `RestServer` implementation is a wrapper for the ubiquitous [`HttpListener`](https://docs.microsoft.com/en-us/dotnet/api/system.net.httplistener?view=net-5.0) class, although it is possible to create an implementation that does not have this dependency.
:::

## Locals

Locals (known as `DynamicProperties` in earlier versions of Grapevine) is a way of attaching arbitrary data to an object without creating an sub class with the properties you want. Because everything in Grapevine depends on abstrations (interfaces), this method of adding data allows it to be easily extracted when needed without adding an explict cast to a concretion that might have properties that are not exposed by the interface.

Both `IRestServer` and `IHttpContext` implement the `ILocals` interface (via the `Locals` abstract class). Locals defined on the server are valid for the lifetime of the server, locals defined on the context are valid only for the lifetime of the request/response cycle. Using locals on the server, we can pass global meta data from the server for use in routes. We can use the locals on the context to pass data output from one route to other routes further along the chain.

## Rest Server

The `RestServer` class defines how your server should be configured. It exposes methods to `Start()` and `Stop()` the server. You can check to see if the server has successfully started by checking the `IsListening` property.

### Event Handlers

It also expose event handlers that will fire (synchronously) before the server starts (`BeforeStarting`), after the server starts (`AfterStarting`), before the server stops (`BeforeStopping`), and after the server stops (`AfterStopping`).

There is also an async event handler that is executed when a request is received. This event handler (`OnRequestAsync`) is the one that most middleware should hook into, and it might respond to the request before it can be routed to any defined routes - or hitting any other middleware. As a result, make sure you add middleware that would modify the response (e.g. `server.UseCorrelationId()`) before adding middleware that might actually send a response (e.g. `server.UseContentFolders()`).

### Content Folders

Content folders (`IContentFolder`, previously `IPublicFolder`) are a way of exposing static files to be served up by the server. Because routing to content folders is not turned on by default, after you add an instance of a class that implements `IContentFolder` to the `server.ContentFolders` collection, you need to add middleware to the pipeline to return that content. You can roll your own by hooking into the `OnRequestAsync` event, or use the built in `server.UseContentFolders()` extension.

### Global Headers

Global headers are used to add a consistent set of headers on every outgoing response. The value of the header is constant in the case of global headers, and does not vary between requests. The _Server_ global header is turned on by default. You can add a header, change it's value, or supress a previously set header from being sent.

### Router, Logger and Prefixes

You can add URIs for the listener to listen on via the `Prefixes` property, and access the logger (useful in the before/after start/stop event handlers) via the `Logger` property. The `Router` property is the router the server will use to route requests to your routes.

## Route Scanner

The route scanner is a property of the router, and is used to automatically scan for types and methods that have `RestResource` and `RestRoute` attributes attached to them. You shouldn't have to worry much about the methods on the interface or the concrete implementation unless you want to make changes to it. What you do need to know is that it scans in alphabetical order each assembly and type (except assemblies in the `IgnoredAssemblies` list) for types with the `RestResoure` attribute. In each type it finds, it scans all methods with the `RestRoute` attribute on them in the order they are defined in the class. If you have a catch-all route defined (like the sample application does), you have to take steps to ensure it is the last method scanned, or don't use the attributes on that class/method, and then register it manually after the server starts.

Automatic route scanning is enabled by default. If no routes are registered when the server starts (after the `BeforeStarting` event handler is fired), and `router.EnableAutoScan` is set to true, the route scanner will automatically scan for routes, and the routes it returns will be registered with the router. If routes were already defined or if `router.EnableAutoScan` is false, automatic scanning will not occur.

The route scanner can be used independently to scan specific assemblies or types, but the routes returned will need to be registered to the router by passing them to `IRouter.Register(IEnumerable<IRoute> routes)`.

## Router

The router is where routes are registered. You can set event

BeforeRoutingAsync, AfterRoutingAsync, EnableAutoScan, Register(IRoute), Error event handlers, ContinueRoutingAfterResponseSent, SendExceptionMessages

## Routes

A route is defined as an async function that takes `IHttpContext` as it's only argument and a set of parameters that determine under what conditions that route should execute. Those conditions include the HTTP method, the path info, and an optional set of headers. Routes can be created from inline lambda expressions, static methods or methods on a class.

## Http Methods

## Http Status Codes

## Content Types

## Http Context

### Http Request

### Http Response

## Advance Usage

Given that `RestServer` is a wrapper for `HttpListener` and `HttpContext` is a wrapper for `HttpListenerContext`, and that I've only exposed the methods and properties I deemed neccessary, it is sometimes helpful to be able to access underlying implementations directly. As long as you are using the implementations I've provided (or extending them), you can do this by casting the `IRestServer` or `IHttpContext` to `RestServer` or `HttpContext` (respectively), and the access the `Advanced` property. In each case, this is the underlying instance that is being wrapped.
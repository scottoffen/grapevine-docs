---
id: route-scanner
title: Route Scanner
sidebar_label: Route Scanner
slug: route-scanner
---

Route scanners are used to scan assemblies, classes and methods and generate routes which can then be registered with a router. Routes are identified by attributes on the methods, and classes that contain routes are identifed with attributes on the class.

:::important
The `RouteScanner` and `Router` for a given `IRestServer` must be using the same service collection so that types that have routes to register can be added to the container.
:::

## Controlling What To Scan

You can control what assemblies are scanned by the route scanner in two ways.

### Exclude Specific Assemblies

Add assemblies to be excluded from the scan to the ignored assemblies list prior to scanning.

```csharp
// Scans everything except what's on the ignored assembly list.
routeScanner.AddIgnoredAssembly("AssemblyName");
routeScanner.IgnoreAssemblyContainingType<SomeType>();

List<IRoute> routes = routeScanner.Scan();
```

### Scan A Single Assembly

Scan only a specified assembly.

```csharp
// Scan the current assembly
Assembly assembly = Assembly.GetAssembly(this.GetType());
List<IRoute> routes = routeScanner.Scan(assembly);

// Scan the assembly containing a given type
List<IRoute> routes = routeScanner.ScanAssemblyContainingType<SomeType>();
```

## Controlling When To Scan

TODO

## Identifying Methods To Scan

TODO
<!-- Methods that should be scanned for routes must be decorated with the `RestRoute` attribute. -->
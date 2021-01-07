---
id: run-without-admin-account
title: Running Without Admin Access
sidebar_label: Running Without Admin Access
slug: tutorials/run-without-admin-account
---

When you try to run your server outside of Visual Studio or Visual Studio Code, you might see an `Access Denied` exception occur. This will happen when using wildcard URI without either running the app as an administrator or configure namespace reservations for your URI.

:::tip
For development purposes, assuming you are an administrator on your local Windows instance, you can simply run your IDE or command line as administrator.
:::

## Configure Namespace Reservations

For obvious reasons, counting on your application to be running under an admin account in production is unwise. In these instances, you'll want to [configure a namespace reservation](https://docs.microsoft.com/en-us/windows/win32/http/namespace-reservations-registrations-and-routing).

These reservations can be made by using the [netsh](https://docs.microsoft.com/en-us/windows/win32/http/netsh-commands-for-http) utility command [`add urlacl`](https://docs.microsoft.com/en-us/windows/win32/http/add-urlacl).

```
$ netsh http add urlacl url=http://+:1234/ user=DOMAIN\user
```

It's important that the value of the url argument is an exact match with a prefix added to the server, or the exception will still be thrown.

```csharp
server.Prefixes.Add("http://+:1234/");
```

:::note
This documentation does not cover Windows operating systems earlier than Vista. For help with XP or Server 2003, see the documentation for [Httpcfg](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc781601(v=ws.10)).
:::
---
id: using-https-ssl
title: Using HTTPS and SSL
sidebar_label: Using HTTPS and SSL
slug: tutorials/using-https-ssl
---

While Grapevine absolutely supports using HTTPS, if you want your application to communicate over HTTPS there are a number of things that will need to happen outside of your application code entirely.

## Adding HTTPS to Grapevine

On the Grapevine side, it's easy to setup. All you have to do is add a prefix using the `https` protocol to signal to Grapevine that it needs to service SSL requests at that prefix.

```csharp
server.Prefixes.Add("https://*:443/");
```

## Creating And Using Certificates

On the machine that is running your Grapevine application, you will need to create, install and manage an SSL certificate. The specific details of how to do with will depend on your operating system and the tool you use to generate the certificate. I'd recommend starting with [**this post on StackOverflow**](https://stackoverflow.com/questions/11403333/httplistener-with-https-support).

The guidelines that follow are geared towards Windows Vista and higher operating systems. Many of the commands and processes described in the links below can be automated using [Powershell](https://docs.microsoft.com/en-us/powershell/).

### Generating A Certificate

Here are three different tools you can use to generate a certificate. See the documentation for the specific tool for steps on generating a certificate.

- [MakeCert](https://docs.microsoft.com/en-us/windows/win32/seccrypto/makecert)
- [OpenSSL](https://www.openssl.org/)
- [Let's Encrypt](https://letsencrypt.org/)

### Installing The Certificate

Once you generated a certificate, you will need to use the Certificate Manager on Windows to import the certificate into the Windows Certificate Store. You can open the Certificate Manager for the currently logged in user by running the following from the command line or **Run** dialog box:

```cmd
> certmgr.msc
```

### Bind The Certificate To A Port

You will then need to bind the certificate to your application's port. General instructions on how to do this can be found [in this Microsoft article](https://docs.microsoft.com/en-us/dotnet/framework/wcf/feature-details/how-to-configure-a-port-with-an-ssl-certificate#determine-how-ports-are-configured), which involves using the [`netsh`](https://docs.microsoft.com/en-us/windows/win32/http/netsh-commands-for-http) utility command [`add sslcert`](https://docs.microsoft.com/en-us/windows/win32/http/add-sslcert).

:::tip
If you want to use HTTPS, you probably want your application accessible outside of your local computer. To do that, you'll need to ensure you've [opened the specified port in your firewall](tut-windows-firewall.md) and have [configured a namespace reservation](tut-configure-namespace-reservation.md) on your target deployment machine.
:::
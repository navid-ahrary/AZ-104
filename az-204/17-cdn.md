# Azure CDN

## Controlling caching behavior

You can use content delivery network caching rules to set or modify default cache expiration behavior. These caching rules can either be global or with custom conditions. Azure Content Delivery Network offers two ways to control how your files get cached:

- Caching rules: Azure Content Delivery Network provides global and custom types of caching rules.
  - Global caching rules - You can set one global caching rule for each endpoint in your profile, which affects all requests to the endpoint. The global caching rule overrides any HTTP cache-directive headers, if set.
  - Custom caching rules - You can set one or more custom caching rules for each endpoint in your profile. Custom caching rules match specific paths and file extensions, get processed in order, and override the global caching rule, if set.
- Query string caching: You can adjust how the Azure content delivery network treats caching for requests with query strings. If the file isn't cacheable, the query string caching setting has no effect, based on caching rules and content delivery network default behaviors.

Note:

Caching rules are available only for Azure CDN Standard from Edgio profiles. For Azure CDN from Microsoft profiles, you must use the Standard rules engine For Azure CDN Premium from Edgio profiles, you must use the Edgio Premium rules engine in the Manage portal for similar functionality.

## Caching and time to live

Files from publicly accessible origin web servers can be cached in Azure Content Delivery Network until their time to live (TTL) elapses. The TTL gets determined by the Cache-Control header in the HTTP response from the origin server. This article describes how to set Cache-Control headers for the Web Apps feature of Microsoft Azure App Service, Azure Cloud Services, ASP.NET applications, and Internet Information Services (IIS) sites, all of which are configured similarly. You can set the Cache-Control header either by using configuration files or programmatically.

If you don't set a TTL on a file, Azure CDN sets a default value. However, this default might be overridden if you set up caching rules in Azure. Default TTL values are as follows:

- Generalized web delivery optimizations: _seven days_
- Large file optimizations: _one day_
- Media streaming optimizations: _one year_

## Geo-filtering

Geo-filtering enables you to allow or block content in specific countries/regions, based on the country/region code. In the Azure CDN Standard for Microsoft Tier, you can only allow or block the entire site.

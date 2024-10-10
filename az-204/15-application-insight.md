# Application Insight

Application Insights is an extension of Azure Monitor and provides Application Performance Monitoring (APM) features. APM tools are useful to monitor applications from development, through test, and into production in the following ways:

- Proactively understand how an application is performing.
- Reactively review application execution data to determine the cause of an incident.

Application Insights log-based metrics let you analyze the health of your monitored apps, create powerful dashboards, and configure alerts. There are two kinds of metrics:

- Log-based metrics behind the scene are translated into Kusto queries from stored events.
- Standard metrics are stored as preaggregated time series.

Since standard metrics are preaggregated during collection, they have better performance at query time. Standard metrics are a better choice for dashboarding and in real-time alerting. The log-based metrics have more dimensions, which makes them the superior option for data analysis and ad-hoc diagnostics.

## Availability test

After you deploy your web app or website, you can set up recurring tests to monitor availability and responsiveness. Application Insights sends web requests to your application at regular intervals from points around the world. It can alert you if your application isn't responding or responds too slowly.
You can create up to 100 availability tests per Application Insights resource, and there are three types of availability tests:

1. URL ping test (classic - will be retired soon): You can create this test through the portal to validate whether an endpoint is responding and measure performance associated with that response. You can also set custom success criteria coupled with more advanced features, like parsing dependent requests and allowing for retries.
2. Standard test: This is a type of availability test that checks the availability of a website by sending a single request, similar to the deprecated URL ping test. In addition to validating whether an endpoint is responding and measuring the performance, Standard tests also include TLS/SSL certificate validity, proactive lifetime check, HTTP request verb (for example, GET,HEAD, and POST), custom headers, and custom data associated with your HTTP request.
3. Custom Track Availability test: If you decide to create a custom application to run availability tests, you can use the TrackAvailability() method to send the results to Application Insights.

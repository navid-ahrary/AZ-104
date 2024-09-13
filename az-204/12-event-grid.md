# Azure Event Grid

Azure Event Grid is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the Hypertext Transfer Protocol (HTTP) and Message Queuing Telemetry Transport (MQTT) protocols

Event Grid enables clients to publish and subscribe to messages over the MQTT v3.1.1 and v5.0 protocols to support Internet of Things (IoT) solutions.

Event Grid can be configured to send events to subscribers (push delivery) or subscribers can connect to Event Grid to read events (pull delivery). Event Grid supports CloudEvents 1.0 specification to provide interoperability across systems.

A partner is a kind of publisher that sends events from its system to make them available to Azure customers. Partners not only can publish events to Azure Event Grid, but they can also receive events from it. These capabilities are enabled through the Partner Events feature.

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments.

The message is _JSON_ based on CloudEvent 1.0 cloud antive specification.

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "https://yourcompany.com/orders/",
    "subject" : "O-28964",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "application/json",
    "data" : {
       "orderId" : "O-28964",
       "URL" : "https://com.yourcompany/orders/O-28964"
    }
}
```

## There are several kinds of topics: custom topics, system topics, and partner topics

- **Custom Topics**: These are user-defined endpoints where you can send events from your applications. They are useful for creating a collection of related events that subscribers can filter and respond to1.
- **System Topics**: These are built-in topics provided by Azure services. They automatically publish events related to the service’s operations, such as resource creation or deletion2.
- **Partner Topics**: These are topics provided by third-party services that integrate with Azure Event Grid. They allow you to subscribe to events from external services.

## Event Handlers

Depending on the type of handler, Event Grid follows different mechanisms to guarantee the delivery of the event. For HTTP webhook event handlers, the event is retried until the handler returns a status code of 200 – OK. For Azure Storage Queue, the events are retried until the Queue service successfully processes the message push into the queue.

## Security

If using push delivery, the event handler is an Azure service, and a managed identity is used to authenticate Event Grid, the managed identity should have an appropriate RBAC role. For example, if sending events to Event Hubs, the managed identity used in the event subscription should be a member of the _Event Hubs Data Sender_ role.


# Message Queue

## Consider using Service Bus queues

As a solution architect/developer, you should consider using Service Bus queues when:

- Your solution needs to receive messages without having to poll the queue. With Service Bus, you can achieve it by using a long-polling receive operation using the TCP-based protocols that Service Bus supports.
- Your solution requires the queue to provide a guaranteed first-in-first-out (FIFO) ordered delivery.
- Your solution needs to support automatic duplicate detection.
- You want your application to process messages as parallel long-running streams (messages are associated with a stream using the session ID property on the message). In this model, each node in the consuming application competes for streams, as opposed to messages. When a stream is given to a consuming node, the node can examine the state of the application stream state using transactions.
- Your solution requires transactional behavior and atomicity when sending or receiving multiple messages from a queue.
- Your application handles messages that can exceed 64 KB but won't likely approach the 256 KB or 1-MB limit, depending on the chosen service tier (although Service Bus queues can handle messages up to 100 MB).
- You deal with a requirement to provide a role-based access model to the queues, and different rights/permissions for senders and receivers.

## Consider using Storage queues

As a solution architect/developer, you should consider using Storage queues when:

- Your application must store over 80 gigabytes of messages in a queue.
- Your application wants to track progress for processing a message in the queue. It's useful if the worker processing a message crashes. Another worker can then use that information to continue from where the prior worker left off.
- You require server side logs of all of the transactions executed against your queues.

## Service Bus

Service Bus offers basic, standard, and premium tiers.

### Compare Permium vs Standard tiers

| Premium | Standard |
|---------|----------|
| High throughput | Variable throughput |
| Predictable performance | Variable latency |
| Fixed pricing | Pay as you go variable pricing |
| Ability to scale workload up and down | N/A |
| Message size up to 100 MB | Message size up to 256 KB |

### Advanced Features

- Message sessions:To create a first-in, first-out (FIFO) guarantee in Service Bus, use sessions. Message sessions enable exclusive, ordered handling of unbounded sequences of related messages.
- Dead-letter queue: Service Bus supports a dead-letter queue (DLQ). A DLQ holds messages that can't be delivered to any receiver. Service Bus lets you remove messages from the DLQ and inspect them.
- Scheduled delivery: You can submit messages to a queue or topic for delayed processing. You can schedule a job to become available for processing by a system at a certain time.
- Message deferral: A queue or subscription client can defer retrieval of a message until a later time. The message remains in the queue or subscription, but is set aside.
- Transactions: A transaction groups two or more operations together into an execution scope. Service Bus supports grouping operations against a single messaging entity within the scope of a single transaction. A message entity can be a queue, topic, or subscription.
- Filtering and actions: Subscribers can define which messages they want to receive from a topic. These messages are specified in the form of one or more named subscription rules.
- Autodelete on idle: Autodelete on idle enables you to specify an idle interval after which a queue is automatically deleted. The minimum duration is 5 minutes.
- Duplicate detection: An error could cause the client to have a doubt about the outcome of a send operation. Duplicate detection enables the sender to resend the same message, or for the queue or topic to discard any duplicate copies.
- Security protocols: Service Bus supports security protocols such as Shared Access Signatures (SAS), Role Based Access Control (RBAC) and Managed identities for Azure resources.
- Security: Service Bus supports standard AMQP 1.0 and HTTP/REST protocols.

## Service Bus message payloads and serialization

A Service Bus message consists of a binary payload section that Service Bus never handles in any form on the service-side, and two sets of properties. The broker properties are system defined. These predefined properties either control message-level functionality inside the broker, or they map to common and standardized metadata items. The user properties are a collection of key-value pairs defined and set by the application.

Message routing and correlation

A subset of the broker properties, specifically To, ReplyTo, ReplyToSessionId, MessageId, CorrelationId, and SessionId, help applications route messages to particular destinations. The following patterns describe the routing:

- __Simple request/reply__: A publisher sends a message into a queue and expects a reply from the message consumer. The publisher owns a queue to receive the replies. The address of that queue is contained in the ReplyTo property of the outbound message. When the consumer responds, it copies the MessageId of the handled message into the CorrelationId property of the reply message and delivers the message to the destination indicated by the ReplyTo property. One message can yield multiple replies, depending on the application context.
- __Multicast request/reply__: As a variation of the prior pattern, a publisher sends the message into a topic and multiple subscribers become eligible to consume the message. Each of the subscribers might respond in the fashion described previously. If ReplyTo points to a topic, such a set of discovery responses can be distributed to an audience.
- __Multiplexing__: This session feature enables multiplexing of streams of related messages through a single queue or subscription such that each session (or group) of related messages, identified by matching SessionId values, are routed to a specific receiver while the receiver holds the session under lock. Learn more about the details of sessions here.
- __Multiplexed request/reply__: This session feature enables multiplexed replies, allowing several publishers to share a reply queue. By setting ReplyToSessionId, the publisher can instruct one or more consumers to copy that value into the SessionId property of the reply message. The publishing queue or topic doesn't need to be session-aware. When the message is sent the publisher can wait for a session with the given SessionId to materialize on the queue by conditionally accepting a session receiver.

Routing inside of a Service Bus namespace uses autoforward chaining and topic subscription rules. Routing across namespaces can be performed using Azure LogicApps. The To property is reserved for future use. Applications that implement routing should do so based on user properties and not lean on the To property; however, doing so now won't cause compatibility issues.

### Sessions

When sessions are enabled on a queue or a subscription, the client applications can no longer send/receive regular messages. All messages must be sent as part of a session (by setting the session id) and received by accepting the session. Clients may still peek a queue or subscription that has sessions enabled. See Message browsing.

#### Request-Response

Multiple applications can send their requests to a single request queue, with a specific header parameter set to uniquely identify the sender application. The receiver application can process the requests coming in the queue and send replies on the session enabled queue, setting the session ID to the unique identifier the sender had sent on the request message. The application that sent the request can then receive messages on the specific session ID and correctly process the replies.

### Message expiration

For session-enabled queues or topics' subscriptions, messages are locked at the session level. If the time-to-live (TTL) for any of the messages expires, all messages related to that session are either dropped or dead-lettered based on the dead-lettering enabled on messaging expiration setting on the entity. In other words, if there's a single message in the session that has passed the TTL, all the messages in the session are expired. The messages expire only if there's an active listener.

A session receiver is created by a client accepting a session. When the session is accepted and held by a client, the client holds an exclusive lock on all messages with that session's session ID in the queue or subscription. It holds exclusive locks on all messages with the session ID that arrive later.

Sequencing vs. sessions

Sequence number on its own guarantees the queuing order and the extraction order of messages, but not the processing order, which requires sessions.

Say, there are three messages in the queue and two consumers.

- Consumer 1 picks up message 1.
- Consumer 2 picks up message 2.
- Consumer 2 finishes processing message 2 and picks up message 3, while Consumer 1 isn't done with processing message 1 yet.
- Consumer 2 finishes processing message 3, but consumer 1 is still not done with processing message 1 yet.
- Finally, consumer 1 completes processing message 1.

So, the messages are processed in this order: message 2, message 3, and message 1. If you need message 1, 2, and 3 to be processed in order, you need to use sessions.
If messages just need to be retrieved in order, you don't need to use sessions. If messages need to be processed in order, use sessions. The same session ID should be set on messages that belong together, which could be message 1, 4, and 8 in a set, and 2, 3, and 6 in another set.

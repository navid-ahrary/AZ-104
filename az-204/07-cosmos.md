# Cosmos db

Azure Cosmos DB is a fully managed NoSQL database designed to provide low latency, elastic scalability of throughput, well-defined semantics for data consistency, and high availability.

You can configure your databases to be globally distributed and available in any of the Azure regions. To lower the latency, place the data close to where your users are. Choosing the required regions depends on the global reach of your application and where your users are located.

## Key benefits of global distribution

- Unlimited elastic write and read scalability.
- 99.999% read and write availability all around the world.
- Guaranteed reads and writes served in less than 10 milliseconds at the 99th percentile.

Your application can perform near real-time reads and writes against all the regions you chose for your database. Azure Cosmos DB internally handles the data replication between regions with consistency level guarantees of the level you selected.

## Azure Cosmos DB databases

You can create one or multiple Azure Cosmos DB databases under your account. A database is analogous to a namespace. A database is the unit of management for a set of Azure Cosmos DB containers.

## Azure Cosmos DB containers

An Azure Cosmos DB container is where data is stored. Unlike most relational databases, which scale up with larger sizes of virtual machines, Azure Cosmos DB scales out.

Data is stored on one or more servers called partitions. To increase partitions, you increase throughput, or they grow automatically as storage increases. This relationship provides a virtually unlimited amount of throughput and storage for a container.

When you create a container, you need to supply a partition key. The partition key is a property that you select from your items to help Azure Cosmos DB distribute the data efficiently across partitions. Azure Cosmos DB uses the value of this property to route data to the appropriate partition to be written, updated, or deleted. You can also use the partition key in the WHERE clause in queries for efficient data retrieval.

The underlying storage mechanism for data in Azure Cosmos DB is called a physical partition. Physical partitions can have a throughput amount up to 10,000 Request Units per second, and they can store up to 50 GB of data. Azure Cosmos DB abstracts this partitioning concept with a logical partition, which can store up to 20 GB of data.

When you create a container, you configure throughput in one of the following modes:

- Dedicated throughput: The throughput on a container is exclusively reserved for that container. There are two types of dedicated throughput: standard and autoscale.
- Shared throughput: Throughput is specified at the database level and then shared with up to 25 containers within the database. Sharing of throughput excludes containers that are configured with their own dedicated throughput.

Azure Cosmos DB offers five well-defined levels of consistency. From strongest to weakest, the levels are:

- Strong
- Bounded staleness
- Session
- Consistent prefix
- Eventual

![](./assets/five-consistency-levels.png)

The consistency levels are region-agnostic and are guaranteed for all operations, regardless of:

- The region where the reads and writes are served
- The number of regions associated with your Azure Cosmos DB account
- Whether your account is configured with a single or multiple write regions.

## Configure the default consistency level

You can configure the default consistency level on your Azure Cosmos DB account at any time. The default consistency level configured on your account applies to all Azure Cosmos DB databases and containers under that account. All reads and queries issued against a container or a database use the specified consistency level by default.
https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels

## Explore supported APIs

NoSQL, MongoDB, PostgreSQL, Cassandra, Gremlin, and Table.

We can use any compatible client-driver with API like mongoose for Mongodb, pg for Postgresql.
These APIs are best suited if the following conditions are true:

- If you have existing MongoDB, PostgreSQL Cassandra, or Gremlin applications
- If you don't want to rewrite your entire data access layer
- If you want to use the open-source developer ecosystem, client-drivers, expertise, and resources for your database

## API for NOSQL:

Any new feature that is rolled out to Azure Cosmos DB is first available on API for NoSQL accounts. NoSQL accounts provide support for querying items using the Structured Query Language (SQL) syntax.

## API for Table

The Azure Cosmos DB API for Table stores data in key/value format.
API for Table only supports OLTP scenarios.

## Unit request:

With Azure Cosmos DB, you pay for the throughput you provision and the storage you consume on an hourly basis.

The cost of all database operations is normalized in Azure Cosmos DB and expressed by request units (or RUs, for short). A request unit represents the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB.
No matter which API you use to interact with your Azure Cosmos container, costs are measured by RUs. Whether the database operation is a write, point read, or query, costs are measured in RUs.

The type of Azure Cosmos DB account you're using determines the way consumed RUs get charged. There are three modes in which you can create an account:

- Provisioned throughput mode: In this mode, you provision the number of RUs for your application on a per-second basis in increments of 100 RUs per second. To scale the provisioned throughput for your application, you can increase or decrease the number of RUs at any time in increments or decrements of 100 RUs. You can make your changes either programmatically or by using the Azure portal. You can provision throughput at container and database granularity level.
- Serverless mode: In this mode, you don't have to provision any throughput when creating resources in your Azure Cosmos DB account. At the end of your billing period, you get billed for the number of request units that have been consumed by your database operations.
- Autoscale mode: In this mode, you can automatically and instantly scale the throughput (RU/s) of your database or container based on its usage. This scaling operation doesn't affect the availability, latency, throughput, or performance of the workload. This mode is well suited for mission-critical workloads that have variable or unpredictable traffic patterns, and require SLAs on high performance and scale.

## Writing stored procedures

Stored procedures are registered per collection, and can operate on any document or an attachment present in that collection.

## Writing Pre-triggers

Pretriggers can't have any input parameters. The request object in the trigger is used to manipulate the request message associated with the operation.

## Writing Post-triggers

One thing that is important to note is the transactional execution of triggers in Azure Cosmos DB. The post-trigger runs as part of the same transaction for the underlying item itself. An exception during the post-trigger execution fails the whole transaction. Anything committed is rolled back and an exception returned.

## User-defined function (UDF)

This user-defined function would then be used inside a query

## Change feed in Azure Cosmos DB

Change feed in Azure Cosmos DB is a persistent record of changes to a container in the order they occur. Change feed support in Azure Cosmos DB works by listening to an Azure Cosmos DB container for any changes. It then outputs the sorted list of documents that were changed in the order in which they were modified. The persisted changes can be processed asynchronously and incrementally, and the output can be distributed across one or more consumers for parallel processing.

Today, you see all inserts and updates in the change feed. You can't filter the change feed for a specific type of operation. Currently change feed doesn't log delete operations.

You can work with the Azure Cosmos DB change feed using either a _push model_ or a _pull model_.

push model: the change feed processor pushes work to a client that has business logic for processing this work. However, the complexity in checking for work and storing state for the last processed work is handled within the change feed processor.

pull model: the client has to pull the work from the server. In this case, the client has business logic for processing work and also stores state for the last processed work. The client handles load balancing across multiple clients processing work in parallel, and handling errors.

Azure recommends to use _Push model_, but in some scenario we might want the extra low-level control of the _pull model_ such as:

- Reading changes from a particular partition key
- Controlling the pace at which your client receives changes for processing
- Doing a one-time read of the existing data in the change feed (for example, to do a data migration)

## Reading change feed with a push model:

There are two ways you can read from the change feed with a push model: Azure Functions Azure Cosmos DB triggers, and the change feed processor library (.Net and Java). Azure Functions uses the change feed processor behind the scenes, so these are both similar ways to read the change feed.

# Azure Cache for Redis

| Tier | Description |
|------|-------------|
|Basic | An OSS Redis cache running on a single virtual machine (VM). This tier has no service-level agreement (SLA) and is ideal for development/test and noncritical workloads. |
| Standard | An OSS Redis cache running on two VMs in a replicated configuration|
| Premium | High-performance OSS Redis caches. This tier offers higher throughput, lower latency, better availability, and more features. Premium caches are deployed on more powerful VMs compared to the VMs for Basic or Standard caches |
| Enterprise | High-performance caches powered by Redis Labs' Redis Enterprise software. This tier supports Redis modules including RediSearch, RedisBloom, and RedisTimeSeries. Also, it offers even higher availability than the Premium tier.|
| Enterprise Flash | Cost-effective large caches powered by Redis Labs' Redis Enterprise software. This tier extends Redis data storage to nonvolatile memory, which is cheaper than DRAM, on a VM. It reduces the overall per-GB memory cost.|

## Name

The Redis cache needs a globally unique name. The name has to be unique within Azure because it's used to generate a public-facing URL to connect and communicate with the service.

The name must be between 1 and 63 characters, composed of numbers, letters, and the '-' character. The cache name can't start or end with the '-' character, and consecutive '-' characters aren't valid.

## Clustering support

With the Premium, Enterprise, and Enterprise Flash tiers you can implement clustering to automatically split your dataset among multiple nodes. To implement clustering, you specify the number of shards to a maximum of 10. The cost incurred is the cost of the original node, multiplied by the number of shards.

Choosing the right tier

Consider the following options when choosing an Azure Cache for Redis tier:

- Memory: The Basic and Standard tiers offer 250 MB – 53 GB; the Premium tier 6 GB - 1.2 TB; the Enterprise tier 1 GB - 2 TB, and the Enterprise Flash tier 300 GB - 4.5 TB. To create larger sized cache instances, you can use scale out. For more information, see Azure Cache for Redis Pricing.
- Performance: Caches in the Premium and Enterprise tiers are deployed on hardware that has faster processors, giving better performance compared to the Basic or Standard tier. The Enterprise tier typically has the best performance for most workloads, especially with larger cache instances. For more information, see Performance testing.
- Dedicated core for Redis server: All caches except C0 run dedicated vCPUs. The Basic, Standard, and Premium tiers run open source Redis, which by design uses only one thread for command processing. On these tiers, having more vCPUs usually improves throughput performance because Azure Cache for Redis uses other vCPUs for I/O processing or for OS processes. However, adding more vCPUs per instance might not produce linear performance increases. Scaling out usually boosts performance more than scaling up in these tiers. Both the Enterprise and Enterprise Flash tiers run on Redis Enterprise, which is able to utilize multiple vCPUs per instance, which can also significantly increase performance over other tiers. For Enterprise and Enterprise flash tiers, scaling up is recommended before scaling out. For more information, see Sharding and CPU utilization.
- Network performance: If you have a workload that requires high throughput, the Premium or Enterprise tier offers more bandwidth compared to Basic or Standard. Also within each tier, larger size caches have more bandwidth because of the underlying VM that hosts the cache. Higher bandwidth limits help you avoid network saturation that cause timeouts in your application. For more information, see Performance testing.
- Maximum number of client connections: The Premium and Enterprise tiers offer the maximum numbers of clients that can connect to Redis, offering higher numbers of connections for larger sized caches. Clustering increases the total amount of network bandwidth available for a clustered cache.
- High availability: Azure Cache for Redis provides multiple high availability options. It guarantees that a Standard, Premium, or Enterprise cache is available according to our SLA. The SLA only covers connectivity to the cache endpoints. The SLA doesn't cover protection from data loss. We recommend using the Redis data persistence feature in the Premium and Enterprise tiers to increase resiliency against data loss.
- Data persistence: The Premium and Enterprise tiers allow you to persist the cache data to an Azure Storage account and a Managed Disk respectively. Underlying infrastructure issues might result in potential data loss. We recommend using the Redis data persistence feature in these tiers to increase resiliency against data loss. Azure Cache for Redis offers both RDB and AOF (preview) options. Data persistence can be enabled through Azure portal and CLI. For the Premium tier, see How to configure persistence for a Premium Azure Cache for Redis.
- Network isolation: Azure Private Link and Virtual Network (VNet) deployments provide enhanced security and traffic isolation for your Azure Cache for Redis. VNet allows you to further restrict access through network access control policies. For more information, see Azure Cache for Redis with Azure Private Link and How to configure Virtual Network support for a Premium Azure Cache for Redis.
- Redis Modules: Enterprise tiers support RediSearch, RedisBloom, RedisTimeSeries, and RedisJSON. These modules add new data types and functionality to Redis.

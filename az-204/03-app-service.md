Azure App Service supports two options for **scaling out/in** your web apps automatically:

- Autoscaling with Azure autoscale. Autoscaling makes scaling decisions based on rules that you define.
- Azure App Service automatic scaling . Automatic scaling makes scaling decisions for you based on the parameters that you select. Autoscaling responds to changes in the environment by adding or removing web servers and balancing the load between them. Autoscaling doesn't have any effect on the CPU power, memory, or storage capacity of the web servers powering the app, it only changes the number of web servers. With automatic scaling, you can adjust scaling settings to improve your app's performance and avoid cold start issues. The platform prewarms instances to act as a buffer when scaling out, ensuring smooth performance transitions. You're charged per second for every instance, including prewarmed instances.

## How an autoscale rule analyzes metrics:

In the first step, an autoscale rule aggregates the values retrieved for a metric for all instances across a period of time known as the **time grain**. in most cases this period is 1 minute. The aggregated value is known as the **time aggregation**. The options available are _Average_, _Minimum_, _Maximum_, _Sum_, _Last_, and _Count_. If the Duration is set to 10 minutes for example, the autoscale rule aggregates the 10 values calculated for the time grain.

## Combining autoscale rules

- If the HTTP queue length exceeds 10, scale out by 1
- If the CPU utilization exceeds 70%, scale out by 1
- If the HTTP queue length is zero, scale in by 1
- If the CPU utilization drops below 50%, scale in by 1

When determining whether to scale out, the autoscale action is performed if any of the scale-out rules are met (HTTP queue length exceeds 10 or CPU utilization exceeds 70%). When scaling in, the autoscale action runs only if all of the scale-in rules are met (HTTP queue length drops to zero and CPU utilization falls below 50%). If you need to scale in if only one of the scale-in rules are met, you must define the rules in separate autoscale conditions.

- All thresholds are calculated at an instance level. For example, "scale out by one instance when average CPU > 80% when instance count is 2", means to scale out when the average CPU across all instances is greater than 80%.
- All autoscale successes and failures are logged to the Activity Log. You can then configure an activity log alert so that you can be notified via email, SMS, or webhooks whenever there's activity.

## Best practice:

We recommend carefully choosing different thresholds for scale-out and scale-in based on practical situations.

We don't recommend autoscale settings like the following examples with the same or similar threshold values for out and in conditions:

- Increase instances by one count when Thread Count >= 600
- Decrease instances by one count when Thread Count <= 600

Let's look at an example of what can lead to a behavior that may seem confusing. Consider the following sequence.

Assume there are two instances to begin with and then the average number of threads per instance grows to 625.
Autoscale scales out adding a third instance.
Next, assume that the average thread count across instance falls to 575.
Before scaling in, autoscale tries to estimate what the final state will be if it scaled in. For example, 575 x 3 (current instance count) = 1,725 / 2 (final number of instances when scaled in) = 862.5 threads. This means autoscale would have to immediately scale out again even after it scaled in, if the average thread count remains the same or even falls only a small amount. However, if it scaled out again, the whole process would repeat, leading to an infinite loop.
To avoid this situation (termed "flapping"), autoscale doesn't scale in at all. Instead, it skips and reevaluates the condition again the next time the service's job executes. This can confuse many people because autoscale wouldn't appear to work when the average thread count was 575.

Estimation during a scale-in is intended to avoid "flapping" situations, where scale-in and scale out actions continually go back and forth. Keep this behavior in mind when you choose the same thresholds for scale-out and in.

We recommend choosing an adequate margin between the scale-out and in thresholds. As an example, consider the following better rule combination.

    Increase instances by 1 count when CPU% >= 80
    Decrease instances by 1 count when CPU% <= 60

In this case

Assume there are 2 instances to start with.
If the average CPU% across instances goes to 80, autoscale scales out adding a third instance.
Now assume that over time the CPU% falls to 60.
Autoscale's scale-in rule estimates the final state if it were to scale-in. For example, 60 x 3 (current instance count) = 180 / 2 (final number of instances when scaled in) = 90. So autoscale doesn't scale-in because it would have to scale out again immediately. Instead, it skips scaling in.
The next time autoscale checks, the CPU continues to fall to 50. It estimates again - 50 x 3 instance = 150 / 2 instances = 75, which is below the scale-out threshold of 80, so it scales in successfully to 2 instances.

https://learn.microsoft.com/en-us/answers/questions/525145/what-is-flapping-in-app-service-autoscale

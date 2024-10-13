# Slot

The **Standard**, **Premium**, and **Isolated** App Service plan tiers support deployment to a specified deployment slot instead of the default production slot.

Deploying your application to a non-production slot has the following benefits:

- You can validate app changes in a staging deployment slot before swapping it with the production slot.
- Deploying an app to a slot first and swapping it into production makes sure that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your app. The traffic redirection is seamless, and no requests are dropped because of swap operations. You can automate this entire workflow by configuring auto swap when pre-swap validation isn't needed.
- After a swap, the previous production app is located in the staging slot. If the changes swapped into the production slot aren't as you expect, you can perform the same swap immediately to get your "last known good site" back.

## Examine slot swapping

When you swap two slots (for example, from a staging slot to the production slot), App Service completes the following process to ensure that the target slot doesn't experience downtime:

    Apply the following settings from the target slot (for example, the production slot) to all instances of the source slot:
        Slot-specific app settings and connection strings, if applicable.
        Continuous deployment settings, if enabled.
        App Service authentication settings, if enabled.

    Any of these cases trigger all instances in the source slot to restart. During swap with preview, this marks the end of the first phase. The swap operation is paused, and you can validate that the source slot works correctly with the target slot's settings.

    Wait for every instance in the source slot to complete its restart. If any instance fails to restart, the swap operation reverts all changes to the source slot and stops the operation.

    If local cache is enabled, trigger local cache initialization by making an HTTP request to the application root ("/") on each instance of the source slot. Wait until each instance returns any HTTP response. Local cache initialization causes another restart on each instance.

    If auto swap is enabled with custom warm-up, trigger Application Initiation by making an HTTP request to the application root ("/") on each instance of the source slot.

        If applicationInitialization isn't specified, trigger an HTTP request to the application root of the source slot on each instance.

        If an instance returns any HTTP response, it's considered to be warmed up.

    If all instances on the source slot are warmed up successfully, swap the two slots by switching the routing rules for the two slots. After this step, the target slot (for example, the production slot) has the app that's previously warmed up in the source slot.

    Now that the source slot has the pre-swap app previously in the target slot, perform the same operation by applying all settings and restarting the instances.

## Configure auto swap

Auto swap isn't currently supported in web apps on Linux and Web App for Containers.

Auto swap streamlines Azure DevOps Services scenarios where you want to deploy your app continuously with zero cold starts and zero downtime for customers of the app. When auto swap is enabled from a slot into production, every time you push your code changes to that slot, App Service automatically swaps the app into production after it's warmed up in the source slot.

## Specify custom warm-up

    ```xml
    <system.webServer>
        <applicationInitialization>
            <add initializationPage="/" hostName="[app hostname]" />
            <add initializationPage="/Home/About" hostName="[app hostname]" />
        </applicationInitialization>
    </system.webServer>
    ```

`WEBSITE_SWAP_WARMUP_PING_PATH`: The path to ping to warm up your site. Add this app setting by specifying a custom path that begins with a slash as the value. An example is /statuscheck. The default value is /.

`WEBSITE_SWAP_WARMUP_PING_STATUSES`: Valid HTTP response codes for the warm-up operation. Add this app setting with a comma-separated list of HTTP codes. An example is 200,202 . If the returned status code isn't in the list, the warmup and swap operations are stopped. By default, all response codes are valid.

`WEBSITE_WARMUP_PATH`: A relative path on the site that should be pinged whenever the site restarts (not only during slot swaps). Example values include /statuscheck or the root

Route production traffic automatically

To route production traffic automatically:

- Go to your app's resource page and select Deployment slots.
- In the Traffic % column of the slot you want to route to, specify a percentage (between 0 and 100) to represent the amount of total traffic you want to route. Select Save.

After the setting is saved, the specified percentage of clients is randomly routed to the non-production slot.

After a client is automatically routed to a specific slot, it's "pinned" to that slot for the life of that client session. On the client browser, you can see which slot your session is pinned to by looking at the x-ms-routing-name cookie in your HTTP headers. A request that's routed to the "staging" slot has the cookie x-ms-routing-name=staging. A request that's routed to the production slot has the cookie x-ms-routing-name=self.

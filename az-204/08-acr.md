# Azure Container Registry

## tiers:

Just different in storage and image throughput

- Basic
- Standard
- Premium

Features:

- Geo-replication: For scenarios requiring high-availability assurance, consider using the geo-replication feature of **Premium** registries. Geo-replication helps guard against losing access to your registry in a regional failure event. Geo-replication provides other benefits, too, like network-close image storage for faster pushes and pulls in distributed development or deployment scenarios.
- Zone redundancy: A feature of the **Premium** service tier, zone redundancy uses Azure availability zones to replicate your registry to a minimum of three separate zones in each enabled region.

## Azure Container Instances:

![alt text](https://learn.microsoft.com/en-us/training/wwl-azure/create-run-container-images-azure-container-instances/media/container-groups-example.png)

This example container group:

- Is scheduled on a single host machine.
- Is assigned a DNS name label.
- Exposes a single public IP address, with one exposed port.
- Consists of two containers. One container listens on port 80, while the other listens on port 5000.
- Includes two Azure file shares as volume mounts, and each container mounts one of the shares locally.

Deployment:

There are two common ways to deploy a multi-container group: use a Resource Manager template or a YAML file. A Resource Manager template is recommended when you need to deploy more Azure service resources (for example, an Azure Files share) when you deploy the container instances. Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances.

Storage:

You can specify external volumes to mount within a container group. You can map those volumes into specific paths within the individual containers in a group. Supported volumes include:

- Azure file share
- Secret
- Empty directory
- Cloned git repo

Scenario:
Multi-container groups are useful in cases where you want to divide a single functional task into a few container images. These images might be delivered by different teams and have separate resource requirements.

- A container serving a web application and a container pulling the latest content from source control.
- An application container and a logging container. The logging container collects the logs and metrics output by the main application and writes them to long-term storage.
- An application container and a monitoring container. The monitoring container periodically makes a request to the application to ensure that it's running and responding correctly, and raises an alert if it's not.
- A front-end container and a back-end container. The front end might serve a web application, with the back end running a service to retrieve data.

Note:

- Port mapping is not supported, we just open container port to external

```
az ad sp create-for-rbac \
-n wavecountcontainerregistry01-pull
--role acrpull
--scope $(az acr show -n wavecountcontainerregitey01 --query id -o tsv)
```

```
az container create --resource-group az-204-rg --name aci-demo --image wavecountcontainerregistry01.azurecr.io/go-sample:latest  --dns-name-label aci-demo-$RANDOM --port 8080 --registry-username $(az keyvault secret show --vault-name keyvault-wavecount -n wavecountcontainerregistry01-pull-usr --query value -o tsv) --registry-password $(az keyvault secret show --vault-name keyvault-wavecount -n wavecountcontainerregistry01-pull-pwd --query value -o tsv) --dns-name-label aci-demo-$RANDOM --query ipAddress.fqdn --restart-policy onFailure --environment-variables 'password'='Pa55word'
```

### Mount an Azure file share in Azure Container Instances:

By default, Azure Container Instances are stateless. If the container crashes or stops, all of its state is lost. To persist state beyond the lifetime of the container, you must mount a volume from an external store. As shown in this unit, Azure Container Instances can mount an Azure file share created with Azure Files. Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard Server Message Block (SMB) protocol. Using an Azure file share with Azure Container Instances provides file-sharing features similar to using an Azure file share with Azure virtual machines.

## Azure Container Apps:

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform that runs on top of Azure Kubernetes Service. Common uses of Azure Container Apps include:

- Deploying API endpoints
- Hosting background processing applications
- Handling event-driven processing
- Running microservices

### Azure Container Apps environments:

Individual container apps are deployed to a single Container Apps environment, which acts as a secure boundary around groups of container apps. Container Apps in the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. You might provide an existing virtual network when you create an environment.

### Reasons to deploy container apps to the same environment include situations when you need to:

- Manage related services
- Deploy different applications to the same virtual network
- Instrument Dapr applications that communicate via the Dapr service invocation API
- Have applications to share the same Dapr configuration
- Have applications share the same log analytics workspace

### Reasons to deploy container apps to different environments include situations when you want to ensure:

- Two applications never share the same compute resources
- Two Dapr applications can't communicate via the Dapr service invocation API

### Deploy

First we need create Container App Environment fot App, Just like App Service for Function App
Container App Environment:

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

```
az extension add --name containerapp --upgrade
```

```
az containerapp env create \
    --name $myAppContEnv \
    --resource-group $myRG \
    --location $myLocation
```

Container App:

```
az containerapp create -n my-container-app -g $myRG  --environment $myAppContEnv --image wavecountcontainerregistry01.azurecr.io/go-sample:latest  --registry-server  wavecountcontainerregistry01.azurecr.io   --target-port 8080 --ingress external  --query properties.configurations.ingress.fqdn
```

### Features:

Configurations:

The following code is an example of the containers array in the properties.template section of a container app resource template. The excerpt shows some of the available configuration options when setting up a container when using Azure Resource Manager (ARM) templates. Changes to the template ARM configuration section trigger a new container app revision.

```
"containers": [
  {
       "name": "main",
       "image": "[parameters('container_image')]",
    "env": [
      {
        "name": "HTTP_PORT",
        "value": "80"
      },
      {
        "name": "SECRET_VAL",
        "secretRef": "mysecret"
      }
    ],
    "resources": {
      "cpu": 0.5,
      "memory": "1Gi"
    },
    "volumeMounts": [
      {
        "mountPath": "/myfiles",
        "volumeName": "azure-files-volume"
      }
    ]
    "probes":[
        {
            "type":"liveness",
            "httpGet":{
            "path":"/health",
            "port":8080,
            "httpHeaders":[
                {
                    "name":"Custom-Header",
                    "value":"liveness probe"
                }]
            },
            "initialDelaySeconds":7,
            "periodSeconds":3
// file is truncated for brevity
```

Multiple containers:

You can define multiple containers in a single container app to implement the sidecar pattern. The containers in a container app share hard disk and network resources and experience the same application lifecycle.
Examples of sidecar containers include:

- An agent that reads logs from the primary app container on a shared volume and forwards them to a logging service.
- A background process that refreshes a cache used by the primary app container in a shared volume.

Container registries:

You can deploy images hosted on private registries by providing credentials in the Container Apps configuration.
To use a container registry, you define the required fields in registries array in the properties.configuration section of the container app resource template

```
{
  ...
  "registries": [{
    "server": "docker.io",
    "username": "my-registry-user-name",
    "passwordSecretRef": "my-password-secret-name"
  }]
}
```

With the registry information added, the saved credentials can be used to pull a container image from the private registry when your app is deployed.

Limitations

Azure Container Apps has the following limitations:

- Privileged containers: Azure Container Apps can't run privileged containers. If your program attempts to run a process that requires root access, the application inside the container experiences a runtime error.
- Operating system: Linux-based (linux/amd64) container images are required.

### Implement authentication and authorization in Azure Container Apps:

This feature should only be used with HTTPS. Ensure allowInsecure is disabled on your container app's ingress configuration. You can configure your container app for authentication with or without restricting access to your site content and APIs.

- To restrict app access only to authenticated users, set its Restrict access setting to Require authentication.
- To authenticate but not restrict access, set its Restrict access setting to Allow unauthenticated access.

Identity providers

Container Apps uses federated identity, in which a third-party identity provider manages the user identities and authentication flow for you. The following identity providers are available by default:
Provider Sign-in endpoint How-To guidance

Microsoft Identity Platform /.auth/login/aad Microsoft Identity Platform.

Facebook /.auth/login/facebook Facebook

GitHub /.auth/login/github GitHub

Google /.auth/login/google Google

Twitter /.auth/login/twitter Twitter

Any OpenID Connect provider /.auth/login/<providerName> OpenID Connect

![alt text](https://learn.microsoft.com/en-us/training/wwl-azure/implement-azure-container-apps/media/container-apps-authorization-architecture.png)

The platform middleware handles several things for your app:

- Authenticates users and clients with the specified identity providers
- Manages the authenticated session
- Injects identity information into HTTP request headers

The authentication and authorization module runs in a separate container, isolated from your application code. As the security container doesn't run in-process, no direct integration with specific language frameworks is possible. However, relevant information your app needs is provided in request headers.

Authentication flow

The authentication flow is the same for all providers, but differs depending on whether you want to sign in with the provider's SDK:

- Without provider SDK (server-directed flow or server flow): The application delegates federated sign-in to Container Apps. Delegation is typically the case with browser apps, which presents the provider's sign-in page to the user.
- With provider SDK (client-directed flow or client flow): The application signs users in to the provider manually and then submits the authentication token to Container Apps for validation. This approach is typical for browser-less apps that don't present the provider's sign-in page to the user. An example is a native mobile app that signs users in using the provider's SDK.

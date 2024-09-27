# Azure Container Registry

## tiers

Just different in storage and image throughput

- Basic
- Standard
- Premium

Features:

- Geo-replication: For scenarios requiring high-availability assurance, consider using the geo-replication feature of **Premium** registries. Geo-replication helps guard against losing access to your registry in a regional failure event. Geo-replication provides other benefits, too, like network-close image storage for faster pushes and pulls in distributed development or deployment scenarios.
- Zone redundancy: A feature of the **Premium** service tier, zone redundancy uses Azure availability zones to replicate your registry to a minimum of three separate zones in each enabled region.

## Tasks

Task scenarios

ACR Tasks supports several scenarios to build and maintain container images and other artifacts.

- Quick task - Build and push a single container image to a container registry on-demand, in Azure, without needing a local Docker Engine installation. Think docker build, docker push in the cloud.
- Automatically triggered tasks - Enable one or more triggers to build an image:
  - Trigger on source code update
  - Trigger on base image update
  - Trigger on a schedule
- Multi-step task - Extend the single image build-and-push capability of ACR Tasks with multi-step, multi-container-based workflows.

Each ACR Task has an associated source code context - the location of a set of source files used to build a container image or other artifact. Example contexts include a Git repository or a local filesystem.

## Azure Container Instances

![alt text](https://learn.microsoft.com/en-us/training/wwl-azure/create-run-container-images-azure-container-instances/media/container-groups-example.png)

This example container group:

- Is scheduled on a single host machine.
- Is assigned a DNS name label.
- Exposes a single public IP address, with one exposed port.
- Consists of two containers. One container listens on port 80, while the other listens on port 5000.
- Includes two Azure file shares as volume mounts, and each container mounts one of the shares locally.

Features:

- fast startup
- internet access
- robust security
- windows and linux
- precise sizing

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

```azurecli
az ad sp create-for-rbac \
-n wavecountcontainerregistry01-pull
--role acrpull
--scope $(az acr show -n wavecountcontainerregitey01 --query id -o tsv)
```

```azurecli
az container create --resource-group az-204-rg \
--name aci-demo \
--image wavecountcontainerregistry01.azurecr.io/go-sample:latest  \
--dns-name-label aci-demo-$RANDOM \
--port 8080 \
--registry-username $(az keyvault secret show --vault-name keyvault-wavecount -n wavecountcontainerregistry01-pull-usr --query value -o tsv) \
--registry-password $(az keyvault secret show --vault-name keyvault-wavecount -n wavecountcontainerregistry01-pull-pwd --query value -o tsv) \
--dns-name-label aci-demo-$RANDOM \
--query ipAddress.fqdn \
--restart-policy onFailure \
--environment-variables 'password'='Pa55word'
```

### Mount an Azure file share in Azure Container Instances

By default, Azure Container Instances are stateless. If the container crashes or stops, all of its state is lost. To persist state beyond the lifetime of the container, you must mount a volume from an external store. As shown in this unit, Azure Container Instances can mount an Azure file share created with Azure Files. Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard Server Message Block (SMB) protocol. Using an Azure file share with Azure Container Instances provides file-sharing features similar to using an Azure file share with Azure virtual machines.

## Azure Container Apps

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform that runs on top of Azure Kubernetes Service. Common uses of Azure Container Apps include:

- Deploying API endpoints
- Hosting background processing applications
- Handling event-driven processing
- Running microservices

### Azure Container Apps environments

Individual container apps are deployed to a single Container Apps environment, which acts as a secure boundary around groups of container apps. Container Apps in the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. You might provide an existing virtual network when you create an environment.

### Reasons to deploy container apps to the same environment include situations when you need to

- Manage related services
- Deploy different applications to the same virtual network
- Instrument Dapr applications that communicate via the Dapr service invocation API
- Have applications to share the same Dapr configuration
- Have applications share the same log analytics workspace

### Reasons to deploy container apps to different environments include situations when you want to ensure

- Two applications never share the same compute resources
- Two Dapr applications can't communicate via the Dapr service invocation API

### Deploy

First we need create Container App Environment fot App, Just like App Service for Function App
Container App Environment:

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

```azurecli
az extension add --name containerapp --upgrade
az provider register --namespace Microsoft.App
```

```azurecli
az containerapp env create \
    --name $myAppContEnv \
    --resource-group $myRG \
    --location $myLocation
```

Container App:

```azurecli
az containerapp create \
    -n my-container-app \
    -g $myRG  \
    --environment $myAppContEnv \
    --image wavecountcontainerregistry01.azurecr.io/go-sample:latest \
    --registry-server wavecountcontainerregistry01.azurecr.io \
    --target-port 8080 \
    --ingress 'external' \
    --query properties.configurations.ingress.fqdn \
    --secrets 'blob-con-name=$CONNECTION_STRING' \
    --env-vars 'BlobContainer=mycontainer' 'ConnectionString=secretref:blob-con-string'
```

### Features

Configurations:

The following code is an example of the containers array in the properties.template section of a container app resource template. The excerpt shows some of the available configuration options when setting up a container when using Azure Resource Manager (ARM) templates. Changes to the template ARM configuration section trigger a new container app revision.

```json
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

```json
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

### Implement authentication and authorization in Azure Container Apps

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

Any OpenID Connect provider `/.auth/login/<providerName>` OpenID Connect

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

### Updating your container app

```azurecli
az containerapp update \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --image <IMAGE_NAME>
```

```azurecli
az containerapp revision list \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  -o table
```

### Manage secrets in Azure Container Apps

Azure Container Apps allows your application to securely store sensitive configuration values. Once secrets are defined at the application level, secured values are available to container apps. Specifically, you can reference secured values inside scale rules.

- Secrets are scoped to an application, outside of any specific revision of an application.
- Adding, removing, or changing secrets doesn't generate new revisions.
- Each application revision can reference one or more secrets.
- Multiple revisions can reference the same secrets.

An updated or deleted secret doesn't automatically affect existing revisions in your app. When a secret is updated or deleted, you can respond to changes in one of two ways:

- Deploy a new revision.
- Restart an existing revision.

Before you delete a secret, deploy a new revision that no longer references the old secret. Then deactivate all revisions that reference the secret.

_Note:_
Container Apps doesn't support Azure Key Vault integration. Instead, enable managed identity in the container app and use the Key Vault SDK in your app to access secrets.

```azurecli
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --image demos/queuereader:v1 \
  --environment "my-environment-name" \
  --secrets "queue-connection-string=$CONNECTION_STRING"
```

After declaring secrets at the application level, you can reference them in environment variables when you create a new revision in your container app.
When an environment variable references a secret, its value is populated with the value defined in the secret. To reference a secret in an environment variable in the Azure CLI, set its value to secretref:, followed by the name of the secret.

```azurecli
az containerapp create \
  --resource-group "my-resource-group" \
  --name myQueueApp \
  --environment "my-environment-name" \
  --image demos/myQueueApp:v1 \
  --secrets "queue-connection-string=$CONNECTIONSTRING" \
  --env-vars "QueueName=myqueue" "ConnectionString=secretref:queue-connection-string"
```

### Dapr integration with Azure Container Apps

Dapr core concepts:

![alt text](https://learn.microsoft.com/en-us/training/wwl-azure/implement-azure-container-apps/media/distributed-application-runtime-container-apps.png)

| Label | Dapr settings | Description |
|-----|------|-----------------|-----------|
| 1.    | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring a set of Dapr arguments. These values apply to all revisions of a given container app when running in multiple revisions mode.|
| 2.    | Dapr | The fully managed Dapr APIs are exposed to each container app through a Dapr sidecar. The Dapr APIs can be invoked from your container app via HTTP or gRPC. The Dapr sidecar runs on HTTP port 3500 and gRPC port 50001. |
| 3.    | Dapr component configuration | Dapr uses a modular design where functionality is delivered as a component. Dapr components can be shared across multiple container apps. The Dapr app identifiers provided in the scopes array dictate which dapr-enabled container apps load a given component at runtime.|

#### Dapr components and scopes

Dapr uses a modular design where functionality is delivered as a component. The use of Dapr components is optional and dictated exclusively by the needs of your application.

Dapr components in container apps are environment-level resources that:

- Can provide a pluggable abstraction model for connecting to supporting external services.
- Can be shared across container apps or scoped to specific container apps.
- Can use Dapr secrets to securely retrieve configuration metadata.

By default, all Dapr-enabled container apps within the same environment load the full set of deployed components. To ensure components are loaded at runtime by only the appropriate container apps, application scopes should be used.

Compare ACA vs AKS:
<https://techcommunity.microsoft.com/t5/startups-at-microsoft/aca-vs-aks-which-azure-service-is-better-for-running-containers/ba-p/3815164>

### Service Connector

Service Connector helps you connect Azure compute services to other backing services. Service Connector configures the network settings and connection information (for example, generating environment variables) between compute services and target backing services in management plane. Developers use their preferred SDK or library that consumes the connection information to do data plane operations against the target backing service.

Benefits:

Service Connector offers several advantages, especially for developers working with Azure services. Here are some key benefits:

1. **Simplified Connections**: Service Connector allows you to connect Azure compute services to other backing services with just a single command or a few clicks. This reduces the complexity of configuring network settings and connection information¹.

2. **Ease of Use**: It provides a user-friendly experience through the Azure CLI or the Azure portal, making it accessible even for those who may not be deeply familiar with networking configurations¹.

3. **Monitoring and Troubleshooting**: Service Connector includes features to monitor the health status of your connections and suggest actions to fix any broken connections¹.

4. **Broad Compatibility**: It supports a wide range of Azure services, including Azure App Service, Azure Functions, Azure Kubernetes Service (AKS), and many more¹.

5. **Focus on Business Logic**: By abstracting away the complexity of service wiring and connection management, developers can focus more on building their business logic rather than dealing with the intricacies of service configurations³.

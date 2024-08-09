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
az container create  --resource-group az-204-rg --name aci-demo --image wavecountcontainerregistry01.azurecr.io/go-sample:latest  --dns-name-label aci-demo-$RANDOM --port 8080 --registry-username $(az keyvault secret show --vault-name keyvault-wavecount -n wavecountcontainerregistry01-pull-usr --query value -o tsv) --registry-password $(az keyvault secret show --vault-name keyvault-wavecount -n wavecountcontainerregistry01-pull-pwd --query value -o tsv) --dns-name-label aci-demo-$RANDOM --query ipAddress.fqdn --restart-policy onFailure --environment-variables 'password'='Pa55word'
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

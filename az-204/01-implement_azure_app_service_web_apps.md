# Implement Azure App Service web apps

## Contencts

- [Explore App Service](#explore-app-service)
  - [Azure App Service plans](#azure-app-service-plans)

## Explore App Service

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends.

- **built-in auto scaling:** scale up/down and in/out based on usage
- **container support:** You can deploy and run containerized web apps on Windows and Linux. You can pull container images from a private Azure Container Registry or Docker Hub. Azure App Service also supports multi-container apps, Windows containers, and Docker Compose for orchestrating container instances.
- **CI/CD support:** provides out-of-the-box CI/CD with Azure DevOps Services, GitHub, Bitbucket, FTP, or a local Git repository on your development machine. for containerized web apps is also supported using either Azure Container Registry or Docker Hub.
- **Deployment slots:** When you deploy your web app you can use a separate deployment slot instead of the default production slot when you're running in the Standard App Service Plan tier or better.

### Azure App Service plans:

## Tiers:

- **Shared compute:** Free and Shared, the two base tiers, runs an app on the same Azure VM as other App Service apps, including apps of other customers. These tiers allocate CPU quotas to each app that runs on the shared resources, and the resources can't scale out.These tiers are intended to be used only for development and testing purposes.
- **Dedicated compute:** The Basic, Standard, Premium, PremiumV2, and PremiumV3 tiers run apps on dedicated Azure VMs. Only apps in the same App Service plan share the same compute resources. The higher the tier, the more VM instances are available to you for scale-out.
- **Isolated:** The Isolated and IsolatedV2 tiers run dedicated Azure VMs on dedicated Azure Virtual Networks. It provides network isolation on top of compute isolation to your apps. It provides the maximum scale-out capabilities.

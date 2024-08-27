# secure Azure solutions

The Azure Key Vault service supports two types of containers: vaults and managed hardware security module(HSM) pools. Vaults support storing software and HSM-backed keys, secrets, and certificates. Managed HSM pools only support HSM-backed keys.

Azure Key Vault helps solve the following problems:

https://learn.microsoft.com/en-us/azure/key-vault/general/security-features

- Secrets Management: Azure Key Vault can be used to Securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets
- Key Management: Azure Key Vault can also be used as a Key Management solution. Azure Key Vault makes it easy to create and control the encryption keys used to encrypt your data.
- Certificate Management: Azure Key Vault is also a service that lets you easily provision, manage, and deploy public and private Secure Sockets Layer/Transport Layer Security (SSL/TLS) certificates for use with Azure and your internal connected resources.

Azure Key Vault has two service tiers: Standard, which encrypts with a software key, and a Premium tier, which includes hardware security module(HSM)-protected keys, Azure Key Vaults may be either software-protected or, with the Azure Key Vault Premium tier, hardware-protected by hardware security modules (HSMs).

## Some security tips:

- You can reduce the exposure of your vaults by specifying which IP addresses have access to them. The virtual network service endpoints for Azure Key Vault allow you to restrict access to a specified virtual network. After firewall rules are in effect, users can only read data from Key Vault when their requests originate from allowed virtual networks or IPv4 address ranges.

## Benefits:

- Centralized application secrets: Your applications can securely access the information they need by using URIs. These URIs allow the applications to retrieve specific versions of a secret.
- Securely store secrets and keys (Access model):

  - Authentication is done via Microsoft Entra ID.
    Authorization may be done via Azure role-based access control (Azure RBAC) or Key Vault access policy.

  - Access to a key vault is controlled through two interfaces: the management plane and the data plane. The management plane is where you manage Key Vault itself. Operations in this plane include creating and deleting key vaults, retrieving Key Vault properties, and updating access policies. The data plane is where you work with the data stored in a key vault. You can add, delete, and modify keys, secrets, and certificates.

  - Both planes use Microsoft Entra ID for authentication. For authorization, the management plane uses Azure role-based access control (Azure RBAC) and the data plane uses a Key Vault access policy and Azure RBAC for Key Vault data plane operations.

- Monitor access and use: Azure Key Vault can be configured to:

  - Archive to a storage account.
  - Stream to an event hub.
  - Send the logs to Azure Monitor logs.

- Simplified administration of application secrets:
  - Automating certain tasks on certificates that you purchase from Public CAs, such as enrollment and renewal.

## Authentication:

To do any operations with Key Vault, you first need to authenticate to it. There are three ways to authenticate to Key Vault:

- Managed identities for Azure resources: When you deploy an app on a virtual machine in Azure, you can assign an identity to your virtual machine that has access to Key Vault. You can also assign identities to other Azure resources. The benefit of this approach is that the app or service isn't managing the rotation of the first secret. Azure automatically rotates the service principal client secret associated with the identity. We recommend this approach as a best practice.
- Service principal and certificate: You can use a service principal and an associated certificate that has access to Key Vault. We don't recommend this approach because the application owner or developer must rotate the certificate.
- Service principal and secret: Although you can use a service principal and a secret to authenticate to Key Vault, we don't recommend it. It's hard to automatically rotate the bootstrap secret that's used to authenticate to Key Vault.

## Azure Key Vault best practices

- Use separate key vaults: Recommended using a vault per application per environment (Development, Pre-Production and Production). This pattern helps you not share secrets across environments and also reduces the threat if there is a breach.
- Control access to your vault
- Recovery options: Turn on soft-delete
- Logging
- Backup: Create regular back ups of your vault on update/delete/create of objects within a Vault.

Authentication best practices

We recommend that you use a managed identity for applications deployed to Azure. If you use Azure services that don't support managed identities or if applications are deployed on-premises, a service principal with a certificate is a possible alternative. In that scenario, the certificate should be stored in Key Vault and frequently rotated.

Use a service principal with a secret for development and testing environments. Use a user principal for local development and Azure Cloud Shell.

We recommend these security principals in each environment:

- Production environment: Managed identity or service principal with a certificate.
- Test and development environments: Managed identity, service principal with certificate, or service principal with a secret.
- Local development: User principal or service principal with a secret.

https://learn.microsoft.com/en-us/azure/key-vault/general/developers-guide

When to use @azure/identity

The credential classes exposed by @azure/identity are focused on providing the most straightforward way to authenticate the Azure SDK clients locally, in your development environments, and in production.

Application requests to most Azure services must be authorized. Using the _DefaultAzureCredential_ method provided by the **Azure Identity client library** is the recommended approach for implementing passwordless connections to Azure services in your code. _DefaultAzureCredential_ supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

In this quickstart, _DefaultAzureCredential_ authenticates to key vault using the credentials of the local development user logged into the Azure CLI. When the application is deployed to Azure, the same _DefaultAzureCredential_ code can automatically discover and use a managed identity that is assigned to an App Service, Virtual Machine, or other services. For more information, see Managed Identity Overview.

- By default, when you create a new Azure Key Vault, no users (including the creator) have permissions to access or manage the secrets, keys, or certificates stored within it. This is a security measure to ensure that only explicitly granted users or applications can access the sensitive data.

```
 az role assignment create --role "Key Vault Secrets Officer" --assignee <user-objectId $(az ad signed-in-user show --query id -o tsv) $(az ad user show  --id email@example.tld --query id -o tsv)> --scope $(az keyvault show --name kv-frc-demo -g rg-demo --query id -o tsv)
```

```
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { KeyClient } from "@azure/keyvault-keys";

const credential = new DefaultAzureCredential();
const client = new SecretClient(
  "https://kv-frc-demo.vault.azure.net/",
  credential
);

async function run() {
  const poll = await client.beginRecoverDeletedSecret("key-01");
  await poll.pollUntilDone();
  const saved = await client.setSecret("key-01", "navid");
  console.log(saved);

  const deletePoller = await client.beginDeleteSecret("key-01");
  await deletePoller.pollUntilDone();
  await client.purgeDeletedSecret("key-01");
}

run();
```

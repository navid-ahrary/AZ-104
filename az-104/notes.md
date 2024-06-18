# AZ-104 Microsoft Azure Administrator

## Table of contents
- [Manage Identities and Governance](#manage-identities-and-governance)
    - [Entra ID](#entra-id)
        - [Usage](#usage)
        - [Entra ID vs Active Directory Domain Service](#entra-id-vs-active-directory-domain-service)


## Manage Identities and Governance
Learn how to manage Azure Active Directory objects, role-based access control (RBAC), subscriptions, and governance in Azure.

### Entra ID
This module explains Microsoft Entra ID. You'll compare Microsoft Entra ID to Active Directory DS, learn about Microsoft Entra ID P1 and P2, and explore Microsoft Entra Domain Services for managing domain-joined devices and apps in the cloud.

Microsoft Entra ID is a cloud-based identity and access management service provided by Microsoft. Microsoft Entra ID is a comprehensive solution for managing identities, enforcing access policies, and securing your applications and data in the cloud and on-premises.

#### Usage:
   * Configuring access to applications
   * Configuring single sign-on (SSO) to cloud-based SaaS applications
   * Managing users and groups
   * Provisioning users
   * Enabling federation between organizations
   * Providing an identity management solution
   * Identifying irregular sign-in activity
   * Configuring multi-factor authentication
   * Extending existing on-premises Active Directory implementations to Microsoft Entra ID
   * Configuring Application Proxy for cloud and local applications
   * Configuring Conditional Access for users and devices

Microsoft Entra constitutes a separate Azure service. Its most elementary form, which any new Azure subscription includes automatically, doesn't incur any extra cost and is referred to as the Free tier. If you subscribe to any Microsoft Online business services (for example, Microsoft 365 or Microsoft Intune), you automatically get Microsoft Entra ID with access to all the Free features.

At any given time, an Azure subscription must be associated with one, and only one, Microsoft Entra tenant. This association allows you to grant permissions to resources in the Azure subscription (via RBAC) to users, groups, and applications that exist in that particular Microsoft Entra tenant.

* Note:
You can associate the same Microsoft Entra tenant with multiple Azure subscriptions. This allows you to use the same users, groups, and applications to manage resources across multiple Azure subscriptions


#### Entra ID vs Active Directory Domain Service:
    * Implementing Microsoft Entra ID isn't the same as deploying virtual machines in Azure, adding AD DS, and then deploying some domain controllers for a new forest and domain. Microsoft Entra ID is a different service, much more focused on providing identity management services to web-based apps, unlike AD DS, which is more focused on on-premises apps.
    * Unlike AD DS, Microsoft Entra ID is multi-tenant by design and is implemented specifically to ensure isolation between its individual directory instances.



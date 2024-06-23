# Terraform in Azure

## Contents

    - [Remote State](#remote-state)

### Remote State

In Azure, we use **azurerm** backend. The backend is an Azure Storage because the storage support:
_ File locking
_ Shared access signature (SAS) with specified authorization on operations

A Storage should be provisioned at the first, then the local state will be migrating the state into it.

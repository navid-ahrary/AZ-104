# Terraform in Azure

## Table of Contents

- [Remote State](#remote-state)

### Remote State

In Azure, we use **azurerm** backend. The backend is a block in _Terraform_ block like this:

```
Terraform {
        backend "azurerm" {
            key = "value"
            storage_account_name = "value"
            container_name = "value"
            sas_token = "value"
        }
}
```

The backend is an _Azure Storage Account_ that is store the state file in a container.

Benefit of Storage Account:

- File locking
- Shared access signature (SAS) with specified authorization on operations: read, write, update, delete, etc

A Storage should be provisioned at the first, then the local state will be migrating the state into it.

# Storage Account

In this module you learned how to:

- Describe how each of the access tiers is optimized.
- Create and implement a lifecycle policy.
- Rehydrate blob data stored in an archive tier.

## Types of storage accounts

Azure Storage offers two performance levels of storage accounts, standard and premium.

- Standard: This is the standard general-purpose v2 account and is recommended for most scenarios using Azure Storage.
- Premium: Premium accounts offer higher performance by using solid-state drives. If you create a premium account you can choose between three account types, _block blobs_, _page blobs_, or _file shares_.

## Blobs

Azure Storage supports three types of blobs:

- Block blobs store text and binary data. Block blobs are made up of blocks of data that can be managed individually. Block blobs can store up to about 190.7 TiB.
- Append blobs are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.
- Page blobs store random access files up to 8 TB in size. Page blobs store virtual hard drive (VHD) files and serve as disks for Azure virtual machines.

The available **access** tiers for _block blob_ are:

- The Hot access tier, which is optimized for frequent access of objects in the storage account. The Hot tier has the highest storage costs, but the lowest access costs. New storage accounts are created in the hot tier by default.
- The Cool access tier, which is optimized for storing large amounts of data that is infrequently accessed and stored for a minimum of 30 days. The Cool tier has lower storage costs and higher access costs compared to the Hot tier.
- The Cold access tier, which is optimized for storing data that is infrequently accessed and stored for a minimum of 90 days. The cold tier has lower storage costs and higher access costs compared to the cool tier.
- The Archive tier, which is available only for individual block blobs. The archive tier is optimized for data that can tolerate several hours of retrieval latency and remains in the Archive tier for a minimum 180 days. The archive tier is the most cost-effective option for storing data, but accessing that data is more expensive than accessing data in the hot or cool tiers.

### Encryption key management

Data in a new storage account is encrypted with Microsoft-managed keys by default. You can continue to rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options. You can use either type of key management, or both:

- You can specify a customer-managed key to use for encrypting and decrypting data in Blob Storage and in Azure Files.Customer-managed keys must be stored in Azure Key Vault or Azure Key Vault Managed Hardware Security Model (HSM).
- You can specify a customer-provided key on Blob Storage operations. A client can include an encryption key on a read/write request for granular control over how blob data is encrypted and decrypted. We can use it for our applicatin customer to store each customer files with their encryption key.

## Policy

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "sample-rule",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "version": {
            "delete": {
              "daysAfterCreationGreaterThan": 90
            }
          },
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90,
              "daysAfterLastTierChangeGreaterThan": 7
            },
            "delete": {
              "daysAfterModificationGreaterThan": 2555
            }
          }
        },
        "filters": {
          "blobTypes": [
            "blockBlob"
          ],
          "prefixMatch": [
            "sample-container/blob1"
          ]
        }
      }
    }
  ]
}
```

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "move-to-cool",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            }
          }
        },
        "filters": {
          "blobTypes": [
            "blockBlob"
          ],
          "prefixMatch": [
            "sample-container/log"
          ]
        }
      }
    }
  ]
}
```

```azurecli
az storage account management-policy create --account-name <storage-account> --policy @policy.json --resource-group <resource-group>
```

```Terraform
resource "azurerm_storage_management_policy" "policy" {
  storage_account_id = azurerm_storage_account.stg.id

  rule {
    enabled = true
    name    = "rule1"
    filters {
      blob_types   = ["bloclBlob"]
      prefix_match = ["logContainer/log"]
    }
    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than = 30
      }
    }
  }
}
```

## Rehydration blob data from archive

Archive blob is an offline blob.

Possible hydration destinations are Cool and Hot

two ways to do this:

1. Copy an archived blob to an online blob (Cool, Hot access tier) using `Copy Blob` and `Copy Blob from URL` [Recommened]
2. Change the blob's access tier to an online tier (Cool, Hot) using `Set Blob Tier` operation.

Reydrate a blob from an offline blob taks a couple of hours.

## Rehydration Priority

Set `x-ms-rehydarte-priority` header on `Copy Blob/Copy Blob from URL` and `Set Blob Tier` operations:

- Standard priority: takes up to 15 hours
- High priority: might complete in under 1 hour for objects under 10 GB in size

To check the rehydration priority while the rehydration operation is underway, call `Get Blob Properties` to return the value of the x-ms-rehydrate-priority header. The rehydration priority property returns either Standard or High.

## Copy an archived blob to an online tier

When you copy an archived blob to a new blob in an online tier, the source blob remains unmodified in the archive tier. You must copy the archived blob to a new blob with a different name or to a different container. You can't overwrite the source blob by copying to the same blob.
Beginning with service version 2021-02-12, you can rehydrate an archived blob by copying it to a different storage account, as long as the destination account is in the same region as the source account.

## Change a blob's access tier to an online tier

Once a Set Blob Tier request is initiated, it can't be canceled. During the rehydration operation, the blob's access tier setting continues to show as archived until the rehydration process is complete.

```azurecli
az storage blob set-tier --account-name mystorageaccount --container-name mycontainer --name myblob --tier Hot --rehydrate-priority High
```

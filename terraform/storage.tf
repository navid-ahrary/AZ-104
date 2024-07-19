terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.112.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_storage_account" "stg" {
  name                     = "mystorage"
  resource_group_name      = "rg"
  account_tier             = "Standard"
  account_replication_type = "GLR"
  location                 = "Germany West"
}

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

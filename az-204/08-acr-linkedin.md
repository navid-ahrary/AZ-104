# How to provisoin Azure Contianer App With Azure Cli

## Install the latest version Azure Cli with pip

```
pip3 install --upgrade azure-cli
```

## Login

```
 az login
```

## Add conatiner app extension to azure cli

```
az extension add --name containerapp --upgrade

az provider register --namespace Microsoft.App
```

## Create resource group

```
export RGNAME="rg-myapp-frc-dev"

export LOCATION="francecentral"

az group create --name "$RGNAME" \
    --location "$LOCATION"
```

## Create Container Registry (ACR):

```
export ACRNAME="acr-myapp-frc-dev-01"

az acr create --resource-group "$RGNAME" \
    --name "$ACRNAME" --sku Basic
```

## Create Image and Upload to Registry

```
echo 'FROM golang:1.22.6-alpine' > Dockerfile
echo 'ENTRYPOINT ["go", "version"]' >> Dockerfile

az acr build --image sample/hello-world:latest  \
    --registry "$ACRNAME" \
    --file Dockerfile .
```

## Create Service Principal for pull access on ACR:

```
az ad sp create-for-rbac \
    --name acr-pull
    --role acrpull
    --scope $(az acr show -n "$ACRNAME" --query id -o tsv)
```

## Create Azure Key Vault to store service pricipals securely

```
export KVNAME="kv-myapp-frc-dev-01"

az keyvault create --resource-group "$RGNAME" \
    --name "$KVNAME" \
    --location "$LOCATION"
    --enable-rbac-authorization

az keyvault secret set --vault-name "$KVNAME" \
    --name wavecountcontainerregistry01-pull-usr \
    --value a2d08746-cfbc-423a-af4a-58077d6fe564
```

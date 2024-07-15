## View outbound ips

`az webapp show --resource-group <> --name <> --query outboundIpAddresses|possibleOutboundIpAddresses --output tsv`

## Adding app settings with az cli

`az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings key1=value1 key2=value2`

## Creating a free managed certificate

To create custom TLS/SSL bindings or enable client certificates for your App Service app, your App Service plan must be in the Basic, Standard, Premium, or Isolated tier.

If you want to use a private certificate in App Service, your certificate must meet the following requirements:

- Exported as a password-protected PFX file, encrypted using triple DES.
- Contains private key at least 2048 bits long.
- Contains all intermediate certificates and the root certificate in the certificate chain.

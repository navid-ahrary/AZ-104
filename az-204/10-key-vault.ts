import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { KeyClient } from "@azure/keyvault-keys";

const KEY_VAULT_URL = "https://kv-frc-demo.vault.azure.net/";

// for user-managed identity
const credential = new DefaultAzureCredential({ managedIdentityClientId: "" });

async function runSecret() {
  const client = new SecretClient(KEY_VAULT_URL, credential);
  const poll = await client.beginRecoverDeletedSecret("key-01");
  await poll.pollUntilDone();
  const saved = await client.setSecret("key-01", "navid");
  console.log(saved);

  const deletePoller = await client.beginDeleteSecret("key-01");
  await deletePoller.pollUntilDone();
  await client.purgeDeletedSecret("key-01");
}

async function runKey() {
  const client = new KeyClient(KEY_VAULT_URL, credential);

  await client.createRsaKey("MyKey", { keySize: 4096 });
}

runSecret();
runKey();

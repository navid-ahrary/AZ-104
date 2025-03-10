import { ChangeFeedStartFrom, CosmosClient, StatusCodes } from "@azure/cosmos";

const ENDPOINT = process.env.ENDPOINT ?? "";
const KEY = process.env.KEY ?? "";
const DATABASE_ID = "Certificates";
const CONTAINER_ID = "AZ-204";
const PARTITION_KEY = "/id";

async function main() {
  const client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
  const db = await client.databases.createIfNotExists({
    id: DATABASE_ID,
  });
  const container = await db.database.containers.createIfNotExists({
    id: CONTAINER_ID,
    partitionKey: PARTITION_KEY,
  });
  await container.container.items.upsert({
    id: "id-01",
    name: "Navid Ahrary",
    date: new Date(),
  });

  const { resources } = await container.container.items
    .query({
      query: "SELECT * FROM Certificates c WHERE c.name = @name ",
      parameters: [{ name: "@name", value: "Navid Ahrary" }],
    })
    .fetchAll();

  console.log("Query result:", resources);
}

async function handleChangeFeed() {
  const client = new CosmosClient({
    endpoint: ENDPOINT,
    key: KEY,
    consistencyLevel: "Session",
  });

  const db = client.database(DATABASE_ID);
  const container = db.container(CONTAINER_ID);
  const iterator = container.items
    .getChangeFeedIterator({
      changeFeedStartFrom: ChangeFeedStartFrom.Now(),
    })
    .getAsyncIterator();

  for await (const res of iterator) {
    if (res.statusCode === StatusCodes.NotModified) {
      await new Promise((res) => {
        setTimeout(res, 2000);
      });
    } else {
      const re = res.result;
      console.log("changes occurred", re);
    }
  }
}

handleChangeFeed();
main();

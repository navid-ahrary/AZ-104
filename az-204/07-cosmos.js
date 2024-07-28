const { CosmosClient } = require('@azure/cosmos')

const DATABASE_ID = "Certificates"
const CONTAINER_ID = "Microsoft Azure"

async function main() {    // const endpoint = ""
    const client = new CosmosClient({ endpoint: '', key: '' })
    const db = await client.databases.createIfNotExists({
        id: DATABASE_ID,
        throughput: 400
    })
    const container = await db.database.containers.createIfNotExists({
        id: CONTAINER_ID, partitionKey: {
            paths: ["/partitionKey"],
            kind: "Hash"
        }
    });
    const items = await container.container.items.create({
        "id": "item-01",
        "name": "Azure Fundamental Certificate",
        "cert": "AZ-900"
    },)

    const q = await container.container.items
        .query({
            query: "SELECT * FROM Certificates WHERE cert = @cert",
            parameters: [{ name: 'cert', value: 'AZ-900' }]
        })
        .fetchAll()
}

main()
const { BlobServiceClient } = require('@azure/storage-blob')
const fs = require('node:fs/promises');

async function main() {

    const client = BlobServiceClient.fromConnectionString('')

    // const c = await client.createContainer('test')
    // console.log(c.containerClient.url);

    const containerClient = client.getContainerClient('test')
    console.log('container url:', containerClient.url);

    console.log(await containerClient.getProperties())

    await containerClient.setMetadata({})

    const data = await fs.readFile('./yarn.lock', { encoding: 'utf8' });
    const blobClient = containerClient.getBlockBlobClient('yarn.lock')
    await blobClient.upload(data, Buffer.byteLength(data))

    let i = 1
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`Blob ${i++}: ${blob.name}`);
        const blobClient = containerClient.getBlockBlobClient(blob.name)
        await blobClient.downloadToFile(`./${blob.name}`)
        await blobClient.deleteIfExists()
    }

}


main()



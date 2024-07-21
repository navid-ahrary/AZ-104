const { BlobServiceClient } = require('@azure/storage-blob')
const fs = require('node:fs/promises');

async function main() {

    const client = BlobServiceClient.fromConnectionString('SharedAccessSignature=sv=2023-01-03&ss=btqf&srt=sco&st=2024-07-21T19%3A14%3A19Z&se=2024-07-22T19%3A14%3A19Z&sp=rwlc&sig=yIDnEtwClLuR34l52g9XUxqRkuV4uBZKVLUCEpVJ%2Ftg%3D;BlobEndpoint=https://peoplecount9ac7.blob.core.windows.net/;FileEndpoint=https://peoplecount9ac7.file.core.windows.net/;QueueEndpoint=https://peoplecount9ac7.queue.core.windows.net/;TableEndpoint=https://peoplecount9ac7.table.core.windows.net/;')

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



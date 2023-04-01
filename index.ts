import axios, { AxiosInstance, AxiosResponse } from 'axios';

const YT_API_KEY = process.env.YT_API_KEY;

async function getAxiosInstance():Promise<AxiosInstance> {
    const cli = await axios.create({
        baseURL: `https://www.googleapis.com/youtube/v3`
    })

    return cli;
}

function insertData(d: {[key: string]: any}) {
    for (const comment of d.data.items) {
        console.log(comment.snippet);
    }
}

async function iterateNextPage(videoId: string, nextPageToken: string) {
    const client = await getAxiosInstance();
    const d = await client.get(`/commentThreads?key=${YT_API_KEY}&part=snippet&videoId=${videoId}&pageToken=${nextPageToken}`)
    insertData(d);
    while(!d.data.nextPageToken) {
        await iterateNextPage(videoId, d.data.nextPageToken);
    }
}

async function getAllComments(videoId: string) {
    const client = await getAxiosInstance();
    const d = await client.get(`/commentThreads?key=${YT_API_KEY}&part=snippet&videoId=${videoId}`)
    await iterateNextPage(videoId, d.data.nextPageToken);

}

getAllComments(`vMpaSBYh5pA`).catch(e => {
    console.log(JSON.stringify(e));
})


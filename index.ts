import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { build_elasticsearch_index } from './es_utils';

const YT_API_KEY = process.env.YT_API_KEY;

async function getAxiosInstance():Promise<AxiosInstance> {
    const cli = await axios.create({
        baseURL: `https://www.googleapis.com/youtube/v3`
    })

    return cli;
}

async function insertData(d: {[key: string]: any}) {
    for (const comment of d.data.items) {
        await build_elasticsearch_index(comment);
    }
}

async function iterateNextPage(videoId: string, nextPageToken: string): Promise<void> {
    const client = await getAxiosInstance();
    const d = await client.get(`/commentThreads?key=${YT_API_KEY}&part=snippet&videoId=${videoId}&pageToken=${nextPageToken}`)
    if(!d.data.nextPageToken) {
        console.log('All comments are indexed');
        return;
    }
    await insertData(d);
    
    while(d.data.nextPageToken) {
        await iterateNextPage(videoId, d.data.nextPageToken);
        return;
    }

}

async function getAllComments(videoId: string): Promise<void> {
    const client = await getAxiosInstance();
    const d = await client.get(`/commentThreads?key=${YT_API_KEY}&part=snippet&videoId=${videoId}`)
    await insertData(d);
    await iterateNextPage(videoId, d.data.nextPageToken);
}

getAllComments(`vMpaSBYh5pA`).catch(e => {
    console.log(JSON.stringify(e));
})


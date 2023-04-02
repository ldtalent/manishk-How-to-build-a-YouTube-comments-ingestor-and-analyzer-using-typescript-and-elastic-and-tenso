import {Client} from '@elastic/elasticsearch';
import { IndicesPutMappingRequest } from '@elastic/elasticsearch/lib/api/types';

const INDEX_NAME = `es-yt-comments-ingestor`;

const esclient = new Client({
    node: `http://localhost:9200`
});

export async function create_mapping(schema: any) {
    await esclient.indices.putMapping(schema);
}

export async function insert_data(body: {[key: string]: unknown}) {
    await esclient.index({
        index: INDEX_NAME,
        body
    });
}

export async function test() {
    try {
    await esclient.ping({}, {requestTimeout: 30000});
    console.log(`Elasticsearch is running!`);
    }catch(e) {
        throw new Error(`Elasticsearch cluster is down!`);
    }
}

export async function build_elasticsearch_index(body: {[key: string]: unknown}) {
    await test();
    await insert_data(body);

}
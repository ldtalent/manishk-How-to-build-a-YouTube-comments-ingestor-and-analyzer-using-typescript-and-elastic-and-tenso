import {Client} from '@elastic/elasticsearch';
import { IndicesPutMappingRequest } from '@elastic/elasticsearch/lib/api/types';

const INDEX_NAME = `es-yt-comments-ingestor`;

const esclient = new Client({
    node: `http://localhost:9200`
});

export async function create_mapping(schema: IndicesPutMappingRequest) {
    if (!await esclient.indices.getMapping({index: INDEX_NAME})) {
    await esclient.indices.putMapping(schema);
    }
    console.log('ES Schema already exists');
}

export async function insert_data(body: {[key: string]: unknown}) {
    if (!await esclient.indices.exists({index: INDEX_NAME})) {
        await esclient.indices.create({index: INDEX_NAME})
    }
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
    await create_mapping(schema);
    await insert_data(body);

}
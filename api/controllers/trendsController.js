"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendsController = void 0;
const express_1 = __importDefault(require("express"));
//import Post from './post.interface';
const { Client } = require("@elastic/elasticsearch");
class TrendsController {
    /*private posts: Post[] = [
      {
        author: 'Marcin',
        content: 'Dolor sit amet',
        title: 'Lorem Ipsum',
      }
    ];*/
    constructor() {
        this.path = "/api/trends";
        this.router = express_1.default.Router();
        this.getTopicTrends = async (request, response) => {
            const body = {
                aggs: {
                    "2": {
                        date_histogram: {
                            field: "createdAt",
                            calendar_interval: "1y",
                            time_zone: "Atlantic/Reykjavik",
                            min_doc_count: 1,
                        },
                    },
                },
                size: 0,
                stored_fields: ["*"],
                script_fields: {},
                docvalue_fields: [{ field: "createdAt", format: "date_time" }],
                _source: { excludes: [] },
                query: {
                    bool: {
                        must: [],
                        filter: [
                            { match_all: {} },
                            { match_phrase: { topic: request.query.topic } },
                            {
                                range: {
                                    createdAt: {
                                        gte: "2006-03-01T01:57:35.660Z",
                                        lte: "2021-03-01T01:57:35.660Z",
                                        format: "strict_date_optional_time",
                                    },
                                },
                            }
                        ],
                        should: [],
                        must_not: [
                            { "term": { "relevanceScore": 0 } },
                            { "term": { "relevanceScore": 3 } },
                        ],
                    },
                },
            };
            try {
                const result = await this.esClient.search({
                    index: "urls",
                    body: body,
                });
                response.send(result.body.aggregations["2"].buckets);
                console.log(result);
            }
            catch (ex) {
                console.error(ex);
                response.sendStatus(500);
            }
        };
        this.getTopicQuotes = async (request, response) => {
            let returnQuotes = [];
            const years = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
            const must = [];
            const mustNot = [];
            must.push({ "term": { "relevanceScore": 1 } });
            must.push({ "term": { "secondRelevanceScore": 1 } });
            if (request.query.topic == "Left behind") {
                //must.push({"match": {"paragraph": ".*eft behind.*" }});
                //must.push({"match": {"paragraph": ".*global.*" }});
                //must.push({"match": {"subTopic": "Globalism" }});
            }
            if (request.query.topic == "Resentment of elite") {
                mustNot.push({ "match": { "subTopic": "Climate denial" } });
            }
            /*must.push({
              "script": {
                "script": "doc['paragraph'].length < 100"
              }
            })*/
            for (let i = 0; i < years.length; i++) {
                const year = years[i];
                const body = {
                    from: 0,
                    size: 1,
                    query: {
                        function_score: {
                            query: {
                                bool: {
                                    "must": must,
                                    filter: [
                                        { match_all: {} },
                                        { match_phrase: { topic: request.query.topic } },
                                        {
                                            range: {
                                                createdAt: {
                                                    gte: `${year}-01-01T00:00:00.000Z`,
                                                    lte: `${year}-12-31T23:59:59.990Z`,
                                                    format: "strict_date_optional_time",
                                                },
                                            },
                                        },
                                        {
                                            range: {
                                                pageRank: {
                                                    gte: 0,
                                                    lte: 100000000,
                                                    format: "strict_date_optional_time",
                                                },
                                            },
                                        },
                                    ],
                                    should: [],
                                    must_not: mustNot,
                                },
                            },
                            random_score: {},
                        }
                    },
                };
                try {
                    const result = await this.esClient.search({
                        index: "urls",
                        body: body,
                    });
                    returnQuotes = returnQuotes.concat(result.body.hits.hits);
                }
                catch (ex) {
                    console.error(ex);
                    response.sendStatus(500);
                }
            }
            response.send(returnQuotes);
        };
        this.createAPost = (request, response) => {
            //    const post: Post = request.body;
            //    this.posts.push(post);
            //    response.send(post);
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + "/getTopicTrends", this.getTopicTrends);
        this.router.get(this.path + "/getTopicQuotes", this.getTopicQuotes);
        //    this.router.post(this.path, this.createAPost);
    }
    setEsClient(esClient) {
        this.esClient = esClient;
    }
}
exports.TrendsController = TrendsController;

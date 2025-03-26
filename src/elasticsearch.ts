import { Client } from "@elastic/elasticsearch";

const esClient = new Client({ node: "http://localhost:9200" });

export async function saveToElasticsearch(email: any) {
  await esClient.index({
    index: "emails",
    document: {
      subject: email.subject,
      body: email.body,
      category: email.category,
      timestamp: new Date(),
    },
  });
  console.log(`Email stored in Elasticsearch: ${email.subject}`);
}

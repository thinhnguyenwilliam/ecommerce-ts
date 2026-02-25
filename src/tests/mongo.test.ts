// ecommerce-ts/src/tests/mongo.test.ts
// npx jest src/tests/mongo.test.ts
import { MongoClient } from "mongodb";

describe("MongoDB Integration Test", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = new MongoClient(
      "mongodb://admin:admin123@localhost:27017/shopDEV?authSource=admin"
    );
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  it("should insert document", async () => {
    const db = client.db("shopDEV");
    const result = await db
      .collection("jest_test")
      .insertOne({ ok: true });

    expect(result.insertedId).toBeDefined();
  });
});
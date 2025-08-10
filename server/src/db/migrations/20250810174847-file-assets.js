module.exports = {
  async up(db) {
    await db.createCollection("file_assets", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["ownerId", "storageKey", "createdAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            ownerId: { bsonType: "objectId" }, // -> users._id
            roomId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] }, // optional -> rooms._id
            originalName: { oneOf: [{ bsonType: "string" }, { bsonType: "null" }] },
            mimeType: { oneOf: [{ bsonType: "string" }, { bsonType: "null" }] },
            size: { oneOf: [{ bsonType: "long" }, { bsonType: "int" }, { bsonType: "null" }] },
            storageKey: { bsonType: "string" }, // path or S3 key
            publicUrl: { oneOf: [{ bsonType: "string" }, { bsonType: "null" }] },
            createdAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.collection("file_assets").createIndex({ ownerId: 1, createdAt: -1 });
    await db.collection("file_assets").createIndex({ roomId: 1, createdAt: -1 });
  },

  async down(db) {
    await db.collection("file_assets").drop();
  }
};

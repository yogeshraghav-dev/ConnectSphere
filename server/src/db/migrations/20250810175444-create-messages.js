module.exports = {
  async up(db) {
    await db.createCollection("messages", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["roomId", "senderId", "type", "createdAt"],
          additionalProperties: false,
          properties: {
            _id: { bsonType: "objectId" },
            roomId: { bsonType: "objectId" },   // -> rooms._id
            senderId: { bsonType: "objectId" }, // -> users._id
            type: { enum: ["text","image","file","call","system"] },
            text: { bsonType: ["string","null"], maxLength: 5000 },
            fileId: { bsonType: ["objectId","null"] },       // -> file_assets._id
            parentMessageId: { bsonType: ["objectId","null"] },
            readBy: { bsonType: "array", items: { bsonType: "objectId" } },
            createdAt: { bsonType: "date" },
            updatedAt: { oneOf: [{ bsonType: "date" }, { bsonType: "null" }] }
          }
        }
      }
    });

    // Key indexes
    await db.collection("messages").createIndex({ roomId: 1, createdAt: 1 }); // pagination per room
    await db.collection("messages").createIndex({ senderId: 1, createdAt: -1 });
    // Optional full-text search on text:
    // await db.collection("messages").createIndex({ text: "text" }, { default_language: "english" });
  },

  async down(db) {
    await db.collection("messages").drop();
  }
};

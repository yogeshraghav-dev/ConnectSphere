const { ObjectId } = require("mongodb");

const IDS = {
  SUPER_ADMIN: new ObjectId("66b6f0000000000000000001"),
  ORG_ADMIN:   new ObjectId("66b6f0000000000000000002"),
  ORG_MEMBER:  new ObjectId("66b6f0000000000000000003"),
  ROOM_MOD:    new ObjectId("66b6f0000000000000000004"),
  ROOM_MEMBER: new ObjectId("66b6f0000000000000000005"),
};

const ROLES = [
  { _id: IDS.SUPER_ADMIN, name: "SUPER_ADMIN", description: "Platform super admin" },
  { _id: IDS.ORG_ADMIN,   name: "ORG_ADMIN",   description: "Organization admin"  },
  { _id: IDS.ORG_MEMBER,  name: "ORG_MEMBER",  description: "Organization member" },
  { _id: IDS.ROOM_MOD,    name: "ROOM_MOD",    description: "Room moderator"      },
  { _id: IDS.ROOM_MEMBER, name: "ROOM_MEMBER", description: "Room member"         },
];

async function up(db) {
  const rolesCol = db.collection("roles");
  for (const r of ROLES) {
    await rolesCol.updateOne(
      { _id: r._id },
      { $setOnInsert: { ...r, permissions: [], createdAt: new Date(), updatedAt: null } },
      { upsert: true }
    );
  }

  const permsCol = db.collection("permissions");
  const PERMISSIONS = [
    "user.read:any","user.write:any","user.disable:any",
    "org.read:any","org.manage:any",
    "room.create:any","room.manage:any",
    "message.read:any","message.send:any","message.delete:any",
    "file.manage:any","call.manage:any","schedule.manage:any","notification.manage:any",
    "settings.manage:any","audit.read:any"
  ];
  for (const key of PERMISSIONS) {
    await permsCol.updateOne(
      { key },
      { $setOnInsert: { key, roleIds: [IDS.SUPER_ADMIN], createdAt: new Date(), updatedAt: null } },
      { upsert: true }
    );
  }
}

async function down(db) {
  await db.collection("roles").deleteMany({ _id: { $in: Object.values(IDS) } });
  await db.collection("permissions").deleteMany({ roleIds: { $in: Object.values(IDS) } });
}

module.exports = { up, down };

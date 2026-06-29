import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "@/lib/dynamodb";

export async function POST(req: Request) {
  const body = await req.json();

  const groupId = body.groupId;
  const groupName = body.groupName;
  const email = body.email?.toLowerCase().trim();

  if (!groupId || !groupName || !email) {
    return NextResponse.json(
      { error: "Missing group or email" },
      { status: 400 }
    );
  }

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `GROUP#${groupId}`,
        sk: `MEMBER#${email}`,
        type: "MEMBER",
        groupId,
        email,
        role: "member",
        status: "Unknown",
        addedAt: new Date().toISOString(),
      },
    })
  );

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `USER#${email}`,
        sk: `GROUP#${groupId}`,
        type: "USER_GROUP",
        groupId,
        groupName,
        role: "member",
      },
    })
  );

  return NextResponse.json({
    success: true,
  });
}
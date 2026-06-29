import { NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "@/lib/dynamodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase();

  if (!email) {
    return NextResponse.json([]);
  }

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": `USER#${email}`,
        ":sk": "GROUP#",
      },
    })
  );

  return NextResponse.json(result.Items || []);
}

export async function POST(req: Request) {
  const body = await req.json();

  const groupName = body.groupName;
  const ownerEmail = body.ownerEmail?.toLowerCase();

  if (!groupName || !ownerEmail) {
    return NextResponse.json(
      { error: "Group name and owner email required" },
      { status: 400 }
    );
  }

  const groupId = crypto.randomUUID();

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `GROUP#${groupId}`,
        sk: "PROFILE",
        type: "GROUP",
        groupId,
        groupName,
        ownerEmail,
        createdAt: new Date().toISOString(),
      },
    })
  );

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `GROUP#${groupId}`,
        sk: `MEMBER#${ownerEmail}`,
        type: "MEMBER",
        groupId,
        email: ownerEmail,
        role: "owner",
        status: "Safe",
        addedAt: new Date().toISOString(),
      },
    })
  );

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `USER#${ownerEmail}`,
        sk: `GROUP#${groupId}`,
        type: "USER_GROUP",
        groupId,
        groupName,
        role: "owner",
      },
    })
  );

  return NextResponse.json({
    success: true,
    groupId,
    groupName,
  });
}
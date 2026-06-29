import { NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "@/lib/dynamodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) return NextResponse.json([]);

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": `GROUP#${groupId}`,
        ":sk": "MESSAGE#",
      },
    })
  );

  return NextResponse.json(result.Items || []);
}

export async function POST(req: Request) {
  const body = await req.json();

  const item = {
    pk: `GROUP#${body.groupId}`,
    sk: `MESSAGE#${Date.now()}`,
    type: "MESSAGE",
    groupId: body.groupId,
    senderEmail: body.senderEmail,
    senderName: body.senderName,
    message: body.message,
    emergency: body.emergency || false,
    createdAt: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return NextResponse.json(item);
}
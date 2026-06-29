import { NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "@/lib/dynamodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId") || "demo-household";

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      ExpressionAttributeValues: {
        ":pk": `GROUP#${groupId}`,
        ":prefix": "STATUS#",
      },
    })
  );

  return NextResponse.json(result.Items || []);
}

export async function POST(req: Request) {
  const body = await req.json();

  const groupId = body.groupId || "demo-household";
  const name = body.name?.trim();

  if (!name || !body.status) {
    return NextResponse.json(
      { error: "Name and status are required." },
      { status: 400 }
    );
  }

  const item = {
    pk: `GROUP#${groupId}`,
    sk: `STATUS#${name}`,
    type: "STATUS",
    groupId,
    name,
    status: body.status,
    note: body.note || "",
    updatedAt: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return NextResponse.json(item);
}
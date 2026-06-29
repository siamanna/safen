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
        ":prefix": "CONTACT#",
      },
    })
  );

  return NextResponse.json(result.Items || []);
}

export async function POST(req: Request) {
  const body = await req.json();

  const groupId = body.groupId || "demo-household";

  if (!body.name || !body.phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 }
    );
  }

  const contact = {
    pk: `GROUP#${groupId}`,
    sk: `CONTACT#${Date.now()}`,
    type: "CONTACT",
    groupId,
    name: body.name,
    relationship: body.relationship || "",
    phone: body.phone,
    createdAt: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: contact,
    })
  );

  return NextResponse.json(contact);
}
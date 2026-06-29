import { NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "@/lib/dynamodb";

export async function GET() {
  const householdId = "demo-household";

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": `HOUSEHOLD#${householdId}`,
        ":sk": "LOCATION#",
      },
    })
  );

  return NextResponse.json(result.Items || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  const householdId = "demo-household";

  const item = {
    pk: `HOUSEHOLD#${householdId}`,
    sk: `LOCATION#${body.name}`,
    type: "LOCATION",
    name: body.name,
    status: body.status || "Safe",
    latitude: body.latitude,
    longitude: body.longitude,
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
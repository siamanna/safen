import { NextResponse } from "next/server";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "@/lib/dynamodb";

export async function POST(req: Request) {
  const body = await req.json();
  const email = body.email?.toLowerCase().trim();
  const name = body.name?.trim();

  if (!email || !name) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const existingUser = await db.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        pk: `USER#${email}`,
        sk: "PROFILE",
      },
    })
  );

  if (!existingUser.Item) {
    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: `USER#${email}`,
          sk: "PROFILE",
          type: "USER",
          name,
          email,
          createdAt: new Date().toISOString(),
        },
      })
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      name,
      email,
    },
  });
}
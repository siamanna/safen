import { NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {db, TABLE_NAME } from "@/lib/dynamodb";

export async function GET() {
    const householdId = "demo-household";

    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
            ExpressionAttributeValues: {
                ":pk": `HOUSEHOLD#${householdId}`,
                ":prefix": "STATUS#",
            },
        })
    );

    return NextResponse.json(result.Items || []);
}

export async function POST(request: Request) {
    const body = await request.json();

    const householdId = "demo-household";

    const statusItem = {
        pk: `HOUSEHOLD#${householdId}`,
        sk: `STATUS#${body.name}`,

        name: body.name,
        status: body.status,
        note: body.note || "",
        updatedAt: new Date().toISOString(),
        type: "STATUS",
    };


    await db.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: statusItem,
        })
    );

    return NextResponse.json(statusItem);

}
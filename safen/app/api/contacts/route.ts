import { NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {db, TABLE_NAME} from "@/lib/dynamodb"

// get all emergency contacts for a household
export async function GET() {
    const householdId = "demo-household";

    const result = await db.send(
        new QueryCommand({
            TableName: TABLE_NAME,

            KeyConditionExpression: "pk =: pk AND begins_with(sk, :prefix)",

            ExpressionAttributeValues: {
                ":pk": `HOUSEHOLD#${householdId}`,
                ":prefix": "CONTACT#",
            },
        })
    );

    return NextResponse.json(result.Items || []);
}

export async function POST(request: Request) {
    const body = await request.json();

    const householdId = "demo-household";

    const contact = {
        pk: `HOUSEHOLD#${householdId}`,
        sk: `CONTACT#${Date.now()}`,

        name: body.name,
        relationship: body.relationship,
        phone: body.phone,

        type: "CONTACT",
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

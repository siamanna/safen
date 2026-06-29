import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { db, TABLE_NAME } from "@/lib/dynamodb";
import { ses } from "@/lib/ses";

export async function POST(req: Request) {
  try {
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

    const token = crypto.randomUUID();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${appUrl}/invite?token=${token}`;

    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: `INVITE#${token}`,
          sk: "PROFILE",
          type: "INVITE",
          token,
          groupId,
          groupName,
          email,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      })
    );

    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: process.env.SES_FROM_EMAIL!,
        Destination: {
          ToAddresses: [email],
        },
        Content: {
          Simple: {
            Subject: {
              Data: `You're invited to join ${groupName} on Safen`,
            },
            Body: {
              Text: {
                Data: `You've been invited to join ${groupName} on Safen. Accept your invite here: ${inviteLink}`,
              },
              Html: {
                Data: `
                  <div style="font-family: Arial, sans-serif; padding: 24px; color: #172033;">
                    <h1 style="color: #c2410c;">You're invited to Safen</h1>
                    <p>You have been invited to join <strong>${groupName}</strong>.</p>
                    <p>Safen helps emergency groups share safety status, location, and messages.</p>
                    <a href="${inviteLink}"
                      style="display:inline-block;margin-top:16px;background:#dc2626;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">
                      Accept Invite
                    </a>
                    <p style="margin-top:20px;color:#64748b;font-size:13px;">
                      If you were not expecting this invitation, you can ignore this email.
                    </p>
                  </div>
                `,
              },
            },
          },
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: "Invite created and email sent.",
      inviteLink,
    });
  } catch (error) {
    console.error("Invite email failed:", error);

    return NextResponse.json(
      {
        error: "Could not send invite email.",
      },
      { status: 500 }
    );
  }
}
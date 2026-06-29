"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [memberEmails, setMemberEmails] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function loadGroups(userEmail: string) {
    const response = await fetch(`/api/groups?email=${userEmail}`);
    const data = await response.json();
    setGroups(data);
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem("safehaven_user_email") || "";

    if (!savedEmail) {
      router.push("/login");
      return;
    }

    setEmail(savedEmail);
    loadGroups(savedEmail);
  }, [router]);

  async function createGroup() {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName,
        ownerEmail: email,
      }),
    });

    if (!response.ok) {
      alert("Could not create group.");
      return;
    }

    setGroupName("");
    setMessage("Group created.");
    loadGroups(email);
  }

  async function addMember(group: any) {
    const memberEmail = memberEmails[group.groupId];

    if (!memberEmail?.trim()) {
      alert("Please enter an email.");
      return;
    }

    const response = await fetch("/api/groups/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: group.groupId,
        groupName: group.groupName,
        email: memberEmail,
      }),
    });

    if (!response.ok) {
      alert("Could not add member.");
      return;
    }

    setMemberEmails({
      ...memberEmails,
      [group.groupId]: "",
    });

    setMessage("Member added by email.");
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-orange-700">
          Your Emergency Groups
        </h1>

        <p className="mt-2 text-gray-600">Logged in as {email}</p>

        {message && (
          <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Create Group</h2>

          <input
            className="mt-4 w-full rounded-lg border p-3"
            placeholder="Example: Manna Family"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <button
            onClick={createGroup}
            className="mt-4 rounded-lg bg-orange-600 px-6 py-3 font-bold text-white"
          >
            Create Group
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {groups.map((group) => (
            <div
              key={group.groupId}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <h2 className="text-2xl font-bold">{group.groupName}</h2>

              <p className="text-gray-500">Role: {group.role}</p>

              <div className="mt-4 flex gap-3">
                <input
                  className="flex-1 rounded-lg border p-3"
                  placeholder="Add member by email"
                  value={memberEmails[group.groupId] || ""}
                  onChange={(e) =>
                    setMemberEmails({
                      ...memberEmails,
                      [group.groupId]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => addMember(group)}
                  className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
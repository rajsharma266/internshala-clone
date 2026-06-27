import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/userSession";

export default function Friends() {
  const [userEmail, setUserEmail] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    setUserEmail(storedUser?.email || "");
  }, []);

  const readErrorMessage = async (res: Response) => {
    const raw = await res.text();

    if (!raw) {
      return "Request failed.";
    }

    try {
      const parsed = JSON.parse(raw);
      return parsed.error || parsed.message || "Request failed.";
    } catch {
      return "Request failed.";
    }
  };

  const fetchFriends = async (email: string) => {
    try {
      const res = await fetch(`/api/friends/list?userEmail=${email}`);

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        setFriends([]);
        return;
      }

      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Unable to load friends right now.");
      setFriends([]);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchFriends(userEmail);
    }
  }, [userEmail]);

  const addFriend = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/friends/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail,
        friendEmail,
      }),
    });

    if (!res.ok) {
      setMessage(await readErrorMessage(res));
      return;
    }

    const data = await res.json();
    setMessage(data.message || "Friend added successfully");

    if (res.ok) {
      setFriendEmail("");
      fetchFriends(userEmail);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container max-w-3xl">
        <div className="section-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Friends</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add friends to unlock public-space posting limits.
          </p>

          <form onSubmit={addFriend} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Friend Email
              </label>
              <input
                type="email"
                placeholder="Enter friend email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="primary-button w-full">
              Add Friend
            </button>
          </form>

          {message && (
            <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </p>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Friends ({friends.length})
            </h2>

            <div className="mt-4 space-y-3">
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {friend.friendEmail}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No friends added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

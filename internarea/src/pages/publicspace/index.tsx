import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/userSession";

export default function PublicSpace() {
  const [posts, setPosts] = useState<any[]>([]);
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("none");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserEmail(getStoredUser()?.email || "");
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

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/getPosts");

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        setPosts([]);
        return;
      }

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Unable to load posts right now.");
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const uploadMedia = async (file: File) => {
    setUploading(true);
    setMessage("Uploading media...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        return;
      }

      const data = await res.json();
      setMediaUrl(data.url);
      setMediaType(data.resourceType === "video" ? "video" : "image");
      setMessage("Media uploaded successfully.");
    } catch {
      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, caption, mediaUrl, mediaType }),
      });

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        return;
      }

      const data = await res.json();
      setMessage(data.message || "Post created successfully.");
      setCaption("");
      setMediaUrl("");
      setMediaType("none");
      fetchPosts();
    } catch {
      setMessage("Unable to create post right now.");
    }
  };

  const likePost = async (postId: string) => {
    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userEmail }),
      });

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        return;
      }

      fetchPosts();
    } catch {
      setMessage("Unable to update like right now.");
    }
  };

  const sharePost = async (postId: string) => {
    try {
      const res = await fetch("/api/posts/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        return;
      }

      fetchPosts();
    } catch {
      setMessage("Unable to share post right now.");
    }
  };

  const commentPost = async (postId: string) => {
    const text = window.prompt("Enter your comment");
    if (!text) {
      return;
    }

    try {
      const res = await fetch("/api/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userEmail, text }),
      });

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        return;
      }

      fetchPosts();
    } catch {
      setMessage("Unable to add comment right now.");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Public Space</h1>
          <p className="mt-2 text-sm text-slate-500">
            Share photos, videos, thoughts, and interact with your friends.
          </p>
        </div>

        <form onSubmit={createPost} className="section-card mb-8 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {userEmail ? userEmail[0]?.toUpperCase() : "U"}
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                {userEmail || "Guest User"}
              </p>
              <p className="text-sm text-slate-500">Create a public post</p>
            </div>
          </div>

          <textarea
            placeholder="Share an update with your network"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="form-textarea min-h-28"
          />

          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadMedia(file);
                }
              }}
              className="hidden"
              id="mediaUpload"
            />

            <label htmlFor="mediaUpload" className="secondary-button cursor-pointer">
              {uploading ? "Uploading..." : "Upload Photo or Video"}
            </label>
          </div>

          {mediaType === "image" && mediaUrl && (
            <img
              src={mediaUrl}
              alt="preview"
              className="mt-4 max-h-80 w-full rounded-2xl object-cover"
            />
          )}

          {mediaType === "video" && mediaUrl && (
            <video controls className="mt-4 w-full rounded-2xl">
              <source src={mediaUrl} />
            </video>
          )}

          <button type="submit" disabled={uploading} className="primary-button mt-5 w-full">
            Create Post
          </button>

          {message && (
            <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </p>
          )}
        </form>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="section-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {post.userEmail?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{post.userEmail}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-700">
                {post.caption}
              </p>

              {post.mediaType === "image" && post.mediaUrl && (
                <img
                  src={post.mediaUrl}
                  alt="post"
                  className="mt-4 max-h-[500px] w-full rounded-2xl object-cover"
                />
              )}

              {post.mediaType === "video" && post.mediaUrl && (
                <video controls className="mt-4 w-full rounded-2xl">
                  <source src={post.mediaUrl} />
                </video>
              )}

              <div className="mt-5 flex flex-wrap gap-3 border-y border-slate-200 py-4 text-sm font-medium text-slate-600">
                <button onClick={() => likePost(post._id)}>Like ({post.likes.length})</button>
                <button onClick={() => commentPost(post._id)}>
                  Comment ({post.comments.length})
                </button>
                <button onClick={() => sharePost(post._id)}>
                  Share ({post.shares})
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {post.comments.map((comment: any, index: number) => (
                  <p key={index} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <b>{comment.userEmail}:</b> {comment.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

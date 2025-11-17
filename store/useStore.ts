import { fetchPosts } from "@/api/client";
import { Comment, Post } from "@/types";
import { create } from "zustand";

const STALE_TIME = 5 * 1000;
const CACHE_TIME = 5 * 60 * 1000;

function isStale(lastFetchedAt: number | null) {
  if (!lastFetchedAt) return true;
  return Date.now() - lastFetchedAt > STALE_TIME;
}

function isExpired(lastFetchedAt: number | null) {
  if (!lastFetchedAt) return true;
  return Date.now() - lastFetchedAt > CACHE_TIME;
}

function attachCommentsToPosts(posts: Post[], comments: Comment[]): Post[] {
  const commentsByPostId = comments.reduce<Record<number, Comment[]>>((acc, comment) => {
    if (!acc[comment.postId]) acc[comment.postId] = [];
    acc[comment.postId].push(comment);
    return acc;
  }, {});

  return posts.map(post => ({
    ...post,
    comments: commentsByPostId[post.id] ?? [],
  }));
}

interface PostStore {
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  error: string | null;

  lastFetchedAt: number | null;

  fetchAll: () => Promise<void>;
  fetchComments: () => Promise<void>;
  fetchAllWithComments: () => Promise<void>;
  clear: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  comments: [],
  loading: false,
  error: null,

  lastFetchedAt: null,

  fetchAll: async () => {
    const { lastFetchedAt } = get();

    if (!isStale(lastFetchedAt)) {
      console.log("Cache hit: posts fresh, skipping fetchAll()");
      return;
    }

    if (isExpired(lastFetchedAt)) {
      console.log("Cache expired: clearing posts");
      set({ posts: [] });
    }

    try {
      set({ loading: true, error: null });
      const data = await fetchPosts<Post>();

      set({
        posts: data ?? [],
        loading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },

  fetchComments: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("https://jsonplaceholder.typicode.com/comments");
      const data = (await res.json()) as Comment[];

      set({ comments: data ?? [], loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },

  fetchAllWithComments: async () => {
    const { lastFetchedAt } = get();

    if (!isStale(lastFetchedAt)) {
      console.log("Cache hit: posts+comments fresh, skipping fetchAllWithComments()");
      return;
    }

    if (isExpired(lastFetchedAt)) {
      console.log("Cache expired: clearing posts+comments");
      set({ posts: [], comments: [] });
    }

    try {
      set({ loading: true, error: null });

      const [postsRes, commentsRes] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/posts"),
        fetch("https://jsonplaceholder.typicode.com/comments"),
      ]);

      const posts = (await postsRes.json()) as Post[];
      const comments = (await commentsRes.json()) as Comment[];

      const merged = attachCommentsToPosts(posts, comments);

      set({
        posts: merged,
        comments,
        loading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },

  clear: () => set({ posts: [], comments: [], lastFetchedAt: null }),
}));

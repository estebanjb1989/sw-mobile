import { usePostStore } from "@/store/useStore";
import { act } from "react-test-renderer";

global.fetch = jest.fn();

const resetStore = () => {
  const { clear } = usePostStore.getState();
  act(() => clear());
};

describe("usePostStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
    jest.setSystemTime(0);

  it("fetchAll loads posts and sets lastFetchedAt", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ id: 1, title: "Test" }],
    });

    await act(async () => {
      await usePostStore.getState().fetchAll();
    });

    const state = usePostStore.getState();
    expect(state.posts.length).toBe(1);
    expect(state.lastFetchedAt).toBe(0);
    expect(state.loading).toBe(false);
  });

  it("skips fetchAll when cache is fresh", async () => {
    const store = usePostStore.getState();

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ id: 1 }],
    });

    await act(async () => {
      await store.fetchAll();
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    jest.setSystemTime(3000);

    await act(async () => {
      await store.fetchAll();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("clears cache when expired", async () => {
    const store = usePostStore.getState();
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ id: 1 }],
    });

    await act(async () => {
      await store.fetchAll();
    });

    expect(store.posts.length).toBe(1);

    jest.setSystemTime(6 * 60 * 1000);

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ id: 2 }],
    });

    await act(async () => {
      await store.fetchAll();
    });

    expect(store.posts.length).toBe(1);
    expect(store.posts[0].id).toBe(2);
  });

  it("fetchAllWithComments merges comments correctly", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => [
          { id: 1, title: "Post 1" },
          { id: 2, title: "Post 2" },
        ],
      })
      .mockResolvedValueOnce({
        json: async () => [
          { id: 10, postId: 1, body: "A" },
          { id: 11, postId: 1, body: "B" },
          { id: 12, postId: 2, body: "C" },
        ],
      });

    await act(async () => {
      await usePostStore.getState().fetchAllWithComments();
    });

    const { posts } = usePostStore.getState();

    expect(posts?.[0]?.comments?.length).toBe(2);
    expect(posts?.[1]?.comments?.length).toBe(1);
  });

  it("fetchAllWithComments skips when cache is fresh", async () => {
    const store = usePostStore.getState();

    (fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => [{ id: 1 }] })
      .mockResolvedValueOnce({ json: async () => [] });

    await act(async () => {
      await store.fetchAllWithComments();
    });

    expect(fetch).toHaveBeenCalledTimes(2);

    jest.setSystemTime(3000);

    await act(async () => {
      await store.fetchAllWithComments();
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

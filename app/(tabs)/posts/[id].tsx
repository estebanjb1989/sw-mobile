import { usePostStore } from "@/store/useStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);

  const post = usePostStore((store) =>
    store.posts.find((p) => p.id === postId)
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: post ? `Post #${postId}` : "Post",
        }}
      />

      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back to posts</Text>
      </Pressable>

      {post ? (
        <>
          <Text style={styles.title}>{post.title}</Text>

          {post.body && <Text style={styles.body}>{post.body}</Text>}

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>

            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c) => (
                <View key={c.id} style={styles.commentCard}>
                  <Text style={styles.commentName}>{c.name}</Text>
                  <Text style={styles.commentEmail}>{c.email}</Text>
                  <Text style={styles.commentBody}>{c.body}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noComments}>No comments</Text>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.notFound}>Post not found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  back: {
    fontSize: 16,
    color: "#4A6CFF",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  body: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginBottom: 24,
  },

  commentsSection: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  commentCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  commentName: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
    color: "#333",
  },
  commentEmail: {
    fontSize: 13,
    color: "#4A6CFF",
    marginBottom: 6,
  },
  commentBody: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  noComments: {
    color: "#777",
    fontSize: 14,
  },

  notFound: { fontSize: 16, color: "red" },
});

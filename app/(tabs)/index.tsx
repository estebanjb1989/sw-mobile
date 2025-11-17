import { PostItem } from '@/components/PostItem';
import { usePostStore } from '@/store/useStore';
import { useRouter } from "expo-router";
import { useLayoutEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const posts = usePostStore((state) => state.posts);
  const loading = usePostStore((state) => state.loading);
  const fetchAllWithComments = usePostStore((state) => state.fetchAllWithComments);

  const router = useRouter();

  useLayoutEffect(() => {
    fetchAllWithComments();
  }, []);

  return (
    <FlatList
      keyExtractor={(item) => item.id.toString()}
      refreshControl={<RefreshControl
        refreshing={loading}
        onRefresh={fetchAllWithComments}
      />}
      data={posts}
      contentContainerStyle={{
        gap: 12,
      }}
      renderItem={({ item }) => (
        <PostItem
          item={item}
          onPress={() => router.push(`/posts/${item.id}`)}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 12,
    backgroundColor: 'white',
    gap: 8
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  postBody: {
    fontSize: 16,
  }
})

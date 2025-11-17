import { Post } from "@/types";
import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  item: Post;
  onPress: (event: GestureResponderEvent) => void
}

function PostItemComponent({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: { fontWeight: "700", fontSize: 20, marginBottom: 4 },
});

export const PostItem = React.memo(PostItemComponent);

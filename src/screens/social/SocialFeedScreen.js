import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import GradientButton from '../../components/common/GradientButton';
import { useApp } from '../../context/AppContext';
import { getCommunityFeed, createCommunityPost, likeCommunityPost } from '../../services/api';

const SocialFeedScreen = () => {
  const { state } = useApp();
  const user = state.user || {};
  const [newPost, setNewPost] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const result = await getCommunityFeed();
    if (result.success && result.data?.posts) {
      const formatted = result.data.posts.map(post => ({
        id: post.id,
        userId: post.user_id,
        user: post.author_name || post.user?.full_name || post.user?.username || 'User',
        avatar: (post.author_name || post.user?.full_name || 'U')[0],
        type: 'general',
        title: post.title,
        content: post.body,
        likes: post.likes || 0,
        comments: 0,
        time: getTimeAgo(post.created_at),
        liked: false,
      }));
      setPosts(formatted);
    }
    setLoading(false);
  };

  const getTimeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleLike = async (postId) => {
    if (likedPosts[postId]) return;
    setPosts(posts.map(p => p.id === postId ? { ...p, liked: true, likes: p.likes + 1 } : p));
    setLikedPosts({ ...likedPosts, [postId]: true });
    await likeCommunityPost(postId);
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const result = await createCommunityPost({ body: newPost.trim() });
    if (result.success && result.data?.post) {
      const p = result.data.post;
      setPosts([{
        id: p.id,
        userId: p.user_id,
        user: p.author_name || user.full_name || user.username || 'You',
        avatar: (p.author_name || user.full_name || 'U')[0],
        type: 'general',
        content: p.body,
        likes: 0, comments: 0, time: 'Just now', liked: false,
      }, ...posts]);
    }
    setNewPost('');
    setShowCompose(false);
  };

  const getTypeColor = (type) => {
    const colors = { achievement: COLORS.success, milestone: COLORS.primary, tip: COLORS.info, general: COLORS.textSecondary, yoga: COLORS.kapha, recipe: COLORS.warning, challenge: COLORS.pitta };
    return colors[type] || COLORS.textSecondary;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>Loading community posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Share & inspire healthy habits</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Compose */}
        <TouchableOpacity style={styles.composeBtn} onPress={() => setShowCompose(!showCompose)}>
          <Text style={styles.composeText}>Share your health journey...</Text>
          <Text style={styles.composeIcon}>✍️</Text>
        </TouchableOpacity>

        {showCompose && (
          <Card variant="elevated" style={styles.composeCard}>
            <TextInput
              style={styles.composeInput}
              value={newPost}
              onChangeText={setNewPost}
              placeholder="What's your health achievement today?"
              multiline
              numberOfLines={3}
            />
            <GradientButton title="Post" onPress={handlePost} />
          </Card>
        )}

        {/* Feed */}
        {posts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
          </View>
        )}

        {posts.map((post) => (
          <Card key={post.id} variant="elevated" style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>{post.avatar}</Text>
              </View>
              <View style={styles.postUserInfo}>
                <Text style={styles.postUser}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
              <View style={[styles.postTypeBadge, { backgroundColor: getTypeColor(post.type) + '20' }]}>
                <Text style={[styles.postTypeText, { color: getTypeColor(post.type) }]}>{post.type}</Text>
              </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(post.id)}>
                <Text style={styles.actionIcon}>
                  {post.liked ? '❤️' : '🤍'}
                </Text>
                <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>🔗</Text>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 30 },
  // Compose
  composeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadiusLg,
    marginTop: 16, ...SHADOWS.small,
  },
  composeText: { fontSize: 14, color: COLORS.textLight },
  composeIcon: { fontSize: 18 },
  composeCard: { marginTop: 10 },
  composeInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: COLORS.textLight },
  // Post
  postCard: { marginTop: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postAvatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  postAvatarText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  postUserInfo: { flex: 1 },
  postUser: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  postTime: { fontSize: 11, color: COLORS.textLight },
  postTypeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  postTypeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  postContent: { fontSize: 14, color: COLORS.text, lineHeight: 21, marginBottom: 12 },
  postActions: { flexDirection: 'row', gap: 20, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 16 },
  actionText: { fontSize: 13, color: COLORS.textSecondary },
  actionTextActive: { color: COLORS.error },
});

export default SocialFeedScreen;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiThumbsUp, FiMessageCircle, FiEye } from 'react-icons/fi';

export default function Community() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPost, setNewPost] = useState({ category: 'general', title: '', content: '' });

    useEffect(() => {
        loadPosts();
    }, [category]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const params = category !== 'all' ? { category } : {};
            const response = await communityAPI.getPosts(params);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await communityAPI.createPost(newPost);
            setShowCreateForm(false);
            setNewPost({ category: 'general', title: '', content: '' });
            loadPosts();
        } catch (error) {
            alert('Failed to create post');
        }
    };

    const categories = [
        { value: 'all', label: 'All Posts', icon: '📚' },
        { value: 'tips', label: 'Tips & Tricks', icon: '💡' },
        { value: 'question', label: 'Questions', icon: '❓' },
        { value: 'success-story', label: 'Success Stories', icon: '🎉' },
        { value: 'news', label: 'News', icon: '📰' },
        { value: 'general', label: 'General', icon: '💬' }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kisaan Community</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                >
                    + New Post
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${category === cat.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Create Post Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={newPost.category}
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="general">General</option>
                                    <option value="tips">Tips & Tricks</option>
                                    <option value="question">Question</option>
                                    <option value="success-story">Success Story</option>
                                    <option value="news">News</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    className="input-field"
                                    placeholder="Post title..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Content</label>
                                <textarea
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    className="input-field resize-none"
                                    rows="5"
                                    placeholder="Share your thoughts..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary flex-1">Post</button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No posts yet. Be the first to share!
                    </div>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/community/${post.id}`)}
                            className="card hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{post.title}</h3>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                                    {post.category}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <div>
                                    <span className="font-medium">{post.author?.name || 'Anonymous'}</span>
                                    <span className="mx-2">•</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <FiThumbsUp /> {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiEye /> {post.viewCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

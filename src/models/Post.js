// 定义文章模型
// src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },       // 文章标题
    content: { type: String, required: true },     // 文章内容
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 作者引用
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // 关联分类
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],         // 关联标签数组
    createdAt: { type: Date, default: Date.now }   // 创建时间
});

module.exports = mongoose.model('Post', postSchema);
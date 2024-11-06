// src/routes/post.js
const express = require('express');
const auth = require('../middlewares/auth'); // 引入身份验证中间件
const Post = require('../models/Post'); // 引入文章模型
const Category = require('../models/Category');
const Tag = require('../models/Tag');

const router = express.Router();

// 创建文章接口
// 创建文章接口的错误处理
// src/routes/post.js
router.post('/create', auth, async (req, res) => {
    const { title, content, category, tags } = req.body;
    const author = req.user.userId;

    try {
        // 验证分类和标签是否存在
        if (category && !(await Category.findById(category))) {
            return res.status(400).json({ message: '分类不存在' });
        }
        if (tags && (await Tag.find({ _id: { $in: tags } }).countDocuments()) !== tags.length) {
            return res.status(400).json({ message: '部分标签不存在' });
        }

        const post = new Post({ title, content, author, category, tags });
        await post.save();
        res.status(201).json({ message: '文章创建成功', post });
    } catch (error) {
        console.error('创建文章时发生错误:', error);
        res.status(500).json({ message: '文章创建失败', error: error.message });
    }
});

// 获取所有文章
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '获取文章失败', error });
    }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: '文章未找到' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: '获取文章失败', error });
    }
});

// 更新文章
// 更新文章
router.put('/:id', auth, async (req, res) => {
    const { title, content, category, tags } = req.body;

    try {
        // 验证分类和标签是否存在
        if (category && !(await Category.findById(category))) {
            return res.status(400).json({ message: '分类不存在' });
        }
        if (tags && (await Tag.find({ _id: { $in: tags } }).countDocuments()) !== tags.length) {
            return res.status(400).json({ message: '部分标签不存在' });
        }

        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.user.userId },
            { title, content, category, tags },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: '文章未找到或无权限更新' });
        res.json({ message: '文章更新成功', post });
    } catch (error) {
        console.error('更新文章时发生错误:', error);
        res.status(500).json({ message: '更新文章失败', error: error.message });
    }
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
    try {
        // 查找并删除文章，确保只有作者可以删除
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.userId });
        if (!post) return res.status(404).json({ message: '文章未找到或无权限删除' });
        res.json({ message: '文章删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除文章失败', error });
    }
});

module.exports = router;
const express = require('express');
const auth = require('../middlewares/auth'); // 引入身份验证中间件
const Post = require('../models/Post'); // 引入文章模型
const Category = require('../models/Category');
const Tag = require('../models/Tag');

const router = express.Router();

// 创建文章接口（包括状态字段）
router.post('/create', auth, async (req, res) => {
    const { title, content, category, tags, status = 'draft' } = req.body; // 默认状态为 'draft'
    const author = req.user.userId;

    try {
        // 验证分类和标签是否存在
        if (category && !(await Category.findById(category))) {
            return res.status(400).json({ message: '分类不存在' });
        }
        if (tags && (await Tag.find({ _id: { $in: tags } }).countDocuments()) !== tags.length) {
            return res.status(400).json({ message: '部分标签不存在' });
        }

        const post = new Post({ title, content, author, category, tags, status });
        await post.save();
        res.status(201).json({ message: '文章创建成功', post });
    } catch (error) {
        console.error('创建文章时发生错误:', error);
        res.status(500).json({ message: '文章创建失败', error: error.message });
    }
});

// 获取所有文章（根据状态筛选）
router.get('/', async (req, res) => {
    try {
        const { status } = req.query; // 允许通过查询参数筛选状态
        const filter = status ? { status } : {}; // 根据状态筛选
        const posts = await Post.find(filter).populate('author', 'username');
        res.json(posts); // 返回包含 status 的文章数据
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

// 更新文章（包括状态字段）
router.put('/:id', auth, async (req, res) => {
    const { title, content, category, tags, status } = req.body;

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
            { title, content, category, tags, status },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: '文章未找到或无权限更新' });
        res.json({ message: '文章更新成功', post });
    } catch (error) {
        console.error('更新文章时发生错误:', error);
        res.status(500).json({ message: '更新文章失败', error: error.message });
    }
});

// 发布草稿接口（用于从草稿切换到发布状态）
router.put('/:id/publish', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.user.userId, status: 'draft' },
            { status: 'published' },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: '草稿未找到或无权限发布' });
        res.json({ message: '草稿已发布', post });
    } catch (error) {
        console.error('发布草稿时发生错误:', error);
        res.status(500).json({ message: '发布草稿失败', error: error.message });
    }
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.userId });
        if (!post) return res.status(404).json({ message: '文章未找到或无权限删除' });
        res.json({ message: '文章删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除文章失败', error });
    }
});

module.exports = router;
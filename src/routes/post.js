// src/routes/post.js
const express = require('express');
const auth = require('../middlewares/auth'); // 引入身份验证中间件
const Post = require('../models/Post'); // 引入文章模型

const router = express.Router();

// 创建文章接口
router.post('/create', auth, async (req, res) => {
    const { title, content } = req.body;
    const author = req.user.userId; // 从身份验证中间件获取用户ID

    try {
        // 创建新的文章
        const post = new Post({ title, content, author });
        await post.save(); // 保存到数据库
        res.status(201).json({ message: '文章创建成功', post });
    } catch (error) {
        res.status(500).json({ message: '文章创建失败', error });
    }
});

module.exports = router;
// src/routes/tag.js
const express = require('express');
const auth = require('../middlewares/auth');  // 仅管理员或拥有权限的用户可以管理标签
const Tag = require('../models/Tag');

const router = express.Router();

// 创建标签
router.post('/create', auth, async (req, res) => {
    const { name } = req.body;

    try {
        const tag = new Tag({ name });
        await tag.save();
        res.status(201).json({ message: '标签创建成功', tag });
    } catch (error) {
        res.status(500).json({ message: '标签创建失败', error });
    }
});

// 获取所有标签
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: '获取标签失败', error });
    }
});

// 更新标签
router.put('/:id', auth, async (req, res) => {
    const { name } = req.body;

    try {
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!tag) return res.status(404).json({ message: '标签未找到' });
        res.json({ message: '标签更新成功', tag });
    } catch (error) {
        res.status(500).json({ message: '更新标签失败', error });
    }
});

// 删除标签
router.delete('/:id', auth, async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) return res.status(404).json({ message: '标签未找到' });
        res.json({ message: '标签删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除标签失败', error });
    }
});

module.exports = router;
// src/routes/category.js
const express = require('express');
const auth = require('../middlewares/auth');  // 仅管理员或拥有权限的用户可以管理分类
const Category = require('../models/Category');

const router = express.Router();

// 创建分类
router.post('/create', auth, async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json({ message: '分类创建成功', category });
    } catch (error) {
        res.status(500).json({ message: '分类创建失败', error });
    }
});

// 获取所有分类
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: '获取分类失败', error });
    }
});

// 更新分类
router.put('/:id', auth, async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: '分类未找到' });
        res.json({ message: '分类更新成功', category });
    } catch (error) {
        res.status(500).json({ message: '更新分类失败', error });
    }
});

// 删除分类
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: '分类未找到' });
        res.json({ message: '分类删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除分类失败', error });
    }
});

module.exports = router;
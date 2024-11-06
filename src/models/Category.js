// src/models/Category.js 定义分类模型
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // 分类名称，必填且唯一
    description: { type: String }                           // 分类描述，可选
});

module.exports = mongoose.model('Category', categorySchema);
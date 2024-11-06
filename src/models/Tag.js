// src/models/Tag.js
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }    // 标签名称，必填且唯一
});

module.exports = mongoose.model('Tag', tagSchema);
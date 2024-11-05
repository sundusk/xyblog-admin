// src/middlewares/auth.js 身份验证
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // 从请求头获取 token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: '缺少身份验证令牌' });
    }

    try {
        // 验证 token 并获取用户信息
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 将解码后的用户信息存储在 req 对象中，供后续使用
        next(); // 通过验证，继续处理请求
    } catch (error) {
        res.status(401).json({ message: '无效的令牌' });
    }
};

module.exports = auth;
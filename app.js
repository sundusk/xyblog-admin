// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// 导入并使用路由
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const postRoutes = require('./src/routes/post');
app.use('/api/posts', postRoutes);

const categoryRoutes = require('./src/routes/category');
app.use('/api/categories', categoryRoutes);

const tagRoutes = require('./src/routes/tag');
app.use('/api/tags', tagRoutes);

// 测试根路由
app.get('/', (req, res) => {
  res.send('xyblog Admin API Running');
});

// 测试用路由
app.get('/api/auth/test', (req, res) => {
  res.send('Test route working');
});

// 受保护的路由示例
const auth = require('./src/middlewares/auth');
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: '这是一个受保护的资源，只有登录用户可以访问', user: req.user });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
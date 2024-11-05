const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// 基础路由测试
app.get('/', (req, res) => {
  res.send('xyblog Admin API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route - Lấy bài viết theo ID
server.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = router.db.get('posts').find({ id: postId }).value();

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Bài viết không tồn tại' });
  }
});

// Thêm các phương thức mới vào router (nếu cần thiết)
// Ví dụ: Phương thức tạo mới bài viết
server.post('/api/posts', (req, res) => {
  const newPost = req.body;
  const postId = router.db.get('posts').insert(newPost).write();

  if (postId) {
    const createdPost = router.db.get('posts').find({ id: postId }).value();
    res.status(201).json(createdPost);
  } else {
    res.status(500).json({ error: 'Lỗi khi tạo bài viết mới' });
  }
});

// Phương thức cập nhật bài viết theo ID
server.put('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = req.body;
  const post = router.db.get('posts').find({ id: postId });

  if (post.value()) {
    post.assign(updatedPost).write();
    res.json(updatedPost);
  } else {
    res.status(404).json({ error: 'Bài viết không tồn tại' });
  }
});

// Phương thức xóa bài viết theo ID
server.delete('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = router.db.get('posts').find({ id: postId });

  if (post.value()) {
    router.db.get('posts').remove({ id: postId }).write();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Bài viết không tồn tại' });
  }
});

server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server đang chạy tại http://localhost:${port}`);
});
// // See https://github.com/typicode/json-server#module
// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

// server.use(middlewares)
// // Add this before server.use(router)
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }))
// server.use(router)
// server.listen(3000, () => {
//     console.log('JSON Server is running')
// })

// // Export the Server API
// module.exports = server

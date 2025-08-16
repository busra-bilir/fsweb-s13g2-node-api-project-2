// posts için gerekli routerları buraya yazın

const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

// [GET] /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

// [GET] /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

// [POST] /api/posts
router.post('/', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  }
  try {
    const { id } = await Posts.insert({ title, contents });
    const newPost = await Posts.findById(id);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

// [PUT] /api/posts/:id
router.put('/:id', async (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;

  if (!title || !contents) {
    return res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
  }

  try {
    const existing = await Posts.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    await Posts.update(id, { title, contents });
    const updated = await Posts.findById(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

// [DELETE] /api/posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    }

    await Posts.remove(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

// [GET] /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    }

    const comments = await Posts.findPostComments(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
// posts için gerekli routerları buraya yazın

const express = require("express");
const postsModel = require("./posts-model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allPost = await postsModel.find();
    res.json(allPost);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await postsModel.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, contents } = req.body || {};

    if (!title && !contents) {
      return res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    }

    const { id } = await postsModel.insert({ title, contents });
    const post = await postsModel.findById(id);
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, contents } = req.body || {};

    const exist = await postsModel.findById(req.params.id);

    if (!exist) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    if (!title || !contents) {
      return res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    }

    await postsModel.update(req.params.id, { title, contents });

    const updated = await postsModel.findById(req.params.id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const finded = await postsModel.findById(req.params.id);

    if (!finded) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    await postsModel.remove(req.params.id);
    res.status(200).json(finded);
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

module.exports = router;

const router = require("express").Router();
const db = require("../db");

// READ
router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const getSelectedVideo = await db`SELECT * FROM video WHERE id=${id}`;
      if (getSelectedVideo.length <= 0) {
        throw error;
      } else {
        res.status(200).json({
          status: true,
          message: `data dengan id ${id} berhasil diambil`,
          data: getSelectedVideo,
        });
      }
    } else {
      const getAllVideo = await db`SELECT * FROM video`;
      res.status(200).json({
        status: true,
        message: "data berhasil di ambil seluruhnya",
        data: getAllVideo,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "data gagal di ambil",
      data: [],
    });
  }
});
// CREATE
router.post("/add", async (req, res) => {
  try {
    const { recipe, step } = req.body;

    // INSERT INTO Category
    const addToVideo = await db`
        INSERT INTO video (recipe, step)
        VALUES (${recipe}, ${step})
      `;

    res.json({
      status: true,
      message: "berhasil di tambah",
      data: addToVideo,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
});
// UPDATE
router.patch("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { recipe, step } = req.body;

    const getVideo = await db`SELECT * FROM video WHERE id = ${id}`;

    if (getVideo) {
      // INSERT INTO category
      await db`
          UPDATE video SET
            "recipe" = ${recipe || getVideo[0]?.recipe},
            "step" = ${step || getVideo[0]?.step}
          WHERE "id" = ${id};
        `;
    } else {
      throw "ID Tidak terdaftar";
    }

    res.json({
      status: true,
      message: "berhasil di ubah",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
});
// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db`DELETE FROM "public"."video" WHERE "id" = ${id}`;

    res.json({
      status: true,
      message: "berhasil di hapus",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
});

module.exports = router;

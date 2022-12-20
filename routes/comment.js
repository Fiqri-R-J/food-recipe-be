const router = require("express").Router();
const db = require("../db");

// READ
router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const getSelectedComment = await db`SELECT * FROM comment WHERE id=${id}`;
      if (getSelectedComment.length <= 0) {
        throw error;
      } else {
        res.status(200).json({
          status: true,
          message: `data dengan id ${id} berhasil diambil`,
          data: getSelectedComment,
        });
      }
    } else {
      const getAllComment = await db`SELECT * FROM comment`;
      res.status(200).json({
        status: true,
        message: "data berhasil di ambil seluruhnya",
        data: getAllComment,
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
    const { user, recipe, comment } = req.body;

    // INSERT INTO Comment
    const addToComment = await db`
    INSERT INTO "comment" ("user", "recipe", "comment") VALUES
    (${user}, ${recipe}, ${comment});
      `;

    res.json({
      status: true,
      message: "berhasil di tambah",
      data: addToComment,
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
    const { user, recipe, comment } = req.body;

    const getComment = await db`SELECT * FROM comment WHERE id = ${id}`;

    if (getComment) {
      // INSERT INTO category
      await db`
          UPDATE comment SET
            "user" =  ${user || getComment[0]?.recipe},
            "recipe" = ${recipe || getComment[0]?.recipe},
            "comment" = ${comment || getComment[0]?.comment}
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

    await db`DELETE FROM comment WHERE id = ${id}`;

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

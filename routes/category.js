const router = require("express").Router();
const db = require("../db");

// READ
router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const getSelectedCategory =
        await db`SELECT * FROM category WHERE id=${id}`;
      if (getSelectedCategory.length <= 0) {
        throw error;
      } else {
        res.status(200).json({
          status: true,
          message: `data dengan id ${id} berhasil diambil`,
          data: getSelectedCategory,
        });
      }
    } else {
      const getAllCategory = await db`SELECT * FROM category`;
      res.status(200).json({
        status: true,
        message: "data berhasil di ambil seluruhnya",
        data: getAllCategory,
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
    const { category } = req.body;

    // INSERT INTO Category
    const addToCategory = await db`
        INSERT INTO category (category)
        VALUES (${category})
      `;

    res.json({
      status: true,
      message: "berhasil di tambah",
      data: addToCategory,
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
    const { category } = req.body;

    const getCategory = await db`SELECT * FROM category WHERE id = ${id}`;

    if (getCategory) {
      // INSERT INTO category
      await db`
          UPDATE category SET
            "category" = ${category || getCategory[0]?.category}
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

    await db`DELETE FROM "public"."category" WHERE "id" = ${id}`;

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

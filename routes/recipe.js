const router = require("express").Router();
const db = require("../db");

// READ
router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params; // /data/:id
    const { page, limit, sortName, sortDate, search } = req.query; // ?page=1&limit=5

    if (id) {
      const getSelectedRecipe = await db`SELECT * FROM recipe WHERE id = ${id}`;

      res.status(200).json({
        status: true,
        message: `Data dengan id ${id} berhasil di ambil`,
        data: getSelectedRecipe,
      });
    } else {
      // OFFSET & LIMIT
      let getAllRecipe;

      if (limit && page) {
        getAllRecipe = await db`SELECT * FROM recipe LIMIT ${limit} OFFSET ${
          limit * (page - 1)
        } `;
      }
      if (sortName) {
        getAllRecipe = await db`SELECT * FROM recipe ${
          sortName ? db`ORDER BY name DESC` : db`ORDER BY name ASC`
        }`;
      } else {
        getAllRecipe = await db`SELECT * FROM recipe ${
          sortName ? db`ORDER BY name DESC` : db`ORDER BY name ASC`
        }`;
      }
      if (sortDate) {
        getAllRecipe = await db`SELECT * FROM recipe ${
          sortDate ? db`ORDER BY date DESC` : db`ORDER BY date ASC`
        }`;
      } else {
        getAllRecipe = await db`SELECT * FROM recipe ${
          sortDate ? db`ORDER BY date DESC` : db`ORDER BY date ASC`
        }`;
      }
      if (search) {
        getAllRecipe =
          await db`SELECT * FROM recipe WHERE name LIKE ${search} `;
      }

      if (getAllRecipe.length > 0) {
        res.status(200).json({
          status: true,
          message: "data berhasil di ambil",
          total: getAllRecipe?.length,
          page,
          limit,
          data: getAllRecipe,
        });
      } else {
        throw "Data kosong silahkan coba lagi";
      }
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
    const d = new Date();
    const date = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    const newDate = `${date}/${month}/${year}`;
    const { name, description, category, picture, ingredients, video } =
      req.body;

    // INSERT INTO recipe (name, email, password, phone, photo) VALUES ("bilkis")
    const addToRecipe = await db`
    INSERT INTO "public"."recipe" ("name", "description", "category", "picture", "ingredients", "video", "date") VALUES
    (${name}, ${description}, ${category}, ${picture}, ${ingredients}, ${video},${newDate})
      `;

    res.json({
      status: true,
      message: "berhasil di tambah",
      data: addToRecipe,
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
    const { name, description, category, picture, ingredients, video, date } =
      req.body;

    const getRecipe = await db`SELECT * FROM recipe WHERE id = ${id}`;

    if (getRecipe) {
      // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
      await db`
          UPDATE recipe SET
            "name" = ${name || getRecipe[0]?.name},
            "description" = ${description || getRecipe[0]?.description},
            "category" = ${category || getRecipe[0]?.category},
            "picture" = ${picture || getRecipe[0]?.picture},
            "ingredients" = ${ingredients || getRecipe[0]?.ingredients},
            "video" = ${video || getRecipe[0]?.video},
            "date" = ${date || getRecipe[0]?.date}
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

    await db`DELETE FROM recipe WHERE id = ${id}`;

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

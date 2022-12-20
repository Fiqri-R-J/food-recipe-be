const router = require("express").Router();
const db = require("../db");
//const users = require("../models/users");

// Read
router.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params; // /data/:id
    const { page, limit, sort, search } = req.query; // ?page=1&limit=5

    if (id) {
      const getSelectedUser = await db`SELECT * FROM users WHERE id = ${id}`;

      res.status(200).json({
        status: true,
        message: `Data dengan id ${id} berhasil di ambil`,
        data: getSelectedUser,
      });
    } else {
      // OFFSET & LIMIT
      let getAllUser;

      if (limit && page) {
        getAllUser = await db`SELECT * FROM users ${
          sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
        } LIMIT ${limit} OFFSET ${limit * (page - 1)} `;
      } else {
        getAllUser = await db`SELECT * FROM users ${
          sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
        }`;
      }
      if (search) {
        getAllUser = await db`SELECT * FROM users WHERE name LIKE ${search} `;
      }

      if (getAllUser.length > 0) {
        res.status(200).json({
          status: true,
          message: "data berhasil di ambil",
          total: getAllUser?.length,
          page,
          limit,
          data: getAllUser,
        });
      } else {
        throw "Data kosong silahkan coba lagi";
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
});
// CREATE
// app.get("/users/:id?", (req, res) => {
//   const { id } = req.params;

//   const getAllUser = db`SELECT * FROM users`;
//   getAllUser
//     .then((result) => {
//       res.status(200).json({
//         status: true,
//         message: "data berhasil di ambil",
//         data: result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         status: false,
//         message: "data gagal di ambil",
//         data: [],
//       });
//     });
// });
// CREATE
router.post("/add", async (req, res) => {
  try {
    const { name, email, password, phone_number, profil_picture } = req.body;

    // INSERT INTO account (name, email, password, phone, photo) VALUES ("bilkis")
    const addToDb = await db`
        INSERT INTO users (name, email, password, phone_number,profil_picture) 
        VALUES (${name}, ${email}, ${password}, ${phone_number}, ${profil_picture})
      `;

    res.json({
      status: true,
      message: "berhasil di tambah",
      data: addToDb,
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
// "/data/update/:indexs" <--- paramter data
// /data/update/2/4 <-- cara pakai
router.patch("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone_number, profil_picture } = req.body;

    const getUser = await db`SELECT * FROM users WHERE id = ${id}`;

    if (getUser) {
      // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
      await db`
          UPDATE users SET
            "name" = ${name || getUser[0]?.name},
            "email" = ${email || getUser[0]?.email},
            "password" = ${password || getUser[0]?.password},
            "phone_number" = ${phone_number || getUser[0]?.phone_number},
            "profil_picture" = ${profil_picture || getUser[0]?.profil_picture}
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
//  DELETE
// "/data/delete/:indexs" <--- paramter data
// /data/delete/2 <-- cara pakai
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db`DELETE FROM "public"."users" WHERE "id" = ${id}`;

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

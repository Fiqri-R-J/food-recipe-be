const recipes = require('../models/recipes')
const { v4: uuidv4 } = require('uuid')
const { connect } = require('../middlewares/redis')
const { cloudinary } = require('../helper')

const getRecipe = async (req, res) => {
  try {
    const { id } = req.params // /data/:id
    const { page, limit, sort } = req.query // ?page=1&limit=5

    if (id) {
      const getSelectedRecipe = await recipes.getRecipeById({ id })

      // store data to redis for 10 seconds
      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getSelectedRecipe), 'ex', 10) // string only
      connect.set('is_paginate', null, 'ex', 10) // string only

      res.status(200).json({
        status: true,
        message: 'data berhasil di ambil',
        data: getSelectedRecipe,
      })
    } else {
      // OFFSET & LIMIT
      let getAllRecipe

      // if (search) {
      //   getAllRecipe = await recipes.searchRecipeByName({ search })
      // }

      if (limit && page) {
        getAllRecipe = await recipes.getAllRecipePagination({
          limit,
          page,
          sort,
        })
      } else {
        getAllRecipe = await recipes.getAllRecipe({ sort })
      }

      // store data to redis for 10 seconds
      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getAllRecipe), 'ex', 10) // string only
      connect.set('total', getAllRecipe?.length, 'ex', 10) // string only
      connect.set('limit', limit, 'ex', 10) // string only
      connect.set('page', page, 'ex', 10) // string only
      connect.set('is_paginate', 'true', 'ex', 10) // string only

      if (getAllRecipe.length > 0) {
        res.status(200).json({
          status: true,
          message: 'data berhasil di ambil',
          total: getAllRecipe?.length,
          page: page,
          limit: limit,
          data: getAllRecipe,
        })
      } else {
        throw 'Data kosong silahkan coba lagi'
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const postRecipe = async (req, res) => {
  try {
    const { name, description, category, ingredients, video } = req.body

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files?.picture
    // let fileName = `${uuidv4()}-${file.name}`
    // let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
    let mimeType = file.mimetype.split('/')[1]
    let allowFile = ['jpeg', 'jpg', 'png', 'webp']

    // validate size image
    if (file.size > 1048576) {
      throw 'File terlalu besar, max 1mb'
    }

    if (allowFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        function (error, result) {
          if (error) {
            console.log(error)
            throw 'Upload foto gagal'
          }

          // Store hash in your password DB.
          const addToDb = recipes.addNewRecipe({
            name,
            description,
            category,
            picture: result.url,
            ingredients,
            video,
          })

          res.json({
            status: true,
            message: 'berhasil di tambah',
            data: addToDb,
            // path: uploadPath,
          })
        }
      )
    } else {
      throw 'Upload foto gagal, hanya menerima format photo'
    }

    // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
  } catch (error) {
    console.log(error)
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const editRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, category, picture, ingredients, video } =
      req.body

    const getRecipe = await recipes.getRecipeById({ id })

    if (getRecipe) {
      // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
      await recipes.updateRecipe({
        name,
        description,
        category,
        picture,
        ingredients,
        video,
        id,
        defaultValue: getRecipe[0], // default value if input not add in postman
      })
    } else {
      throw 'ID Not Register'
    }
    res.json({
      status: true,
      message: 'berhasil di ubah',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params

    await recipes.deleteRecipeById({ id })

    res.json({
      status: true,
      message: 'berhasil di hapus',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}
module.exports = { getRecipe, postRecipe, editRecipe, deleteRecipe }

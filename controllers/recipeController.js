const recipes = require('../models/recipes')
const { connect } = require('../middlewares/redis')

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

module.exports = { getRecipe }

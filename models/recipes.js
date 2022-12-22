const db = require('../db') // import dari file ./db.js

// Get all users with pagination
const getAllRecipePagination = async (params) => {
  const { limit, page, sort } = params

  return await db`SELECT * FROM recipe ${
    sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
}

// get all users without pagination
const getAllRecipe = async (params) => {
  const { sort } = params

  return await db`SELECT * FROM recipe ${
    sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
  }`
}

// get selected users by id
const getRecipeById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe WHERE id = ${id}`
}

module.exports = { getAllRecipePagination, getAllRecipe, getRecipeById }

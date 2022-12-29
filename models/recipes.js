const db = require('../db') // import dari file ./db.js

// Get all users with pagination
const getAllRecipePagination = async (params) => {
  const { limit, page, sort } = params

  return await db`SELECT * FROM recipe ${
    sort ? db`ORDER BY name DESC` : db`ORDER BY name ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
}

// get all users without pagination
const getAllRecipe = async (params) => {
  const { sort } = params

  return await db`SELECT * FROM recipe ${
    sort ? db`ORDER BY name DESC` : db`ORDER BY name ASC`
  }`
}

//Search Recipe by Name and Date
const searchRecipeByName = async (params) => {
  const { search } = params

  return await db`SELECT * FROM recipe WHERE name LIKE ${search} `
}

// get selected users by id
const getRecipeById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe WHERE id = ${id}`
}

// add new user to db
const addNewRecipe = async (params) => {
  const d = new Date()
  const date = d.getDate()
  const month = d.getMonth()
  const year = d.getFullYear()
  const newDate = `${date}/${month}/${year}`
  const { name, description, category, picture, ingredients, video } = params

  return await db`
      INSERT INTO recipe (name, description, category, picture, ingredients, video, date) 
      VALUES (${name}, ${description}, ${category}, ${picture}, ${ingredients}, ${video}, ${newDate})
    `
}

module.exports = {
  getAllRecipePagination,
  searchRecipeByName,
  getAllRecipe,
  getRecipeById,
  addNewRecipe,
}

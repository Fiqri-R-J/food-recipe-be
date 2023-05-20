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

const getRecipeBySlug = async (params) => {
  const { slug } = params

  return await db`SELECT * FROM recipe WHERE slug = ${slug}`
}

// add new user to db
const addNewRecipe = async (params) => {
  const d = new Date()
  const date = d.getDate()
  const month = d.getMonth()
  const year = d.getFullYear()
  const newDate = `${date}/${month}/${year}`
  const { name, description, category, picture, ingredients, video, slug } =
    params

  return await db`
      INSERT INTO recipe (name, description, category, picture, ingredients, video, date, slug) 
      VALUES (${name}, ${description}, ${category}, ${picture}, ${ingredients}, ${video}, ${newDate}, ${slug})
    `
}

// update user
const updateRecipe = async (params) => {
  const {
    name,
    description,
    category,
    picture,
    ingredients,
    video,
    id,
    defaultValue,
  } = params

  return await db`
    UPDATE recipe SET
      "name" = ${name || defaultValue?.name},
      "description" = ${description || defaultValue?.description},
      "category" = ${category || defaultValue?.category},
      "picture" = ${picture || defaultValue?.picture},
      "ingredients" = ${ingredients || defaultValue?.ingredients},
      "video" = ${video || defaultValue?.video}
    WHERE "id" = ${id};
  `
}

// delete user by id
const deleteRecipeById = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."recipe" WHERE "id" = ${id}`
}

module.exports = {
  getAllRecipePagination,
  getRecipeBySlug,
  searchRecipeByName,
  getAllRecipe,
  getRecipeById,
  addNewRecipe,
  updateRecipe,
  deleteRecipeById,
}

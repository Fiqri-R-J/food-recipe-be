const router = require('express').Router()
const recipeController = require('../controllers/recipeController')
const { useRedis } = require('../middlewares/redis')

// READ
// /data/:id? <-- optional parameter
router.get('/:slug?', useRedis, recipeController.getRecipe)

// CREATE
router.post('/add', recipeController.postRecipe)

// UPDATE
router.patch('/edit/:id', recipeController.editRecipe)

//  DELETE
router.delete('/delete/:id', recipeController.deleteRecipe)

module.exports = router

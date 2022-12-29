const router = require('express').Router()
const recipeController = require('../controllers/recipeController')
const { useRedis } = require('../middlewares/redis')

// READ
// /data/:id? <-- optional parameter
router.get('/:id?', useRedis, recipeController.getRecipe)

// CREATE
router.post('/add', recipeController.postRecipe)

module.exports = router

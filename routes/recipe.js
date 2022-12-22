const router = require('express').Router()
const { validateCreate } = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')
const recipeController = require('../controllers/recipeController')
const { useRedis } = require('../middlewares/redis')

// READ
// /data/:id? <-- optional parameter
router.get('/:id?', validateToken, useRedis, recipeController.getRecipe)

module.exports = router

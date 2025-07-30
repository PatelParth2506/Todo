const { Router } = require('express')
const router = Router()

const { 
    ctrlCreateTodo,
    ctrlAddSharedTo,
    ctrlAddDescription,
    ctrlDeleteTodo,
    ctrlGetSingleTodo,
    ctrlGetAllTodods,
    ctrlUpdateDescription,
    ctrlDeleteDescription
} = require('../controllers/todo.controller')

const {
    ctrlCreateCategory,
    ctrlDeleteCategory,
    ctrlUpdateCategory,
    ctrlGetAllCategory
} = require('../controllers/category.controller')


const auth = require('../middlewares/auth')

router.post('/v1/api_createCategory',auth,ctrlCreateCategory)

router.post('/v1/api_deleteCategory',auth,ctrlDeleteCategory)

router.post('/v1/api_updateCategory',auth,ctrlUpdateCategory)

router.post('/v1/api_getallCategory',auth,ctrlGetAllCategory)


router.post('/v1/api_createTodo',auth,ctrlCreateTodo)

router.post('/v1/api_shareTodo',auth,ctrlAddSharedTo)

router.post('/v1/api_addDescription',auth,ctrlAddDescription)

router.post('/v1/api_deleteTodo',auth,ctrlDeleteTodo)

router.post('/v1/api_getSingleTodo',auth,ctrlGetSingleTodo)

router.post('/v1/api_getAllTodos',auth,ctrlGetAllTodods)

router.post('/v1/api_updateDescription',auth,ctrlUpdateDescription)

router.post('/v1/api_deleteDescription',auth,ctrlDeleteDescription)

module.exports = router
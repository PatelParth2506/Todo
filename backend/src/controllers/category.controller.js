const { Op } = require('sequelize')
const { Category,Todo,TodoSharedTo } = require('../models/index')

const apiError = require('../utils/apiError')
const apiResponse = require('../utils/apiResponse')

const ctrlCreateCategory = async(req,res)=>{
    const { category_name } = req.body

    const categorycheck = await Category.findOne({ where : { category_name , user_id : req.user.user_id } })
    if(categorycheck){
        throw new apiError(401,"Category With This Details Already Exists")
    }

    const category = await Category.create({
        category_name,
        user_id : req.user.user_id
    })
    res.status(200).json(
        new apiResponse(200,category,"Category Created SuccessFully")
    )
}

const ctrlDeleteCategory = async(req,res)=>{
    const { category_id } = req.body

    const category = await Category.findOne({ where : { category_id,user_id : req.user.user_id } })
    if(!category){
        throw new apiError(404,"No Category Found")
    }
    await category.destroy()
    res.status(200).json(
        new apiResponse(200,[],"Category Deleted SuccessFully")
    )
}

const ctrlUpdateCategory = async(req,res)=>{
    const { category_id,category_name } = req.body
    const category = await Category.findOne({ where : { category_id,user_id : req.user.user_id } })
    if(!category){
        throw new apiError(404,"No Category Found")
    }
    category.category_name = category_name
    await category.save()
    res.status(200).json(
        new apiResponse(200,category,"Category Updated SuccessFully")
    ) 
}

const ctrlGetAllCategory = async(req,res)=>{
    const categorys = await Category.findAll({ where : { user_id : req.user.user_id } })
    const sharedCategory = await TodoSharedTo.findAll({ where : { sharedWithUser_id : req.user.user_id },
        include :[{
            model : Todo,
            where : { creted_by :{
                [Op.ne] : req.user.user_id
            }},
            include : {
                model : Category,
                attributes : ['category_name','user_id','category_id']
            }
        }]
    })
    const sharedCategories = sharedCategory.map((cat)=>{
        const catjson = cat.toJSON()
        return{
            category_name : `${catjson.Todo.Category.category_name}`,
            user_id : catjson.Todo.Category.user_id,
            category_id : catjson.Todo.Category.category_id,
            isShared : true
        }
    })
    const ownCategories = categorys.map((cat)=>{
        return{
            ...cat.toJSON(),
            isShared : false
        }
    })
    res.status(200).json(
        new apiResponse(200,{ownCategories,sharedCategories},"Category Fetched SuccessFully")
    ) 
}

module.exports = { 
    ctrlCreateCategory,
    ctrlDeleteCategory,
    ctrlUpdateCategory,
    ctrlGetAllCategory
}
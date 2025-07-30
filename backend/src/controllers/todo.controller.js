const { Op, where } = require("sequelize");
const db = require("../models/index");
const { Todo,TodoDescription,Category,TodoSharedTo,User } = db

const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const ctrlCreateTodo = async (req, res) => {
  const { category_id, todo_title, todo_description } = req.body;
  console.log(req.user);
  const categoryCheck = await Category.findByPk(category_id);
  if (!categoryCheck) {
    throw new apiError(404, "No Category Found");
  }

  const todo = await Todo.create({
    category_id,
    todo_title,
    creted_by: req.user.user_id,
  });
  if (todo_description) {
    const description = await TodoDescription.create({
      todo_id: todo.todo_id,
      created_by: req.user.user_id,
      todo_description,
    });
  }

  await TodoSharedTo.create({
    sharedWithUser_id : req.user.user_id,
    todo_id : todo.todo_id
  })
  res
    .status(200)
    .json(new apiResponse(200, todo, "Todo Created SuccessFullly"));
};

const ctrlAddSharedTo = async (req, res) => {
  const { todo_id, sharedTo_id } = req.body;
  const todo = await Todo.findByPk(todo_id);
  if (!todo) {
    throw new apiError(404, "No Todo Found With This Id");
  }

  if (todo.creted_by !== req.user.user_id) {
    throw new apiError(410, "Unauthorized Access");
  }

  const user = await User.findByPk(sharedTo_id);
  if (!user) {
    throw new apiError(404, "No User Found With This Id");
  }

  const isSharedTo = await TodoSharedTo.findOne({ where : { sharedWithUser_id : sharedTo_id,todo_id } })
  if(isSharedTo){
    throw new apiError(402,"You Already Shared This Todo With This Person")
  }

  const shared = await TodoSharedTo.create({
    sharedWithUser_id: sharedTo_id,
    todo_id,
  });

  res.status(200).json(new apiResponse(200, shared, "Todo Is Shared To User"));
};

const ctrlAddDescription = async (req, res) => {
  const { description, todo_id } = req.body;
  const todo = await Todo.findByPk(todo_id);
  if (!todo) {
    throw new apiError(404, "No Todo Found With This Id");
  }

  const isShared = await TodoSharedTo.findAll({
    where: { todo_id: todo_id, sharedWithUser_id: req.user.user_id },
  });

  if (isShared.length === 0) {
    throw new apiError(410, "Unauthorized Access");
  }

  const todo_description = await TodoDescription.create({
    todo_description: description,
    todo_id,
    created_by: req.user.user_id,
  });

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        todo_description,
        "Todo Description Added SuccessFully"
      )
    );
};

const ctrlDeleteTodo = async (req, res) => {
  const { todo_id } = req.body;
  const todo = await Todo.findOne({
    where: { todo_id, creted_by: req.user.user_id },
  });
  if (!todo) {
    throw new apiError(404, "No Todo Found");
  }

  await todo.destroy();
  res.status(200).json(new apiResponse(200, [], "Todo Deleted SuccessFully"));
};

const ctrlGetSingleTodo = async (req, res) => {
  const { todo_id } = req.body;
  const todo = await Todo.findOne({
    where: {
         todo_id 
    },
    include: [
      {
        model: Category,
        attributes: ["category_name", ["user_id", "todo_owner_id"]],
      },
      {
        model: TodoDescription,
        attributes: ["todo_description", "created_by"],
      },
      {
        model: TodoSharedTo,
        attributes: ["sharedWithUser_id"],
      },
    ],
  });
  if (!todo) {
    throw new apiError(404, "No Todo Found");
  }
  res.status(200).json(new apiResponse(200, todo, "Todo Fetched SuccessFully"));
};

const ctrlGetAllTodods = async (req, res) => {
  const todos = await Todo.findAll({
    where: {
      [Op.or]: [
        { "$TodoSharedTos.sharedWithUser_id$": req.user.user_id },
      ],
    },
    include: [
      {
        model: Category,
        attributes: ["category_name", ["user_id", "todo_owner_id"]],
      },
      {
        model: TodoDescription,
        attributes: ["todoDescription_id", "todo_description", "created_by"],
      },
      {
        model: TodoSharedTo,
        attributes: ["sharedWithUser_id"],
      },
    ],
  });
  res
    .status(200)
    .json(new apiResponse(200, todos, "All Todos Feteched SuccessFully"));
};


const ctrlUpdateDescription = async(req,res)=>{
    const { todo_description_id,description } = req.body

    const todo_description = await TodoDescription.findByPk(todo_description_id,{
        include : [{
            model : Todo,
            attributes : ['creted_by']
        }]
    })
    console.log(todo_description.toJSON())
    if(!todo_description){
        throw new apiError(404,"No Description Found")
    }

    if(req.user.user_id !== todo_description.Todo.creted_by && req.user.user_id !== todo_description.created_by){
        throw new apiError(402,"Unauthorized Access")
    }

    await todo_description.update({ todo_description : description })
    res.status(200).json(
        new apiResponse(200,todo_description,"Description Updated SuccessFullly")
    )
}

const ctrlDeleteDescription = async(req,res)=>{
    const { todo_description_id } = req.body

    const todo_description = await TodoDescription.findByPk(todo_description_id)
    
    if(!todo_description){
        throw new apiError(404,"No Description Found")
    }

    if(req.user.user_id !== todo_description.created_by){
        throw new apiError(402,"Unauthorized Access")
    }

    await todo_description.destroy()
    res.status(200).json(
        new apiResponse(200,[],"Description Deleted SuccessFullly")
    )
}

module.exports = {
  ctrlCreateTodo,
  ctrlAddSharedTo,
  ctrlAddDescription,
  ctrlDeleteTodo,
  ctrlGetSingleTodo,
  ctrlGetAllTodods,
  ctrlUpdateDescription,
  ctrlDeleteDescription
};
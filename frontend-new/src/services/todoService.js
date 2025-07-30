// const API_URL = 'http://localhost:3000/todo/v1';
const API_URL = "https://6jg8vt57-3000.inc1.devtunnels.ms/todo/v1"

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        'auth' : token
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
        headers,
        ...options
    });

    const data = await response.json();
    if (response.ok) {
        return data.data;
    }
    alert(data.message);
    return null;
};

export const getCategories = () => request('api_getallCategory', { method: 'POST' });

export const createCategory = (category_name) => request('api_createCategory', {
    method: 'POST',
    body: JSON.stringify({ category_name })
});

export const getTodosByCategory = (category_id = null) => {
    const body = category_id ? { category_id } : {};
    return request('api_getAllTodos', {
        method: 'POST',
        body: JSON.stringify(body)
    });
};

export const createTodo = (todo_title, category_id) => request('api_createTodo', {
    method: 'POST',
    body: JSON.stringify({ todo_title, category_id })
});

export const updateTodoDescription = (todo_description_id, description) => request('api_updateDescription', {
    method: 'POST',
    body: JSON.stringify({ todo_description_id, description })
});

export const deleteTodoDescription = (todo_description_id) => request('api_deleteDescription', {
    method: 'POST',
    body: JSON.stringify({ todo_description_id })
});

export const addTodoDescription = (todo_id, description) => request('api_addDescription', {
    method: 'POST',
    body: JSON.stringify({ todo_id, description })
});

export const shareTodo = (todo_id, sharedTo_id) => request('api_shareTodo', {
    method: 'POST',
    body: JSON.stringify({ todo_id, sharedTo_id })
});

export const deleteTodo = (todo_id) => request('api_deleteTodo', {
    method: 'POST',
    body: JSON.stringify({ todo_id })
});


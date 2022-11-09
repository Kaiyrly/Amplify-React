import React, { useState } from "react";
import './App.css';
// import ElementMaker from "./ElementMaker";

import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createTodo, updateTodo, deleteTodo} from './graphql/mutations';
import { listTodos } from './graphql/queries';
import EdiText from 'react-editext'

import { onCreateTodo } from './graphql/subscriptions';


import awsconfig from './aws-exports';
Amplify.configure(awsconfig);


async function newTodo(title){
  const todo = { name: title, description: "Hello world!" };

  await API.graphql(graphqlOperation(createTodo, {input: todo}));
}

async function editTodo(todoId, title){
  await API.graphql(graphqlOperation(updateTodo, { input: { id: todoId, name: title }}));
}

async function removeTodo(todo){
  console.log(todo.id, todo._version);
  await API.graphql(graphqlOperation(deleteTodo, { input: { id: todo.id }}));
}


function App() {
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  // const [showInput, setShowInput] = useState(false);


  const getTodos = async() => {
    const todos = await API.graphql(graphqlOperation(listTodos));
    setList(todos.data.listTodos.items);
  };

  // const subscription = API.graphql(
  //     graphqlOperation(onCreateTodo)
  // ).subscribe({
  //     next: (todoData) => {
  //       console.log(todoData);
  //       // Do something with the data
  //     }
  // });

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => {
        newTodo(input);
        getTodos();
      }}>Add</button>
      <ul>
        {list.map((todo) => (
          <li key={todo.id}>
            <EdiText
              showButtonsOnHover
              value={todo.name}
              type='text'
              onSave={v => editTodo(todo.id, v)}
            />
            {/* {todo.name} */}
            <button onClick={() => {
              removeTodo(todo);
              getTodos();
              }}>&times;</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

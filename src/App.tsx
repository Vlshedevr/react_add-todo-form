import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import React, { useState } from 'react';
import { TodoList } from './components/TodoList';
import { Todo } from './types/typeTodo';
import { User } from './types/typeUser';
import { TodoUser } from './types/typeTodoWithUser';

function renderTodos(todos: Todo[], users: User[]): TodoUser[] {
  return todos
    .map(todo => {
      const user = users.find(u => u.id === todo.userId);

      return user ? { ...todo, user } : null;
    })
    .filter(todo => todo !== null);
}

export const App = () => {
  const todoArr = renderTodos(todosFromServer, usersFromServer);

  const [todos, setTodos] = useState(todoArr);

  const [currTitle, setCurrTitle] = useState('');
  const [errorTitle, setErrorTitle] = useState(false);

  const [currOption, setCurrOption] = useState(0);
  const [errorOption, setErrorOption] = useState(false);

  const handlTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrTitle(e.target.value);
    setErrorTitle(false);
  };

  const handlOptionCheng = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrOption(+e.target.value);
    setErrorOption(false);
  };

  const reset = () => {
    setCurrTitle('');
    setCurrOption(0);

    setErrorTitle(false);
    setErrorOption(false);
  };

  const newTodoId = () => {
    let maxId: number = 0;

    todos.forEach(todo => {
      if (todo.id > maxId) {
        maxId = todo.id;
      }
    });

    return maxId + 1;
  };

  const newTodo = (): TodoUser => {
    const selectUser: User = usersFromServer.find(
      u => u.id === currOption,
    ) as User;

    return {
      id: newTodoId(),
      title: currTitle,
      completed: false,
      userId: currOption,
      user: selectUser,
    };
  };

  const addNewTodo = (): void => {
    const creatTodo = newTodo();

    setTodos(currTodos => [...currTodos, creatTodo]);
  };

  const handlFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorTitle(!currTitle);
    setErrorOption(!currOption);

    if (!currTitle || !currOption) {
      return;
    }

    addNewTodo();
    reset();
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handlFormSubmit}>
        <div className="field">
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            value={currTitle}
            onChange={handlTitleChange}
          />
          {errorTitle && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="user">User: </label>
          <select
            id="user"
            data-cy="userSelect"
            value={currOption}
            onChange={handlOptionCheng}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(u => (
              <option value={String(u.id)} key={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {errorOption && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};

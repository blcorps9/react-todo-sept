import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./index.css";

//                     TODO

// InComplete       In Progress         Complete

// 1. fdas   [x]     1. dsfs             1. dsffdgfg
// 2. sdfsdf [x]     2. sdfs             2. dsffdgfg

//                Create New ToDo
//                [------] Create

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

// controlled - uncontrolled components -
// form elements
function TodoCreate({ value, onChange, onCreateToDo }) {
  return (
    <div className="todo-create">
      <input
        type="text"
        id="new-todo"
        name="new-todo"
        value={value}
        onChange={onChange}
        placeholder="Type your todo"
      />
      <button className="create-todo" onClick={onCreateToDo}>
        Create
      </button>
    </div>
  );
}

// class TodoCol extends Component {
//   shouldComponentUpdate(nextProps) {
//     return this.props.todos.length !== nextProps.todos.length;
//   }

//   render() {
//     const { type, heading, todos = [], onRemoveToDo, onMoveToDo } = this.props;

//     return (
//       <div className="todo-col">
//         <h3 className="todo-heading">{heading}</h3>
//         {todos.map((todo) => (
//           <div
//             key={todo.id}
//             className="todo-item"
//             data-type={type}
//             data-id={todo.id}
//             onClick={onMoveToDo}
//           >
//             <span className="label">{todo.label}</span>
//             <span
//               className="remove"
//               onClick={(e) => onRemoveToDo(e, type, todo.id)}
//             >
//               X
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

function TodoColFunc({ type, heading, todos = [], onRemoveToDo, onMoveToDo }) {
  return (
    <div className="todo-col">
      <h3 className="todo-heading">{heading}</h3>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="todo-item"
          data-type={type}
          data-id={todo.id}
          onClick={onMoveToDo}
        >
          <span className="label">{todo.label}</span>
          <span
            className="remove"
            onClick={(e) => onRemoveToDo(e, type, todo.id)}
          >
            X
          </span>
        </div>
      ))}
    </div>
  );
}

const TodoCol = React.memo(TodoColFunc);

class ToDoWrapper extends Component {
  state = {
    inComplete: [],
    inProgress: [],
    complete: [],

    newTodo: "",
  };

  onChange = (e) => {
    this.setState({ newTodo: e.target.value });
  };

  onCreateToDo = (e) => {
    if (this.state.newTodo) {
      this.setState({
        inComplete: [
          ...this.state.inComplete,
          {
            label: this.state.newTodo,
            id: uuidv4(),
          },
        ],
        newTodo: "",
      });
    }
  };

  onRemoveToDo = (e, type, todoId) => {
    e.stopPropagation();

    // if (type === "inComplete") {
    //   this.setState((pS) => ({
    //     inComplete: pS.inComplete.filter(({ id }) => id !== todoId),
    //   }));
    // } else if (type === "inProgress") {
    //   this.setState((pS) => ({
    //     inProgress: pS.inProgress.filter(({ id }) => id !== todoId),
    //   }));
    // }

    if (this.state[type]) {
      this.setState((pS) => ({
        [type]: pS[type].filter(({ id }) => id !== todoId),
      }));
    }
  };

  onMoveToDo = (e) => {
    e.stopPropagation();
    const type = e.currentTarget.getAttribute("data-type");
    const todoId = e.currentTarget.getAttribute("data-id");

    if (type === "inComplete") {
      this.setState((pS) => {
        const todoIndex = pS.inComplete.findIndex(({ id }) => id === todoId);
        const newInComplete = [...pS.inComplete];
        const todoToMove = newInComplete.splice(todoIndex, 1);

        return {
          inComplete: newInComplete,
          inProgress: [...pS.inProgress, ...todoToMove],
        };
      });
    } else if (type === "inProgress") {
      this.setState((pS) => {
        const todoIndex = pS.inProgress.findIndex(({ id }) => id === todoId);
        const newInProgress = [...pS.inProgress];
        const todoToMove = newInProgress.splice(todoIndex, 1);

        return {
          inProgress: newInProgress,
          complete: [...pS.complete, ...todoToMove],
        };
      });
    }
  };

  render() {
    const { inComplete, inProgress, complete, newTodo } = this.state;

    return (
      <div className="center todo-wrapper">
        <h1>TODO</h1>
        <div className="todo-list">
          <TodoCol
            type="inComplete"
            heading="In Complete"
            todos={inComplete}
            onMoveToDo={this.onMoveToDo}
            onRemoveToDo={this.onRemoveToDo}
          />
          <TodoCol
            type="inProgress"
            heading="In Progress"
            todos={inProgress}
            onMoveToDo={this.onMoveToDo}
            onRemoveToDo={this.onRemoveToDo}
          />
          <TodoCol type="complete" heading="Complete" todos={complete} />
        </div>
        <TodoCreate
          value={newTodo}
          onChange={this.onChange}
          onCreateToDo={this.onCreateToDo}
        />
      </div>
    );
  }
}

ReactDOM.render(<ToDoWrapper />, document.getElementById("root"));

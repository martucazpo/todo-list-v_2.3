import UI from "./UI.js";

class Todo extends UI {
  constructor(elem) {
    super(elem)
    this.elem = elem;
    this.state = {
      id: "",
      task: "",
      editTask: "",
      tasks: [],
      isEdit: false,
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleEditForm = this.handleEditForm.bind(this);
    this.handleEditTask = this.handleEditTask.bind(this);
    this.render = this.render.bind(this);
  }
  handleInput(e) {
    let { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
    return this;
  }
  handleAddTask(e) {
    e.preventDefault();
    let todo = {};
    todo.id = Math.floor(Math.random() * 900000);
    todo.task = this.state.task;
    this.setState({
      ...this.state,
      tasks: [todo, ...this.state.tasks],
      task: "",
    });
    this.render();
    return this;
  }
  handleDeleteTask(todo) {
    let allTheOthers = this.state.tasks.filter((task) => task.id !== todo.id);
    this.setState({
      ...this.state,
      tasks: allTheOthers,
    });
    this.render();
    return this;
  }
  handleEditForm(todo) {
    this.setState({
      ...this.state,
      id: todo.id,
      editTask: todo.task,
      isEdit: true,
    });
    this.render();
    return this;
  }
  handleEditTask(e) {
    e.preventDefault();
    let youveChanged = this.state.tasks.map((todo) => {
      if (todo.id === this.state.id) {
        todo.task = this.state.editTask;
      }
      return todo;
    });
    this.setState({
      ...this.state,
      tasks: youveChanged,
      id: "",
      editTask: "",
      isEdit: false,
    });
    this.render();
    return this;
  }
  render() {
    let elements = [this.Header(), this.AddTaskForm(), this.TodoList()];
    this.anchor(elements);
    return this;
  }
}
Todo.prototype.Form = function (props) {
  let { form, inputs } = props;
  return this.createElement(
    "form",
    form,
    ...inputs.map((input) =>
      this.createElement("input", {
        name: input.name,
        type: input.type,
        required: input.required,
        input: this.handleInput,
        value: input.value,
      })
    ),
    this.createElement("button", { type: "submit" }, form.subTxt)
  );
};
Todo.prototype.Header = function () {
  return this.createElement(
    "section",
    { class: "header-secton" },
    this.createElement("h1", {}, "Let's find something to do!")
  );
};
Todo.prototype.AddTaskForm = function () {
  let props = {
    form: {
      submit: this.handleAddTask,
      subTxt: "ADD",
    },
    inputs: [
      {
        name: "task",
        type: "text",
        required: true,
        value: this.state.task,
      },
    ],
  };
  return this.createElement(
    "section",
    { class: "todo-form-section" },
    this.Form(props)
  );
};
Todo.prototype.Ul = function () {
  return this.createElement(
    "ul",
    { class: "todo-list" },
    this.state.tasks.map((todo) => {
      if (this.state.isEdit && todo.id === this.state.id) {
        let props = {
          form: {
            submit: this.handleEditTask,
            subTxt: "CHANGE",
          },
          inputs: [
            {
              name: "editTask",
              type: "text",
              required: true,
              value: this.state.editTask,
            },
          ],
        };
        return this.createElement("li", {}, this.Form(props));
      } else {
        return this.createElement(
          "li",
          {},
          todo.task,
          this.createElement(
            "button",
            { click: () => this.handleDeleteTask(todo) },
            "X"
          ),
          this.createElement(
            "button",
            { click: () => this.handleEditForm(todo) },
            "EDIT"
          )
        );
      }
    })
  );
};
Todo.prototype.TodoList = function () {
  if (this.state.tasks.length < 1) {
    return this.createElement(
      "section",
      { class: "todo-list-section" },
      this.createElement("h3", {}, "There is nothing here to do!")
    );
  } else {
    return this.createElement(
      "section",
      { class: "todo-list-section" },
      this.Ul()
    );
  }
};

class TodoList extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    new Todo(shadow).render();
    return this;
  }
}

export default TodoList;

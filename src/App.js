import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Task from "./components/Task.js";
import Filter from "./components/Filter.js";
function App() {
	// creating tasks list
	const [todoList, setTodoList] = useState(() => {
		const stored = localStorage.getItem("tasks");
		return stored ? JSON.parse(stored) : [];
	});
	// filtered Tasks
	const [filter, setFilter] = useState("all");
	// Edit Task State
	const [editTaskValue, setEditTaskValue] = useState("");
	const [editTaskId, setEditTaskId] = useState(null);
	// Error message
	const [error, setError] = useState(null);

	// Ref To input
	const input = useRef();
	// add task
	const addTask = useCallback(() => {
		const value = input.current.value;
		setTodoList((prevList) => {
			// to work with the latest todolist because we're caching add task Function
			if (
				prevList.some(
					(task) => task.title.toLowerCase().trim() === value.toLowerCase() // to prevent adding the same task many times
				)
			) {
				input.current.value = "";
				return prevList;
			}
			if (value.trim() !== "") {
				const task = {
					id: Date.now(),
					title: value,
					completed: false,
				};
				input.current.value = "";
				input.current.focus();
				return [...prevList, task];
			}
			return prevList;
		});
	}, []);
	// update LocalStorage
	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(todoList));
	}, [todoList]);

	// delete Task
	const deleteTask = useCallback((id) => {
		setTodoList((todoList) => todoList.filter((task) => task.id !== id));
	}, []);

	// complete task
	const doneTask = useCallback((id) => {
		setTodoList((todoList) => {
			return todoList.map((task) => {
				return task.id === id ? { ...task, completed: !task.completed } : task;
			});
		});
	}, []);

	// Edit Task
	const editTaskHandle = useCallback(
		(e, task) => {
			e.stopPropagation();
			// stop Duplicates

			const duplicates = todoList.some(
				(t) =>
					t.title.trim().toLowerCase() === editTaskValue.trim().toLowerCase() &&
					t.id !== editTaskId
			);

			if (duplicates) {
				setError("This Is Task Is Already Been Added");
				return;
			}
			if (
				editTaskId === task.id &&
				editTaskValue !== "" // **
			) {
				setTodoList((prev) => {
					return prev.map((t) =>
						t.id === task.id ? { ...t, title: editTaskValue } : t
					);
				});
				setEditTaskId(null); // exit edit mode
				setEditTaskValue("");
				setError(null);
			} else {
				// Enter Edit Mode
				setEditTaskId(task.id);
				setEditTaskValue(task.title);
				setError(null);
			}
		},
		[editTaskId, editTaskValue]
	);
	// Delete All Button

	const deleteAll = useCallback(() => {
		setTodoList([]);
		// localStorage.removeItem("tasks");
	}, []);

	const filteredTasks = useMemo(() => {
		if (filter === "all") {
			return todoList;
		} else if (filter === "completed") {
			return todoList.filter((task) => task.completed === true);
		} else if (filter === "unfinished") {
			return todoList.filter((task) => task.completed !== true);
		}
	}, [todoList, filter]);

	return (
		<div className="container">
			<h1>Todo-List React App</h1>
			<div className="field">
				<input
					className="input"
					type="text"
					ref={input}
					onKeyDown={(event) => event.key === "Enter" && addTask()}
				/>
				<button className="add" onClick={addTask}>
					Add Task
				</button>
			</div>
			{/* show error Message */}
			{error && (
				<p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
					{error}
				</p>
			)}
			<fieldset>
				<legend>Set Task Filter</legend>
				<Filter
					onClick={() => setFilter("all")}
					filter="Show All"
					active={filter === "all"}
				/>
				<Filter
					onClick={() => setFilter("completed")}
					filter="Finished Tasks"
					active={filter === "completed"}
				/>
				<Filter
					onClick={() => setFilter("unfinished")}
					filter="Unfinished Tasks"
					active={filter === "unfinished"}
				/>
			</fieldset>
			<div className="tasks-container">
				<ul className="tasks">
					{filteredTasks.map((task) => (
						<Task
							key={task.id}
							task={task}
							editTaskId={editTaskId}
							editTaskValue={editTaskValue}
							setEditTaskValue={setEditTaskValue}
							editTaskHandle={editTaskHandle}
							deleteTask={deleteTask}
							doneTask={doneTask}
						/>
					))}
				</ul>
				{todoList.length > 0 && <RemoveAll onClick={deleteAll} />}
			</div>
		</div>
	);
}

function RemoveAll({ onClick }) {
	return (
		<button className="remove-all" onClick={onClick}>
			Remove All
		</button>
	);
}

export default App;

/*
State Update is Asynchronous
setTodoList([...todoList, task]) does not update todoList immediately.
So console.log(todoList) and localStorage.setItem right after it will use the old list, missing the new task.
*/

/*
**: الشروط الثلاثة معًا تعني:

"إذا كانت المهمة الحالية هي المهمة التي نعدلها، وكان النص المدخل ليس فارغًا، وكان العنوان الجديد مختلفًا عن القديم، عندها قم بتحديث المهمة."

هذا يضمن أن التحديث مستهدف، صالح، وفعال.
*/

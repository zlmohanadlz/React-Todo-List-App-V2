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
			setTodoList((prev) => {
				// stop Duplicates
				const duplicates = prev.some(
					(t) =>
						t.title.trim().toLowerCase() ===
							editTaskValue.trim().toLowerCase() && t.id !== editTaskId
				);
				if (duplicates) {
					setError("This Task Is Already Added");
					return prev; // no change
				}
				if (editTaskId === task.id && editTaskValue !== "") {
					const updatedList = prev.map((t) =>
						t.id === task.id ? { ...t, title: editTaskValue } : t
					);
					setEditTaskId(null); // exit edit mode
					setEditTaskValue("");
					setError(null);
					return updatedList;
				} else {
					// Enter Edit Mode (no change to list)
					setEditTaskId(task.id);
					setEditTaskValue(task.title);
					setError(null);
					return prev;
				}
			});
		},
		[editTaskId, editTaskValue] // ✅ no todoList dependency needed anymore
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
					maxLength={25}
				/>
				<button className="add" onClick={addTask} aria-label="Add a new Task">
					Add Task
				</button>
			</div>
			{/* show error Message */}
			{error && (
				<p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
					{error}
				</p>
			)}
			<fieldset role="radiogroup" aria-labelledby="filter-legend">
				<legend id="filter-legend">Set Task Filter</legend>
				<Filter
					onClick={() => setFilter("all")}
					filter="Show All"
					active={filter === "all"}
					ariaLabel="show All Tasks"
				/>
				<Filter
					onClick={() => setFilter("completed")}
					filter="Finished Tasks"
					active={filter === "completed"}
					ariaLabel="show Finished Tasks"
				/>
				<Filter
					onClick={() => setFilter("unfinished")}
					filter="Unfinished Tasks"
					active={filter === "unfinished"}
					ariaLabel="show All Undone Tasks"
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

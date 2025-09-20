import React from "react";

function Task({
	task,
	editTaskId,
	editTaskValue,
	setEditTaskValue,
	editTaskHandle,
	deleteTask,
	doneTask,
}) {
	const data = new Date();
	return (
		<li
			onClick={() => doneTask(task.id)}
			className={task.completed ? "done" : ""}
		>
			{editTaskId === task.id ? (
				<input
					value={editTaskValue}
					onChange={(e) => setEditTaskValue(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && editTaskHandle(e, task)}
					onClick={(e) => e.stopPropagation()}
					autoFocus
					maxLength={25}
					placeholder="Task Mustn't be Empty"
				/>
			) : (
				<p>{task.title}</p>
			)}
			<div className="buttons">
				<button onClick={(e) => editTaskHandle(e, task)}>
					{editTaskId === task.id ? "Save" : "Edit"}
				</button>
				<button
					onClick={(e) => {
						e.stopPropagation();
						deleteTask(task.id);
					}}
				>
					Delete
				</button>
			</div>
			<span className="date">
				{data.toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
				})}
			</span>
		</li>
	);
}

export default React.memo(Task);

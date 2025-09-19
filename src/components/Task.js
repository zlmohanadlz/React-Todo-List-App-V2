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
		</li>
	);
}

export default React.memo(Task);

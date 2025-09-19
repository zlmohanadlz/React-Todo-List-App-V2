function Filter({ onClick, filter, active }) {
	return (
		<>
			<input
				type="radio"
				name="filter"
				id={filter}
				onClick={onClick}
				checked={active}
				className={active ? "filter active" : "filter"}
			/>
			<label htmlFor={filter}>{filter}</label>
		</>
	);
}

export default Filter;

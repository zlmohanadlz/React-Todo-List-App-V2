function Filter({ onClick, filter, active, ariaLabel }) {
	return (
		<>
			<input
				type="radio"
				name="filter"
				id={filter}
				onChange={onClick}
				checked={active}
				className={active ? "filter active" : "filter"}
				aria-label={ariaLabel}
			/>
			<label htmlFor={filter}>{filter}</label>
		</>
	);
}

export default Filter;

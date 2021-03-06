import styled from "styled-components";
import Card from "../../Cards/Card";
import Actions from "./Actions";
import type { TodoMiniProps } from "./interfaces/todo-mini-props.interface";
import Tag from "./Tag";
import Time from "./Time";
import Title from "./Title";

const Container = styled(Card)`
	display: grid;
	grid-template-areas:
		"time"
		"tag"
		"title"
		"actions";
	grid-template-columns: 1fr;
	padding: 0.3em 0.8em 0.7em 1em;

	min-height: 9em;
	height: 9em;
	width: 22.2em;

	> :nth-child(1) {
		margin-bottom: -0.5em;
	}

	> :nth-child(2) {
		margin-bottom: -0.5em;
	}
`;

const TodoMini = ({
	amPm,
	className = "",
	dark = false,
	edit = false,
	hours,
	minutes,
	onAmPmClick,
	onDelete,
	onEdit,
	onEditDiscard,
	onEditDone,
	onHourClick,
	onMinuteClick,
	onMouseDown,
	onTagClick,
	onTitleChange,
	onTodoFinish,
	style,
	tagColor,
	tagName,
	title,
}: TodoMiniProps) => (
	<Container
		as="article"
		className={className}
		dark={dark}
		onMouseDown={onMouseDown}
		style={style}
	>
		<Time
			amPm={amPm}
			dark={dark}
			edit={edit}
			hours={hours}
			minutes={minutes}
			onAmPmClick={onAmPmClick}
			onHourClick={onHourClick}
			onMinuteClick={onMinuteClick}
		/>
		<Tag
			edit={edit}
			onTagClick={onTagClick}
			tagColor={tagColor}
		>
			{tagName}
		</Tag>
		<Title
			dark={dark}
			edit={edit}
			onTitleChange={onTitleChange}
			title={title}
		/>
		<Actions
			dark={dark}
			edit={edit}
			onDelete={onDelete}
			onEdit={onEdit}
			onEditDiscard={onEditDiscard}
			onEditDone={onEditDone}
			onTodoFinish={onTodoFinish}
		/>
	</Container>
);

// CMT Don't memoize TodoMini since if it is editable it's going to cause a lot of
// rerenders, instead just memoize TodoList later.
export default TodoMini;

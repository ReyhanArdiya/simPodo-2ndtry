import type Tag from "./tag";
import type Todo from "./todo";

export default class User {
	constructor(
		public username: string,
		public email: string,
		public token: string = "",
		public tags: Map<Tag["_id"], Tag> = new Map(),
		public todos: Map<Todo["_id"], Todo> = new Map(),
		public readonly _id: string = "",
	) {
		this.username = username;
		this.email = email;
		this.token = token;
		this.tags = tags;
		this.todos = todos;
		this._id = _id;
	}
}

export default class NoTagFoundError extends Error {
	constructor() {
		super("Tag not found!");
	}
}

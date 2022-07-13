import mockMongoDB from "../../utils/tests/mock-mongoDB";
import NoTodoFoundError from "../errors/no-todo-found-error";
import NoTagFoundError from "../errors/no-tag-found-error";
import { DBTag } from "./tag";
import { DBTodo } from "./todo";
import User, { UserDoc } from "./user";

beforeAll(async () => await mockMongoDB.setUp());

beforeEach(async () => await mockMongoDB.dropCollections());

afterAll(async () => await mockMongoDB.dropDatabase());

let user: UserDoc;

beforeEach(() => {
	user = new User({
		username      : "username",
		authProviders : {
			firebase : {
				local : {
					uid   : "meowmeowmeow",
					email : "meow@gmail.com"
				}
			}
		}
	});
});

describe("User document", () => {
	it("can be saved to db", async () => {
		const { _id: userId } = await user.save();

		expect(await User.findById(userId)).not.toBeNull();
	});

	it("can be deleted from db", async () => {
		const { _id: userId } = await user.save();

		expect(await User.findById(userId)).not.toBeNull();

		const deletedUser = await User.findByIdAndDelete(userId);

		expect(await User.findById(deletedUser?._id)).toBeNull();
	});

	it("throws when trying to save non-unique username", async () => {
		const nonUnique = {
			username      : "nonunique",
			authProviders : {
				firebase : {
					local : {
						uid   : "meowmeowmeow",
						email : "meow@gmail.com"
					}
				}
			}
		};

		const u1 = new User({ ...nonUnique });

		const u2 = new User({ ...nonUnique });

		await u1.save();
		await expect(u2.save()).rejects.toBeInstanceOf(Error);
	});

	it("handles multiple undefined username field", async () => {
		const nullishUser = {
			authProviders : {
				firebase : {
					local : {
						uid   : "meowmeowmeow",
						email : "meow@gmail.com"
					}
				}
			}
		};

		const u1 = new User({ ...nullishUser });

		const u2 = new User({ ...nullishUser });

		await u1.save();
		await expect(u2.save()).resolves.toBeInstanceOf(User);
	});
});

describe("tags path manipulation", () => {
	let newTag: DBTag;

	beforeEach(async () => {
		newTag = new DBTag("tag1", "salmon");

		await user.save();
	});

	it("adds a tag", async () => {
		const addedTag = await user.addTag(newTag);

		const userWTag = await User.findOne(
			{
				_id                      : user._id,
				[`tags.${addedTag._id}`] : addedTag
			},
			{
				tags : 1
			}
		);

		expect(userWTag?.tags.has(addedTag._id.toString())).toBe(true);
	});

	it("throws a NoTagFoundError when deleting a nonexistent tag", async () => {
		await expect(user.deleteTag("helwlofjeiowf")).rejects.toBeInstanceOf(
			NoTagFoundError
		);
	});

	it("deletes a tag", async () => {
		const addedTag = await user.addTag(newTag);

		const userWTag = await User.findOne(
			{
				_id                      : user._id,
				[`tags.${addedTag._id}`] : addedTag
			},
			{
				tags : 1
			}
		);

		expect(userWTag?.tags.has(addedTag._id.toString())).toBe(true);

		const deletedTag = await user.deleteTag(addedTag._id);

		const userWOTag = await User.findById(user._id);

		expect(userWOTag?.tags.has(deletedTag._id.toString())).toBe(false);
	});

	it("throws a NoTagFoundError when updating a nonexistent tag", async () => {
		await expect(
			user.updateTag(new DBTag("", ""))
		).rejects.toBeInstanceOf(NoTagFoundError);
	});

	it("selectively updates a tag w/o side-effects", async () => {
		const oldTag = await user.addTag(newTag);
		const userWTag = await User.findOne(
			{
				_id                    : user._id,
				[`tags.${oldTag._id}`] : oldTag
			},
			{
				tags : 1
			}
		);

		expect(userWTag?.tags.has(oldTag._id.toString())).toBe(true);

		const newTagData = new DBTag(
			"updatedTag1",
			oldTag.color,
			oldTag._id
		);
		const updatedTag = await user.updateTag(newTagData);
		const userWUTag = await User.findById(user._id);
		const tagInStore = userWUTag?.tags.get(updatedTag._id.toString());

		expect(tagInStore?.name).toBe(updatedTag.name);

		for (const key in Object.keys(updatedTag).filter(k => k !== "name")) {
			expect(tagInStore?.[key as keyof typeof tagInStore]).toBe(
				oldTag[key as keyof typeof oldTag]
			);
		}
	});
});

describe("todo path manipulation", () => {
	let newTodo: DBTodo;

	beforeEach(async () => {
		newTodo = new DBTodo(
			"todo1",
			"details",
			new Date(),
			false,
			"tagId",
		);

		await user.save();
	});

	it("adds a todo", async () => {
		const addedTodo = await user.addTodo(newTodo);

		const userWTodo = await User.findOne(
			{
				_id                        : user._id,
				[`todos.${addedTodo._id}`] : addedTodo
			},
			{
				todos : 1
			}
		);

		expect(userWTodo?.todos.has(addedTodo._id.toString())).toBe(true);
	});

	it("throws a NoTodoFoundError when deleting a nonexistent tag", async () => {
		await expect(user.deleteTodo("helwlofjeiowf")).rejects.toBeInstanceOf(
			NoTodoFoundError
		);
	});

	it("deletes a todo", async () => {
		const addedTodo = await user.addTodo(newTodo);

		const userWTodo = await User.findOne(
			{
				_id                        : user._id,
				[`todos.${addedTodo._id}`] : addedTodo
			},
			{
				todos : 1
			}
		);

		expect(userWTodo?.todos.has(addedTodo._id.toString())).toBe(true);

		const deletedTodo = await user.deleteTodo(addedTodo._id);

		const userWOTodo = await User.findById(user._id);

		expect(userWOTodo?.todos.has(deletedTodo._id.toString())).toBe(false);
	});

	it("throws a NoTodoFoundError when updating a nonexistent tag", async () => {
		await expect(
			user.updateTodo(
				new DBTodo(
					"",
					"details",
					new Date(),
					false,
					"tagId",
				)
			)
		).rejects.toBeInstanceOf(NoTodoFoundError);
	});

	it("selectively updates a todo w/o side-effects", async () => {
		const oldTodo = await user.addTodo(newTodo);
		const userWTodo = await User.findOne(
			{
				_id                      : user._id,
				[`todos.${oldTodo._id}`] : oldTodo
			},
			{
				todos : 1
			}
		);

		expect(userWTodo?.todos.has(oldTodo._id.toString())).toBe(true);

		const newTodoData = new DBTodo(
			"updatedTodo1",
			"details",
			new Date(),
			oldTodo.completed,
			"tagId",
			oldTodo._id
		);
		const updatedTodo = await user.updateTodo(newTodoData);
		const userWUTodo = await User.findById(user._id);
		const todoInStore = userWUTodo?.todos.get(updatedTodo._id.toString());

		expect(todoInStore?.title).toBe(updatedTodo.title);

		for (const key in Object.keys(updatedTodo).filter(k => k !== "title")) {
			expect(todoInStore?.[key as keyof typeof todoInStore]).toBe(
				oldTodo[key as keyof typeof oldTodo]
			);
		}
	});
});

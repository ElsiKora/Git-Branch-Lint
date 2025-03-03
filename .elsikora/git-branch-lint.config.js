export default {
	params: {
		name: ["[a-z0-9-]+"],
		type: ["feature", "hotfix", "support", "bugfix", "release"],
	},
	pattern: ":type/:name",
	prohibited: ["ci", "wip", "main", "test", "build", "master", "release", "dev", "develop"],
};

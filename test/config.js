module.exports = {
	suites: {
		node: {
			exec: 'node',
			env: 'lib/index.js::Postmask',
			tests: 'test/node.test'
		}
	}
};
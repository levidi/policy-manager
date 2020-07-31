const apollo = require('./utils/apolloFetch');
const graph = require('./graphql/index')

const token = process.env.GIT_PAT
const owner = process.env.GIT_OWNER
const nameRepo = process.env.GIT_REPO
const branch = process.env.GIT_BRANCH

apollo.setAuthorizationHeader(token)

const getRawFiles = (path) => (
    apollo.apolloFetch({
        query: graph.QUERY_FILES,
        variables: {
            owner,
            name: nameRepo,
            path: `${branch}:${path}`
        },
    })
)

module.exports = {
    getRawFiles
}
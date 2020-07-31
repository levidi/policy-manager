const QUERY_FILES = `
query RepoFiles($owner: String!, $name: String!, $path: String!) {
  repository(owner: $owner, name: $name) {
    object(expression: $path) {
      ... on Tree {
        entries {
          name
          object {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
}`;

module.exports = {
  QUERY_FILES
}
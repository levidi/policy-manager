const k8s = require('./k8s')
const git = require('./git');

const getDirFile = paths => paths.map(fullPath => fullPath.split('/'));

const verifyConfigMapExists = async (namespace, name) => {
    const {
        body,
        statusCode
    } = await k8s.getConfigmap(namespace, name)
    if (statusCode == 200) {
        console.log("Find configmap")
        console.log(body)
        return true
    }
    console.log("Not found configmap")
    return false
}

const newConfiguration =
    (listPath) => {
        listPath.forEach(async path => {
            let keysConfigMap = {}
            let config

            try {
                const body = await git.getRawFiles(path)
                if (body && body.data) {
                    const {
                        entries
                    } = body.data.repository.object

                    console.log(entries)
                    entries.forEach(item => {
                        if (!item.name.endsWith('_test.rego')) {
                            if (item.name == "config-policy.json") {
                                config = JSON.parse(item.object.text)
                            }
                            keysConfigMap[item.name] = item.object.text
                        }
                    })
                }
                console.log(keysConfigMap)
                if (config && keysConfigMap) {
                    let result
                    const nameConfigMap = `${config.namespace}-${path}-${config.regoQueryName}`
                    console.log("nameConfigMap: " + nameConfigMap)
                    const existis = await verifyConfigMapExists(config.namespace, nameConfigMap)
                    if (existis) {
                        console.log('replace configMap')
                        result = await k8s.replaceConfigmap(config.namespace, nameConfigMap, keysConfigMap)
                    } else {
                        console.log('creating configMap')
                        result = await k8s.createConfigmap(config.namespace, nameConfigMap, keysConfigMap)
                    }

                    console.log(result)
                } else {
                    console.log('delete configMap')
                }
            } catch (error) {
                console.log(error)
            }
        })
    }

const hook = (req, res) => {
    event = req.headers['x-github-event'] || req.headers['X-GitHub-Event']
    console.log('Event :', event)
    if (event && event == 'push') {
        console.log('Event is push')
        const {
            head_commit
        } = req.body
        const {
            added,
            removed,
            modified
        } = head_commit

        const listPath = new Set()
        console.log("added", added)
        console.log("removed", removed)
        console.log("modified", modified)
        getDirFile(added).forEach(df => {
            listPath.add(df[0])
        })
        getDirFile(removed).forEach(df => {
            listPath.add(df[0])
        })
        getDirFile(modified).forEach(df => {
            listPath.add(df[0])
        })
        if (listPath) {
            newConfiguration(listPath)
        }
    }
    return res.end()
};

module.exports = hook
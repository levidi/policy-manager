const fs = require('fs')
const request = require('request');

const baseURL = "https://kubernetes.default"
const ca = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/ca.crt').toString()
const auth = {
    bearer: fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token').toString()
}

const getPods = (namespace) => (
    new Promise((resolve, reject) => {
        const options = {
            ca,
            auth
        }
        request.get(`${baseURL}/api/v1/namespaces/${namespace}/pods`, options, (error, response, body) => {
            if (error) {
                console.log(`error: ${error}`);
                return reject(error)
            }
            if (response) {
                console.log(`statusCode: ${response.statusCode}`);
            }
            console.log(`body: ${body}`);
            return resolve(body)
        });
    })
)

const getConfigmap = (namespace, name) => (
    new Promise((resolve, reject) => {
        console.log("File k8s, getConfigmap: ", namespace, name)
        const options = {
            ca,
            auth
        }
        request.get(`${baseURL}/api/v1/namespaces/${namespace}/configmaps/${name}`, options, (error, response, body) => {
            if (error) {
                console.log(`error: ${error}`);
                return reject(error)
            }
            console.log(`statusCode: ${response.statusCode}`);
            console.log(`body: ${body}`);
            return resolve({
                body,
                statusCode: response.statusCode
            })
        });
    })
)

const createConfigmap = (namespace, name, data) => (
    new Promise((resolve, reject) => {
        const options = {
            ca,
            auth,
            json: {
                apiVersion: "v1",
                kind: "ConfigMap",
                metadata: {
                    namespace: namespace,
                    name: name
                },
                data
            }
        }
        request.post(`${baseURL}/api/v1/namespaces/${namespace}/configmaps`, options, (error, response, body) => {
            if (error) {
                console.log(`error POST: ${error}`);
                return reject(error)
            }
            console.log(`statusCode POST: ${response.statusCode}`);
            console.log(`body: ${body}`);
            return resolve({
                body,
                statusCode: response.statusCode
            })
        });
    })
)

const replaceConfigmap = (namespace, name, data) => (
    new Promise((resolve, reject) => {
        const options = {
            ca,
            auth,
            json: {
                apiVersion: "v1",
                kind: "ConfigMap",
                metadata: {
                    namespace: namespace,
                    name: name
                },
                data
            }
        }
        request.put(`${baseURL}/api/v1/namespaces/${namespace}/configmaps/${name}`, options, (error, response, body) => {
            if (error) {
                console.log(`error PUT: ${error}`);
                return reject(error)
            }
            console.log(`statusCode PUT: ${response.statusCode}`);
            console.log(`body: ${body}`);
            return resolve({
                body,
                statusCode: response.statusCode
            })
        });
    })
)

module.exports = {
    getPods,
    getConfigmap,
    createConfigmap,
    replaceConfigmap
}
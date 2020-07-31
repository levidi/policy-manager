const express = require('express');
const bodyParser = require('body-parser');
const hook = require('./hook')

const app = express();
app.use(bodyParser.json());

app.post('/policy', hook)

app.get('/', (req, res, next) => {
    return res.send('ok')
})

const port = process.env.PORT || 3003
const hostname = process.env.HOST_NAME || '0.0.0.0'
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./src/routes');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(routes);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
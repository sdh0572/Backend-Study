var express = require('express');
var router = express.Router();
var template = require('../lib/template');

router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px" />`,
        `<a href="/topic/create">create</a>`);
    response.send(html);
});

module.exports = router;
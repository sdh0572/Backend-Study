var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');

router.get('/create', function (request, response) {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
          <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"/></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit"/>
          </p>
          </form>
          `, ``);
    response.send(html);
});

router.post('/create_process', function (request, response) {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {// 다른 코드 : (err) => {}
        response.redirect(`/topic/${title}`);
    });
});

router.get('/update/:pageId', function (request, response) {
    var filterdId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filterdId}`, 'utf8', function (err, description) {
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.HTML(title, list,
            `
          <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit"/>
          </p>
          </form>
          `,
            `<a href="/topic/create">create</a> <a href="/topic/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(html);
    });
});

router.post('/update_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {// 다른 코드 : (err) => {}
            response.redirect(`/topic/${title}`);
        });
    });
});

router.post('/delete_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var filterdId = path.parse(id).base;
    fs.unlink(`data/${filterdId}`, function (error) {
        response.redirect("/");
    });
});

router.get('/:pageId', (request, response, next) => {
    var filterdId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filterdId}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        } else {
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(request.list);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}" />
              <input type="submit" value="delete" />
            </form>
           `);
            response.send(html);
        }
    });
});

module.exports = router;
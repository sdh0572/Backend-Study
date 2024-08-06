const express = require('express');
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
const helmet = require('helmet');
app.use(helmet());

var topicRouter = require('./route/topic');
var indexRouter = require('./route/index');

app.use(express.static('public')); //public 폴더 안에서 static파일을 찾음(public말고 다른 폴더에 접근하지 못함)
app.use(bodyParser.urlencoded({ extended: false })); //데이터를 받기 위해 사용
app.use(compression()); //데이터를 받을 때 자동으로 사용(압축)
app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next(); //다음에 미들웨어를 실행시킴
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use(function (req, res, next) {//미들웨어는 순차적으로 실행되기 때문에 맨 마지막에 작성
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next){//next(err)를 하면 이 미들웨어가 무조건 실행하여 오류처리
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000!`)
});


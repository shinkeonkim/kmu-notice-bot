const express = require('express')
const log = console.log
var axios = require('axios')
var cheerio = require('cheerio')

var app = express()
var serverPort = 3001

const getHtml = async () => {
    try {
        return await axios.get("https://cs.kookmin.ac.kr/news/notice/rss")
    }
    catch(error) {
        console.error(error)
    }
};

app.listen(serverPort,function() {
    log('server on port ' + serverPort)
});

app.get('/',function(request,response){
    res.send("test")
})

app.post('/api/keyword_check', function(request,response) {
    var data = request.query['keyword']
    var re = "[]\"\'"
    for(var i in re) {
        while(data.indexOf(re[i]) > -1) {
            data = data.replace(re[i],"")
        }
    }
    var keyword = data.split(",")
    for(var i in keyword) {
        keyword[i] = keyword[i].trim()
    }

    var result = getHtml()
    .then(html => {
        let itemList = []
        var $ = cheerio.load(html.data)
        var $bodyList = $("channel").children("item");

        $bodyList.each(function(i, elem) {
            itemList[i] = {
                title: $(this).find('title').text(),
                date: $(this).find('pubDate').text()
          };
        });
    
        const data = itemList.filter(n => n.title);
        return data;
    })
      .then(res => {
        var findList = keyword
        var check = false
        var retList = []
        for(var i = 0; i<10 && i < res.length; i++) {
            for(var j = 0; j <findList.length; j++) {
                if(res[i].title.indexOf(findList[j])!=-1) {
                    check = true
                }
            }
            retList.push(res[i].title)    
        }
        ret = {"result": false, "retList": retList}
        if(check) {
            ret["result"] = true
        }
        response.send(ret)
    })
})








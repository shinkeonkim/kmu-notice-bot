var axios = require('axios')
var cheerio = require('cheerio')
var log = console.log

const getHtml = async () => {
    try {
        return await axios.get("https://cs.kookmin.ac.kr/news/notice/rss")
    }
    catch(error) {
        console.error(error)
    }
};

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
        var findList = ["조교", "학부 조교", "학부조교", "헬퍼"]
        var ret = false
        for(var i = 0; i<10 && i < res.length; i++) {
            for(var j = 0; j <findList.length; j++) {
                if(res[i].title.indexOf(findList[j])!=-1) {
                    ret = true
                }
            }            
            log(res[i].title)            
        }
        if(ret) {
            log("Go cs.kookmin.ac.kr")
        }
    });


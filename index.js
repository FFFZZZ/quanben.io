// npm下载模块后，引入cheerio模块
let cheerio = require("cheerio");
// 引入fs文件模块，帮助爬取的页面写入文件里面
let fs = require("fs");
// 引入请求模块
let request = require("request");

function download(page) {
    return new Promise((resolve, reject) => {
        request(
            `https://www.quanben.io/n/dasongxingbuzhenjidangan/${page}.html`,
            (err, res, body) => {
                if (err) reject(); //如果请求报错就退出

                // 类似于jquery选择器返回$，
                // Cheerio的选择器实现与jQuery几乎相同，因此API非常相似。
                let $ = cheerio.load(body);
                const title = $("h1.headline").text();
                const list = []
                $(".articlebody > #content > p").each(function (i) {
                    if ($(this).text() != ".")
                        list.push($(this).text())
                })
                resolve({ title, list });
            }
        );
    });
}

async function loopWork(total) {
    for (let index = 1; index <= total; index++) {
        const article = await download(index);
        const { title, list } = article;
        console.log(`${index}.${title}`)
        fs.appendFileSync("大宋.txt", `\r\n${title}\r\n\r\n${list.map(c => "    " + c).join("\r\n\r\n")}`);
    }
}

loopWork(852);

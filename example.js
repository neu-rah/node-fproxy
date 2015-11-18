var fs=require("fs");
var path=require("path");
var fProxy=require("fproxy");
var textFile=fProxy({
          tag:function(url) {return path.resolve(process.cwd(), url);},
          load:function(url) {return fs.readFileSync(url).toString();},
          post:function(tag,item) {
            if (item.watcher) item.watcher.close();
            item.watcher=fs.watch(tag, function(event, filename){item.refresh();});
          }
        });
var text=textFile("package.json");//text is a functional file
console.log(text());//updated file content

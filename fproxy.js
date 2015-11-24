"use strict";

var debug=module.id==="repl";
var log=debug?console.log:function(){};
var fs=require("fs");
var path=require("path");
var swear=require("node-swear");
log("Debug module fProxy loaded into ["+module.id+"] environment")

/**
 * media descriptor for fProxy
 * describes tag, load, post, parse
 * methods store, refresh, close are added by the proxy and have access to proxy internal data
 */
// raw memory descriptor
class mediaItem {
  constructor(url,item,parser,data) {
    this.url=url;
    this.utag=mediaItem.tag(url);
    this.parser=parser;
    this.data=data;
    this.item=item;
    this.ver=0;
  }
  static tag(url) {return url;}
  load() {return this.data;}
  post() {}
  delayed() {return false;}
}

//sync/assync file system
class mediaFS extends mediaItem {
  static tag(url) {return path.resolve(process.cwd(),url);}
  ready(callback,err,data) {
    if (err) throw err;
    return callback(this.parser(data));
  }
  load(callback) {
    if (callback) return fs.readFile(this.url,this.ready.bind(this,callback));
    else return fs.readFileSync(this.url);
  }
  post() {
    if (this.watcher) this.watcher.close();
    this.watcher=fs.watch(this.url, this.refresh);
  }
}

//ES6 promise rerturning assync file system
class mediaPFS extends mediaFS {
  load() {return this.store(swear(fs.readFile))(this.url).then(o=>o.toString());}
  //refresh() {return new Promise();}
  delayed() {return true;}
}

/**
 * functional lazy javascript proxy
 * var fProxy=require("fproxy");// media setup function
 * var localTextFile=fProxy(fProxy.mediaDescriptors.file, formatParser);//raw souce media description
 * var myTextFile=localTextFile("filename.txt");//functional file
 * myTextFile();//the file content text
 */
var fProxy=module.exports=function setProxyMedia(media,parser) {
  media=media||mediaItem;
  var dp={};//this is at media level because of watchers (unicity)
  parser=parser||(o=>o);
  return function proxyItem(url,data) {
    var exists=dp[media.tag(url)];
    if (exists) {
      //log("creation cache!");
      if (data) exists.store(exists.parser(data));//redefine value
      return exists.item;//existing!
    }
    //log("CREATING NEW ITEM",url);
    var ver=0;
    var item=function proxyDoc(callback) {//file function
      if (item.proxy&&dp[item.proxy.utag]&&ver===item.proxy.ver) {
        //log("usage cache!");
        if (callback) return callback(item.proxy.data);
        else return dp[item.proxy.utag].data;
      }
      item.ver=ver;
      var tmp=item.proxy.load.apply(item.proxy,arguments);
      if (!(callback||item.proxy.delayed())) tmp=parser(tmp);
      if (tmp) item.proxy.store(tmp);
      return tmp;
    }
    item.proxy=new media(url,item,parser,data);
    //setup new item
    item.proxy.close=function() {delete dp[item.utag];}
    item.proxy.refresh=function() {ver++;}
    item.proxy.store=function(o) {
      this.data=o;
      dp[this.utag]=this;
      this.refresh();
      this.ver=++ver;
      this.post();
      return o;
    }
    return item;
  }
  setDocParser.dp=dp;
  return setDocParser;
}
/*module.exports.mem=fProxy.bind(this,mediaItem);
module.exports.file=fProxy.bind(this,mediaFS);
module.exports.http=fProxy.bind(this,mediaHTTP);*/
module.exports.mediaDescriptors={
  mem:  mediaItem,
  fs:   mediaFS,
  file: mediaPFS,
}

if (debug) {//debuging with repl inside module [https://github.com/neu-rah/nit]
  var memFile=fProxy();
  var myMemFile=memFile("myMemFile",null,"Some content here");
  log("myMemFile:",myMemFile());

  var localFile=fProxy(mediaFS,o=>o.toString());
  var myTextFile=localFile("test/resources/test.txt");

  var assyncFile=fProxy(mediaFS,o=>o.toString());
  var myAssyncTextFile=assyncFile("test/resources/test.txt");

  var textFile=fProxy(mediaPFS,o=>o.toString());
  var txt=textFile("test/resources/test.txt");

  var tst=function() {
    log("memFile",myMemFile());
    log("textFile",myTextFile());
    log("assync fs",myAssyncTextFile(o=>log(o)));
    log("Promise",txt().then(o=>log(o)));
  }
}

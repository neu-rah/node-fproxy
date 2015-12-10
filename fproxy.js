"use strict";

var debug=module.id==="repl";
var log=debug?console.log:function(){};
var fs=require("fs");
var path=require("path");

//just values
class Mem {
  constructor(parser) {this.parser=parser;}
  refresh() {this.data=null;}
  close() {this.refresh();}
  load(o) {return this.parser(o);}
  static tag(o) {return o;}
}

//function arguments or json
class Params extends Mem {load() {return this.parser(arguments);}}

//Objects
class Obj extends Mem {
  load() {
    //log("new object",this,arguments);
    Array.prototype.unshift.call(arguments,this);
    return new (this.parser.bind.apply(this.parser,arguments));
  }
}

class Files extends Mem {
  static tag(url) {return path.resolve(process.cwd(),url);}
  ready(callback,err,data) {
    if (err) callback(err);
    else callback(err,this.parser(data));
  }
  close() {
    this.refresh();
    if (this.watcher) this.watcher=this.watcher.close();
  }
  load(url,callback) {
    //log(arguments);
    if (this.watcher) this.watcher.close();
    var data;
    if (callback) fs.readFile(url,this.ready.bind(this,callback));
    else data=this.parser(fs.readFileSync(url));
    this.watcher=fs.watch(url, this.refresh.bind(this));
    return data;
  }
}

//the proxy thing
var fProxy=module.exports=function fProxy(media,defaultParser) {
  media=media||Mem;
  defaultParser=defaultParser||(o=>o);
  return function itemSetup() {
    var args=arguments;
    var item=new media(defaultParser);
    var fi=(function itemAccess(callback){
      if (this.data&&callback) callback(null,this.data);
      else return this.data||(this.data=this.load.apply(this,callback?Array.prototype.slice.call(args).concat([callback]):args));
    }).bind(item);
    fi.proxy=item;
    return fi;
  }
}

module.exports.mediaDescriptors={
  mem:  Mem,
  args: Params,
  obj:  Obj,
  file: Files,
}

if (debug) {
  log("DEBUG!");
  this.module=module;
  var include=require("simple-loader")(this);//this is repl (debug)
  include("dev/debug.js");
}

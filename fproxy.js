"use strict";

var debug=module.id==="repl";
var log=debug?console.log:function(){};
log("Debug module lazy-docs loaded into ["+module.id+"] environment")

// functional lazy javascript proxy
var fProxy=module.exports=function fProxy(builder) {
  builder=builder||{
    tag:function(t) {return t;},
    load:function(tag,o) {return o;},
    post:function() {}
  };
  var pd={};
  return function(tag) {
    log("proxy tag:",arguments);
    var utag=builder.tag.apply(this,arguments);
    var args=arguments;
    var ver=0;
    var item=function() {
      if (pd[utag]&&ver===item.ver) return pd[utag];
      ver=item.ver;
      var tmp=builder.load.apply(this,args);
      return tmp?(builder.post(tag,item),pd[utag]=tmp):tmp;
    };
    item.close=function() {delete pd[utag];}
    item.refresh=function() {this.ver++;}
    item.ver=ver;
    return item;
  }
}

if (debug) {//debuging with repl inside module [https://github.com/neu-rah/nit]
  var memFile=fProxy();
  var myMemFile=memFile("myMemFile","Some content here");
  log(myMemFile());
}

"use strict";

var swear=require("node-swear");
var libxml = require("libxmljs");

var log=console.log;
var fProxy=module.exports;

function Obj() {this.storedParams=arguments;}

var data=fProxy();
var s=data("some text data");
var so=data(new Obj("Ok"));

var params=fProxy(fProxy.mediaDescriptors.json);
var p=params(1,2,3);

var obj=fProxy(fProxy.mediaDescriptors.obj,Obj);
var o=obj("test",1);

var txt=fProxy(fProxy.mediaDescriptors.file,o=>o.toString());
var t=txt("test/resources/test.txt");
log("assync access",t((e,o)=>log("assync:",e||o)));
log("ES6 Proms",swear(t)().then(o=>log("es6 proms:",o)))
log("sync access",t());

var xml=fProxy(fProxy.mediaDescriptors.file,libxml.parseXml);
var x=xml("test/resources/test.xml");
var xt=txt("test/resources/test.xml");

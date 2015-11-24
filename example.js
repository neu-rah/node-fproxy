//using ES6 Promise returning file reader
var fProxy=require("fproxy");
var textFile=fProxy(fProxy.mediaDescriptors.file,o=>o.toString());
var text=textFile("test/resources/test.txt");
text().then(o=>console.log("Text:",o));//get updated & parsed document
//do some external changes to the text file
text().then(o=>console.log("Updated:",o));//get updated & parsed document

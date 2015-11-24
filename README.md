# fproxy #
==========

**generic javascript functional lazy proxy abstraction**

Functional generic proxy stores a set of tags and information and return a function to retrieve them.

### examples

```javascript
//using ES6 Promise returning text file reader
var fProxy=require("fproxy");
var textFile=fProxy(fProxy.mediaDescriptors.file,o=>o.toString());
var text=textFile("test/resources/test.txt");
text().then(o=>console.log("Text:",o));//get updated & parsed document
//do some external changes to the text file
text().then(o=>console.log("Updated:",o));//get updated & parsed document
```

```javascript
//using local file system text file reader
var fProxy=require("fproxy");
var textFile=fProxy(fProxy.mediaDescriptors.fs,o=>o.toString());
var text=textFile("test/resources/test.txt");
text(o=>console.log("Text:",o));//get updated & parsed document
//do some external changes to the text file
text(o=>console.log("Text:",o));//get updated & parsed document
console.log(text());//get file content in sync mode (no callback provided)
```

The abstraction allow implementation of file watchers [see lazy-doc](https://github.com/neu-rah/lazy-docs).

fproxy must be initialized with a media descriptor. The media descriptor has the option to be sync or assync.

A set o media descriptors is available at:
>require("fproxy").mediaDescriptors

media descriptors are ES6 classes

mem:  mediaItem, memory storage
fs:   mediaFS, sync/assync file system
file: mediaPFS, ES6 promise return file system

#media descriptor#

media descriptor is a class with:

**constructor**

**tag**: functions to transform the tag before it being used in proxy (on fs this is tipical relative to absolute path)

signature:

>function(tagString) {return tagString;}

**load**: function to transform the data (load the document by parsing string data)

signature:

>function(stringData) {return parse(stringData);}

**post**: function to fine-tune the proxy object (on fs its the place to add/remove watchers),
this function is called after the load and every time the document refreshes.

signature:

>function(proxyItem) {}

**delayed**: returns true for if media defaults to assync.

signature:

>function() {return false}


#The returned function has a **proxy** member with functions:#

**.close**: remove item from proxy cache

>.close()

**.refresh**: update internal version counter resulting in reload on next request

>.refresh()

**.store**: set cache data and update version counter

>.store(data)

#inocuous#

- result document is not polluted with any property of this module.
- client receives no information/access about neighbor objects.

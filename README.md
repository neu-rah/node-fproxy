fproxy
======

**generic javascript functional lazy proxy abstraction**

Functional generic proxy stores a set of tags and information and return a function to retrieve them.

This is latter implemented for specific media types, like file system and for specific file
formats like xml.

The abstraction allow implementation of file watchers [see lazy-doc](https://github.com/neu-rah/lazy-docs).

fproxy must be initialized with a media descriptor. The media descriptor as the option to be sync or assync.

#media descriptor#

media descriptor is an object with 3 member functions

**tag**: functions to transform the tag before it being used in proxy (on fs this is tipical relative to absolute path)

signature:

>function(tagString) {return tagString;}

**load**: function to transform the data (load the document by parsing string data)

signature:

>function(stringData) {return parse(stringData);}

**post**: function to fine-tune the proxy object (on fs its the place to add/remove watchers),
this function is called after the load and every time the document refreshes.

signature:

>functions(proxyItem) {}

#The returned function has members:#

**.close**: remove item from proxy cache

**.refresh**: update internal version counter resulting in reload on next request

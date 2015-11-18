'use strict';

var fs=require("fs");
var path=require("path");
var should = require('should');

var fProxy;
var textFile;
var myFile;

describe('fproxy', function() {
  describe('module load', function() {
    it('should return a setup function', function() {
			fProxy=require("fproxy");
			fProxy.should.be.type('function');
		});
	});

  describe('file factory', function() {
    it('should return a text loader function', function() {
      textFile=fProxy({
          tag:function(url) {return path.resolve(process.cwd(), url);},
          load:function(url) {return fs.readFileSync(url).toString();},
          post:function(tag,item) {
            if (item.watcher) item.watcher.close();
            item.watcher=fs.watch(tag, function(event, filename){item.refresh();});
          }
        });
      textFile.should.be.type('function');
    });
  });

  describe('file reader', function() {
    it('should return functional file reader', function() {
			myFile=textFile("test/resources/text.txt");
      myFile.should.be.type('function');
		});
	});

  describe('read file', function() {
    it('should return the file content', function() {
			myFile().should.be.type('string');
      myFile().should.match(/this is a text file/);
		});
	});

});

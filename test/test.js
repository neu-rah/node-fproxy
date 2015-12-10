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

  describe('memory media (default)', function() {
    it('should stor/retrive a value', function() {
      (fProxy()("some value")).should.match(/some value/);
    });
  });

  describe('params media', function() {
    it('should stor/retrive function arguments', function() {
      var test=fProxy(fProxy.mediaDescriptors.args)(1,2,3)();
      test.should.be.type('object');
    });
  });

  describe('object media', function() {
    it('should create+stor/retrive new objects', function() {
      function Obj() {this.storedParams=arguments;}
      var test=fProxy(fProxy.mediaDescriptors.obj,Obj)("Ok")();
      test.should.be.type('object');
      test.storedParams.should.be.type('object');
      test.storedParams[0].should.match(/Ok/);
    });
  });

  describe('file media', function() {
    it('should return a file media handler function', function() {
			textFile=fProxy(fProxy.mediaDescriptors.file,o=>o.toString());
			textFile.should.be.type('function');
		});
	});

  describe('file reader', function() {
    it('should return functional file reader', function() {
			myFile=textFile("test/resources/test.txt");
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

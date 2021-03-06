'use strict';

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */

var assert = require('../../utils/assert.js');
var preq = require('preq');

module.exports = function (config) {

    describe('item requests', function() {
        it('should respond to OPTIONS request with CORS headers', function() {
            this.timeout(20000);
            return preq.options({ uri: config.bucketURL + '/Foobar/html/624484477' })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
                assert.deepEqual(res.headers['access-control-allow-origin'], '*');
                assert.deepEqual(res.headers['access-control-allow-methods'], 'GET');
                assert.deepEqual(res.headers['access-control-allow-headers'], 'accept, content-type');
            });
        });
        it('should transparently create a new HTML revision with id 624484477', function() {
            this.timeout(20000);
            return preq.get({
                uri: config.bucketURL + '/Foobar/html/624484477',
                headers: { 'content-type': 'text/html' },
                body: 'Hello there'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
            });
        });
        it('should transparently create data-parsoid with id 624165266, rev 2', function() {
            this.timeout(20000);
            return preq.get({
                uri: config.bucketURL + '/Foobar/html/624165266'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
            });
        });
        it('should create a new html revision using proxy handler with id 624484444', function() {
            this.timeout(40000);
            return preq.put({
                uri: config.baseURL + '/test/Foo/wikitext/624484444',
                headers: { 'content-type': 'text/html' },
                body: 'Hello there'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
            });
        });

        it('should return HTML just created with revision 624484477', function() {
            return preq.get({
                uri: config.bucketURL + '/Foobar/html/624484477'
            })
            .catch(function(err) { console.log(err); })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
            });
        });
        it('should return HTML just created by revision 624165266', function() {
            return preq.get({
                uri: config.bucketURL + '/Foobar/html/624165266'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
                assert.deepEqual(res.headers['content-type'], 'text/html; charset=UTF-8');
            });
        });
        it('should return data-parsoid just created by revision 624165266, rev 2', function() {
            return preq.get({
                uri: config.bucketURL + '/Foobar/data-parsoid/624165266'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
                assert.deepEqual(res.headers['content-type'], 'application/json; profile=mediawiki.org/specs/data-parsoid/1.0');
            });
        });

        it('should return data-parsoid just created with revision 624484477, rev 2', function() {
            return preq.get({
                uri: config.bucketURL + '/Foobar/data-parsoid/624484477'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
                assert.deepEqual(res.headers['content-type'], 'application/json; profile=mediawiki.org/specs/data-parsoid/1.0');
            });
        });

        it('should return a new wikitext revision using proxy handler with id 624165266', function() {
            this.timeout(20000);
            return preq.get({
                uri: config.baseURL + '/test/Foobar/wikitext/624165266',
                headers: { 'content-type': 'text/wikitext' },
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
            });
        });
        it('should accept a new html save with a revision', function() {
            return preq.put({
                uri: config.bucketURL + '/Foobar/html/76f22880-362c-11e4-9234-0123456789ab',
                headers: { 'content-type': 'text/html; charset=UTF-8' },
                body: 'Hello there'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 201);
            })
            .catch(function(e) {
                console.dir(e);
                throw e;
            });
        });
        it('should return the HTML revision just created', function() {
            return preq.get({
                uri: config.bucketURL + '/Foobar/html/624484477'
            })
            .then(function(res) {
                assert.deepEqual(res.status, 200);
                assert.deepEqual(res.headers['content-type'], 'text/html; charset=UTF-8');
                assert.deepEqual(res.headers.etag, '76f22880-362c-11e4-9234-0123456789ab');
                assert.deepEqual(res.body, 'Hello there');
            });
        });

    });
};

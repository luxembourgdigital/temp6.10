#!/usr/bin/env node

var xml2js = require('xml2js');
var sugar = require('sugar');
var fs = require('fs');




var filename = './platforms/android/AndroidManifest.xml';
var manifest = fs.readFileSync(filename, 'utf8');

xml2js.parseString(manifest, {}, function(err, obj) {


    // Add / Remove / Update Android Manifest
    //
    /*
        obj.manifest.application[0]['meta-data'].push({
            '$': {
                'android:name': 'PW_APPID',
                'android:value': PW_APPID
            }
        })
    */

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.writeFileSync(filename, xml, 'utf8');


});

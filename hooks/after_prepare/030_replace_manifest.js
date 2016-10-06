#!/usr/bin/env node

var fs = require('fs');

function replace(to_replace, replace_with) {
    var filename = './platforms/android/AndroidManifest.xml';
    var manifest = fs.readFileSync(filename, 'utf8');
    var result = manifest.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

//replace('PACKAGE_NAME', 'com.example');

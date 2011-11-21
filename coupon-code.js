var symbolsStr = '0123456789ABCDEFGHJKLMNPQRTUVWXY';
var symbolsArr = symbolsStr.split('');
var symbolsObj = {};
var i = 0;
symbolsStr.split('').forEach(function(c) {
    symbolsObj[c] = i;
    i++;
});

module.exports.generate = function(parts) {
    parts = parts || 3;
};

module.exports.validate = function(opts) {
    if ( !opts ) {
        return '';
    }

    // turn the string into a set of options
    if ( typeof opts === 'string' ) {
        opts = { code : opts, parts : 3 };
    }

    // default parts to 3
    opts.parts = opts.parts || 3;

    // if we have been given no code, this is not valid
    if ( !opts.code ) {
        return '';
    }

    var code = opts.code;

    // uppercase the code, take out any random chars and replace OIZS with 0125
    code = code.toUpperCase();
    code = code.replace(/[^0-9A-Z]+/g, '');
    code = code.replace(/O/g, '0');
    code = code.replace(/I/g, '1');
    code = code.replace(/Z/g, '2');
    code = code.replace(/S/g, '5');

    // split in the different parts
    var parts = [];
    var tmp = code;
    while( tmp.length > 0 ) {
        parts.push( tmp.substr(0, 4) );
        tmp = tmp.substr(4);
    }

    // make sure we have been given the same number of parts as we are expecting
    if ( parts.length !== opts.parts ) {
        return '';
    }

    // validate each part
    var part, str, check;
    for ( var i = 0; i < parts.length; i++ ) {
        part = parts[i];
        // check this part has 4 chars
        if ( part.length !== 4 ) {
            return '';
        }

        // split out the data and the check
        data = part.substr(0, 3);
        check = part.substr(3, 1);

        if ( check !== checkDigitAlg1(data, i+1) ) {
            return '';
        }
    }

    // everything looked ok with this code
    return parts.join('-');
};

// returns the checksum character for this (data/part) combination
function checkDigitAlg1(data, check) {
    // check's initial value is the part number (e.g. 3 or above)

    // loop through the data chars
    data.split('').forEach(function(v) {
        var k = symbolsObj[v];
        check = check * 19 + k;
    });

    return symbolsArr[ check % 31 ];
}
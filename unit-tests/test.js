/*!
 * Created by mschwartz on 4/29/15.
 */

var {test_main, suite, test, assert} = require('Tests');

var AWS = require('decaf-aws').AWS,
    aws = new AWS();

console.log('Selected region: ' + aws.region);

test_main('tests');

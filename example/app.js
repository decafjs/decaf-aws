/*!
 * Created by mschwartz on 4/27/15.
 */

require.paths.unshift('..');
var AWS = require('../lib/AWS').AWS;

var aws = new AWS();

console.dir(aws.currentRegion());
var s3 = aws.getS3Client();
console.dir(s3);
/*!
 * Created by mschwartz on 4/27/15.
 */

var AWS = require('decaf-aws').AWS,
    aws = new AWS();

console.dir(aws.region);
debugger;
var s3 = aws.getS3Client();

console.log('creating bucket');
debugger
var region = s3.createBucket('decaf-bucket-test');
console.dir(region);

console.log('uploading bower.json');
s3.putFilePublic('decaf-bucket-test', 'foo', 'bower.json');

console.log(s3.getUrl('decaf-bucket-test', 'foo'));

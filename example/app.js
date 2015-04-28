/*!
 * Created by mschwartz on 4/27/15.
 */

var AWS = require('decaf-aws').AWS,
    aws = new AWS();

console.dir(aws.region);
var s3 = aws.getS3Client();

console.dir(s3.listBuckets());

s3.use('decafBucketTest');

if (arguments[1] === 'delete') {
    s3.decafBucketTest.remove('foo');
    console.log('deleted');
}
else {
    console.log('creating bucket');
    console.log('uploading bower.json');
    s3.decafBucketTest.putFile('foo', 'bower.json');

    console.log('URL to uploaded oject: ' + s3.decafBucketTest.url('foo'));
}

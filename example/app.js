/*!
 * Created by mschwartz on 4/27/15.
 */

var AWS = require('decaf-aws').AWS,
    aws = new AWS();

console.log('Selected region: ' + aws.region);
var s3 = aws.getS3Client();

console.log('S3 Bucket List:');
console.dir(s3.listBuckets());

console.log('using S3 bucket: decafBucketTest');
s3.use('decafBucketTest');

if (arguments[1] === 'delete') {
    console.log('deleting item foo');
    s3.decafBucketTest.remove('foo');
}
else {
    console.log('creating item foo');
    console.log('uploading bower.json');
    s3.decafBucketTest.putFile('foo', 'bower.json');

    console.log('URL to uploaded oject: ' + s3.decafBucketTest.url('foo'));
}
console.log('Items in bucket:');
console.dir(s3.decafBucketTest.listItems());
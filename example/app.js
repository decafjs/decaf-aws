/*!
 * Created by mschwartz on 4/27/15.
 */

var AWS = require('decaf-aws').AWS,
    aws = new AWS();

console.dir(aws.region);
var s3 = aws.getS3Client();

if (arguments[1] === 'delete') {
    s3.remove('decaf-bucket-test', 'foo');
    console.log('deleted');
}
else {
    console.log('creating bucket');
    var region = s3.createBucket('decaf-bucket-test');
    console.dir(region);

    console.log('uploading bower.json');
    s3.putFilePublic('decaf-bucket-test', 'foo', 'bower.json');

    console.log('URL to uploaded oject: ' + s3.getUrl('decaf-bucket-test', 'foo'));
}

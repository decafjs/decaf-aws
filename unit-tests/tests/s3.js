/**
 * Created by mschwartz on 4/29/15.
 */

(function () {
    var s3 = aws.getS3Client();

    suite('s3-list', function () {
        console.log('S3 Bucket List:');
        console.dir(s3.listBuckets());
    });

    suite('s3-create', function () {

        console.log('using S3 bucket: decafBucketTest');
        s3.use('decafBucketTest');

        console.log('creating item foo');
        console.log('uploading bower.json');
        s3.decafBucketTest.putFile('foo', 'bower.json');

        console.log('URL to uploaded oject: ' + s3.decafBucketTest.url('foo'));
        console.log('Items in bucket:');
        console.dir(s3.decafBucketTest.listItems());
    });

    suite('s3-remove', function () {
        console.log('deleting item foo');
        s3.decafBucketTest.remove('foo');
        console.dir(s3.listBuckets());
    });

}());

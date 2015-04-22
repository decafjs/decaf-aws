/**
 * AmazonS3 Service
 * @author Alex Lazar
 * */

/*global decaf, require */

var AWS_AmazonS3                   = Packages.com.amazonaws.services.s3.AmazonS3,
    AWS_AmazonS3Client             = Packages.com.amazonaws.services.s3.AmazonS3Client,
    AWS_Bucket                     = Packages.com.amazonaws.services.s3.model.Bucket,
    AWS_GetObjectRequest           = Packages.com.amazonaws.services.s3.model.GetObjectRequest,
    AWS_ListObjectsRequest         = Packages.com.amazonaws.services.s3.model.ListObjectsRequest,
    AWS_ObjectListing              = Packages.com.amazonaws.services.s3.model.ObjectListing,
    AWS_PutObjectRequest           = Packages.com.amazonaws.services.s3.model.PutObjectRequest,
    AWS_S3Object                   = Packages.com.amazonaws.services.s3.model.S3Object,
    AWS_S3ObjectSummary            = Packages.com.amazonaws.services.s3.model.S3ObjectSummary;

function AmazonS3(config) {

}

decaf.extend(AmazonS3.prototype, {

});

decaf.extend(exports, {
    AmazonS3: AmazonS3
});

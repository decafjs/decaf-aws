/*!
 * Created by mschwartz on 4/27/15.
 */

var File                     = java.io.File,
    AWSRegions               = com.amazonaws.regions.Regions,
    CannedAccessControlList  = com.amazonaws.services.s3.model.CannedAccessControlList,
    ObjectMetaData           = com.amazonaws.services.s3.model.ObjectMetadata,
    PutObjectRequest         = com.amazonaws.services.s3.model.PutObjectRequest,
    //DeleteObjectRequest      = com.amazonaws.services.s3.model.DeleteObjectRequest,
    CreateBucketRequest      = com.amazonaws.services.s3.model.CreateBucketRequest,
    GetBucketLocationRequest = com.amazonaws.services.s3.model.GetBucketLocationRequest;

function makeMetaData(metadata) {
    var m = new ObjectMetaData();
    if (metadata) {
        decaf.eacH(metadata, function (value, key) {
            switch (key.toLowerCase()) {
                case 'cachecontrol':
                case 'cache-control':
                    m.setCacheControl(value);
                    break;
                case 'contentdisposition':
                case 'content-disposition':
                    m.setContentDisposition(value);
                    break;
                case 'contentencoding':
                case 'content-encoding':
                    m.setContentEncoding(value);
                    break;
                case 'expirationtime':
                case 'expiration-time':
                    m.setExpirationTime(value);
                    break;
                case 'expiresdate':
                case 'expires-date':
                    m.setHttpExpiresDate(value);
                    break;
            }
        });
    }
    return m;
}

function S3Client(credentials, region) {
    var client = this.client = new com.amazonaws.services.s3.AmazonS3Client(credentials);
    this.region = region;
    client.setRegion(AWSRegions.fromName(region));
}
decaf.extend(S3Client.prototype, {
    set region(name) {
        this._region = name;
    },
    get region() {
        return this._region;
    },
    /**
     * Get a list of existing buckets.
     *
     * The objects returned are of the form:
     * @returns {Array.<Object>} buckets
     * @return {String} buckets.name name of bucket
     * @return {Date} bucket.creationDate date bucket was created
     */
    listBuckets: function() {
        var bucket,
            buckets = [],
            rawBuckets = this.client.listBuckets();

        for (bucket in Iterator(rawBuckets)) {
            buckets.push({
                creationDate: new Date(bucket.getCreationDate().getTime()),
                name: String(bucket.getName())
            });
        }
        return buckets;
    },
    doesBucketExist : function (name) {
        return !!this.client.doesBucketExist(name);
    },
    bucketRegion    : function (name) {
        return String(this.client.getBucketLocation(new GetBucketLocationRequest(name)));
    },
    createBucket    : function (name) {
        if (!this.doesBucketExist(name)) {
            console.log('bucket does not exist')
            this.client.createBucket(new CreateBucketRequest(name));
        }
        return this.bucketRegion(name);
    },
    /**
     * Upload a file to S3 bucket and make it public
     *
     * @param {String} bucket name of bucket
     * @param {String} key in bucket to upload to
     * @param {String} filename name of file to upload
     */
    putFilePublic   : function (bucket, key, filename) {
        var putObj = new PutObjectRequest(bucket, key, new File(filename));
        putObj.withCannedAcl(CannedAccessControlList.PublicRead);
        this.client.putObject(putObj);
    },
    /**
     * Upload a file to S3 bucket and make it private
     *
     * @param {String} bucket name of bucket
     * @param {String} key in bucket to upload to
     * @param {String} filename name of file to upload
     */
    putFilePrivate  : function (bucket, key, filename) {
        var putObj = new PutObjectRequest(bucket, key, new File(filename));
        putObj.withCannedAcl(CannedAccessControlList.Private);
        this.client.putObject(putObj);
    },
    /**
     * Upload a string or byte array to a S3 bucket
     *
     * @param {String} bucket name of bucket
     * @param {String} key in bucket to upload to
     * @param {String|Byte Array} data string or byte array to upload
     * @param [Object] optional metadata to inculde
     */
    putDataPublic   : function (bucket, key, data, metadata) {
        var m = new makeMetaData(metadata);
        if (data instanceof String) {
            m.setContentLength(data.length);
        }
        else {
            m.setContentLength(data.length());
        }

        var putObj = new PutObjectRequest(bucket, key, new java.io.ByteArrayInputStream(data), m);
        putObj.withCannedAcl(CannedAccessControlList.PublicRead);
        this.client.putObject(new PutObjectRequest(bucket, key, new java.io.ByteArrayInputStream(data), m));
    },
    /**
     * Upload a string or byte array to a S3 bucket and make it private
     *
     * @param {String} bucket name of bucket
     * @param {String} key in bucket to upload to
     * @param {String|Byte Array} data string or byte array to upload
     * @param [Object] optional metadata to inculde
     */
    putDataPrivate  : function (bucket, key, data, metadata) {
        var m = new makeMetaData(metadata);

        if (data instanceof String) {
            m.setContentLength(data.length);
        }
        else {
            m.setContentLength(data.length());
        }

        var putObj = new PutObjectRequest(bucket, key, new java.io.ByteArrayInputStream(data), m);
        putObj.withCannedAcl(CannedAccessControlList.Private);
        this.client.putObject(new PutObjectRequest(bucket, key, new java.io.ByteArrayInputStream(data), m));
    },
    /**
     * Get the url of an item in an S3 bucket
     *
     * @param bucket
     * @param key
     */
    getUrl          : function (bucket, key) {
        return 'http://' + bucket + '.s3.amazonaws.com/' + key;
    },
    /**
     * Remove an object from a bucket.
     *
     * @param bucket
     * @param key
     * @returns {*}
     */
    remove          : function (bucket, key) {
        return this.client.deleteObject(bucket, key);
    }
});

module.exports = S3Client;

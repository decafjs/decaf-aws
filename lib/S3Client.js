/*!
 * Created by mschwartz on 4/27/15.
 */

var File                     = java.io.File,
    AWSRegions               = com.amazonaws.regions.Regions,
    CannedAccessControlList  = com.amazonaws.services.s3.model.CannedAccessControlList,
    ObjectMetaData           = com.amazonaws.services.s3.model.ObjectMetadata,
    ListObjectsRequest       = com.amazonaws.services.s3.model.ListObjectsRequest,
    PutObjectRequest         = com.amazonaws.services.s3.model.PutObjectRequest,
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

function Bucket(client, name) {
    this.client = client.client;
    this.name = name.toLowerCase().replace(/\-/g, '');
    client.createBucket(this.name);
}
decaf.extend(Bucket.prototype, {
    putFile   : function (key, filename, publicFlag) {
        var putObj = new PutObjectRequest(this.name, key, new File(filename));
        putObj.withCannedAcl(publicFlag === false ? CannedAccessControlList.Private : CannedAccessControlList.PublicRead);
        this.client.putObject(putObj);
    },
    putData   : function (key, data, publicFlag, metadata) {
        var m = new makeMetaData(metadata);
        if (data instanceof String) {
            m.setContentLength(data.length);
        }
        else {
            m.setContentLength(data.length());
        }

        var putObj = new PutObjectRequest(this.name, key, new java.io.ByteArrayInputStream(data), m);
        putObj.withCannedAcl(publicFlag === false ? CannedAccessControlList.Private : CannedAccessControlList.PublicRead);
        this.client.putObject(pubObj);
    },
    remove    : function (key) {
        return this.client.deleteObject(this.name, key);
    },
    url       : function (key) {
        return 'http://' + this.name + '.s3.amazonaws.com/' + key;
    },
    /**
     * Get a list of items in the bucket.
     *
     * @param {String} prefix An optional parameter restricting the response to keys beginning with the specified prefix. Use prefixes to separate a bucket into different sets of keys, similar to how a file system organizes files into directories.
     * @returns {Array} list list of items
     * @returns {String} list.name name/key of item
     * @returns {Number} list.size size of item in bytes
     * @returns {Date} list.modified date item was last modified
     */
    listItems : function (prefix) {
        var request = new ListObjectsRequest().withBucketName(this.name),
            objectListing,
            list       = [],
            item;

        if (prefix) {
            request.withPrefix(prefix);
        }
        do {
            objectListing = this.client.listObjects(request);
            for (item in Iterator(objectListing.getObjectSummaries())) {
                list.push({
                    name     : String(item.getKey()),
                    size     : item.getSize(),
                    modified : new Date(item.getLastModified().getTime())
                });
            }
            request.setMarker(objectListing.getNextMarker());
        } while (objectListing.isTruncated());
        return list;
    }
});

function S3Client(credentials, region) {
    var client = this.client = new com.amazonaws.services.s3.AmazonS3Client(credentials);
    this.region = region;
    client.setRegion(AWSRegions.fromName(region));
}
decaf.extend(S3Client.prototype, {
    set region(name) {
        this._region = name;
        this.client.setRegion(AWSRegions.fromName(name));
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
    listBuckets     : function () {
        var bucket,
            buckets    = [],
            rawBuckets = this.client.listBuckets();

        for (bucket in Iterator(rawBuckets)) {
            buckets.push({
                creationDate : new Date(bucket.getCreationDate().getTime()),
                name         : String(bucket.getName())
            });
        }
        return buckets;
    },
    doesBucketExist : function (name) {
        return !!this.client.doesBucketExist(name);
    },
    use             : function (bucket) {
        var me = this;
        decaf.each(arguments, function (name) {
            me[name] = new Bucket(me, name);
        });
    },
    createBucket    : function (name) {
        if (!this.doesBucketExist(name)) {
            this.client.createBucket(new CreateBucketRequest(name));
        }
    }
});

module.exports = S3Client;

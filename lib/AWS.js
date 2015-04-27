/*!
 * Created by mschwartz on 4/27/15.
 */

var System = java.lang.System,
    S3Client = require('S3Client'),
    process = require('process'),
    AWSBasicAWSCredentials = com.amazonaws.auth.BasicAWSCredentials,
    AWSRegion = com.amazonaws.regions.Region,
    AWSRegions = com.amazonaws.regions.Regions;

function AWS(access_key_id, secret_access_key) {
    access_key_id = access_key_id || process.env['AWS_ACCESS_KEY_ID'];
    secret_access_key = secret_access_key || process.env['AWS_SECRET_ACCESS_KEY'];
    System.setProperty('aws.aws.accessKeyId', access_key_id);
    System.setProperty('aws.secretKey', secret_access_key);
    this.credentials = new AWSBasicAWSCredentials(access_key_id, secret_access_key);
    this.regions = [];
    this._region = String(AWSRegions.DEFAULT_REGION.getName());
    for (var i in AWSRegions) {
        if (typeof AWSRegions[i] === 'object' && AWSRegions[i]) {
            this.regions.push(String(AWSRegions[i].getName()));
        }
    }
}
decaf.extend(AWS.prototype, {
    get region() {
        return this._region;
    },
    set region(name) {
        this._region =  AWSRegion.getRegion(name);
    },
    getS3Client: function() {
        return new S3Client(this.credentials, this.region);
    }
});

decaf.extend(exports, {
    AWS: AWS
});
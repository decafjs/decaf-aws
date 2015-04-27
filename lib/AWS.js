/*!
 * Created by mschwartz on 4/27/15.
 */

var System = java.lang.System,
    AWSBasicAWSCredentials = com.amazonaws.auth.BasicAWSCredentials,
    AWSRegion = com.amazonaws.regions.Region,
    AWSRegions = com.amazonaws.regions.Regions;

function AWS(access_key_id, secret_access_key) {
    System.setProperty('aws.aws.accessKeyId', access_key_id);
    System.setProperty('aws.secretKey', secret_access_key);
    this.credentials = new AWSBasicAWSCredentials(access_key_id, secret_access_key);
    this.region = Regions.DEFAULT_REGION;
    console.dir(Regions);
}
decaf.extend(AWS.prototype, {

});
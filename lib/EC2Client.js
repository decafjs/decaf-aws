/*!
 * Created by mschwartz on 4/29/15.
 */


// note: this module currently does not support vpc

var AWSRegions = com.amazonaws.regions.Regions;

function EC2Client(credentials, region) {
    var client = this.client = new com.amazonaws.services.ec2.AmazonEC2Client(credentials);
    this.region = region;
    client.setRegion(AWSRegions.fromName(region));
}
EC2Client.instanceTypes = [
    't1.micro',
    'm1.small',
    'm1.medium',
    'm1.large',
    'm1.xlarge',
    'm3.medium',
    'm3.large',
    'm3.xlarge',
    'm3.2xlarge',
    't2.micro',
    't2.small',
    't2.medium',
    'm2.xlarge',
    'm2.2xlarge',
    'm2.4xlarge',
    'cr1.8xlarge',
    'i2.xlarge',
    'i2.2xlarge',
    'i2.4xlarge',
    'i2.8xlarge',
    'hi1.4xlarge',
    'hs1.8xlarge',
    'c1.medium',
    'c1.xlarge',
    'c3.large',
    'c3.xlarge',
    'c3.2xlarge',
    'c3.4xlarge',
    'c3.8xlarge',
    'c4.large',
    'c4.xlarge',
    'c4.2xlarge',
    'c4.4xlarge',
    'c4.8xlarge',
    'cc1.4xlarge',
    'cc2.8xlarge',
    'g2.2xlarge',
    'cg1.4xlarge',
    'r3.large',
    'r3.xlarge',
    'r3.2xlarge',
    'r3.4xlarge',
    'r3.8xlarge',
    'd2.xlarge',
    'd2.2xlarge',
    'd2.4xlarge',
    'd2.8xlarge'
];
decaf.extend(EC2Client.prototype, {
    set region(name) {
        this._region = name;
        this.client.setRegion(AWSRegions.fromName(name));
    },
    get region() {
        return this._region;
    },
    describeInstances  : function () {
        var result    = this.client.describeInstances(),
            instances = [];

        for (var instance in Iterator(result.getReservations())) {
            instances.push(instance);
        }
        return instances;
    },
    runInstances       : function (config) {
        var amiId             = config.amiId,
            instanceType      = config.instanceType,
            minCount          = config.minCount || 1,
            maxCount          = config.maxCount || 1,
            keyPairName       = config.keyPairName,
            securityGroupName = config.securityGroupName || 'default';

        if (!amiId) {
            throw new Error('config member amiId required');
        }
        if (!instanceType) {
            throw new Error('config member instanceType required');
        }
        if (!keyPairName) {
            throw new Error('config member keyPairName required');
        }
        var request = new com.amazonaws.services.ec2.model.RunInstancesRequest();
        request
            .withImageId(amiId)
            .withInstanceType(instanceType)
            .withMinCount(minCount)
            .withMaxCount(maxCount)
            .withKeyName(keyPairName)
            .withSecurityGroups(securityGroupName);

        var result = this.client.runInstances(request);
        return result;
    },
    /**
     * Allocate a static IP
     *
     * @returns {string} ipAddress the public IP of the allocated elastic IP
     */
    allocateElasticIP  : function () {
        return String(this.client.allocateAddress().publicIp());
    },
    /**
     * Attach a static IP to an instance or network interface
     *
     * @param instanceId
     * @param publicIP
     * @returns {*}
     */
    associateElasticIP : function (instanceId, publicIP) {
        return this.client.associateAddress(new com.amazonaws.services.ec2.model.AssociateAddressRequest(instanceId, publicIp));
    }
});

module.exports = EC2Client;

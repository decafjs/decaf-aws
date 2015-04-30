/*!
 * Created by mschwartz on 4/29/15.
 */


// note: this module currently does not support vpc

var AWSRegions               = com.amazonaws.regions.Regions;

function EC2Client(credentials, region) {
    var client = this.client = new com.amazonaws.services.ec2.AmazonEC2Client(credentials);
    this.region = region;
    client.setRegion(AWSRegions.fromName(region));
}
decaf.extend(EC2Client.prototype, {
    set region(name) {
        this._region = name;
        this.client.setRegion(AWSRegions.fromName(name));
    },
    get region() {
        return this._region;
    },
    describeInstances: function() {
        var result = this.client.describeInstances(),
            instances = [];

        for (var instance in Iterator(result)) {
            instances.push(instance);
        }
        return instances;
    },
    /**
     * Allocate a static IP
     *
     * @returns {string} ipAddress the public IP of the allocated elastic IP
     */
    allocateElasticIP: function() {
        return String(this.client.allocateAddress().publicIp());
    },
    /**
     * Attach a static IP to an instance or network interface
     *
     * @param instanceId
     * @param publicIP
     * @returns {*}
     */
    associateElasticIP: function(instanceId, publicIP) {
        return this.client.associateAddress(new com.amazonaws.services.ec2.model.AssociateAddressRequest(instanceId, publicIp));
    }
});

module.exports = EC2Client;

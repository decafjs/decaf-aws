/*!
 * Created by mschwartz on 4/29/15.
 */


// note: this module currently does not support vpc

var AWSRegions = com.amazonaws.regions.Regions,
    sleep      = builtin.process.sleep;

function instanceInfo(instance) {
    var securityGroups = [];
    for (var group in Iterator(instance.getSecurityGroups())) {
        securityGroups.push(String(group.getGroupName()));
    }
    var tags = [];
    for (var tag in Iterator(instance.getTags())) {
        tags.push({
            key   : String(tag.getKey()),
            value : String(tag.getValue())
        });
    }

    return {
        architecture          : String(instance.getArchitecture()),
        clientToken           : String(instance.getClientToken()),
        ebsOptimized          : !!instance.getEbsOptimized(),
        hypervisor            : String(instance.getHypervisor()),
        amiId                 : String(instance.getImageId()),
        instanceId            : String(instance.getInstanceId()),
        instanceType          : String(instance.getInstanceType()),
        keyName               : String(instance.getKeyName()),
        launchTime            : new Date(instance.getLaunchTime().getTime()),
        platform              : String(instance.getPlatform()),
        privateDnsName        : String(instance.getPrivateDnsName()),
        privateIpAddress      : String(instance.getPrivateIpAddress()),
        publicDnsName         : String(instance.getPublicDnsName()),
        publicIpAddress       : String(instance.getPublicIpAddress()),
        ramdiskId             : String(instance.getRamdiskId()),
        rootDeviceName        : String(instance.getRootDeviceName()),
        rootDeviceType        : String(instance.getRootDeviceType()),
        securityGroups        : securityGroups,
        state                 : String(instance.getState().getName()),
        stateReason           : String(instance.getStateReason() ? instance.getStateReason().getMessage() : null),
        stateTransitionReason : String(instance.getStateTransitionReason()),
        tags                  : tags
    };
}

function permissionsInfo(permission) {
    var ranges = [];
    for (var range in Iterator(permission.getIpRanges())) {
        ranges.push(String(range));
    }
    var protocol = permission.getIpProtocol();
    if (''+protocol === '-1') {
        protocol = 'all';
    }
    else {
        protocol = String(protocol);
    }
    return {
        protocol : protocol,
        fromPort : permission.getFromPort(),
        toPort   : permission.getToPort(),
        ipRange  : ranges
    };
}

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
    // security groups
    describeSecurityGroups : function () {
        var result         = this.client.describeSecurityGroups(),
            securityGroups = [],
            permission;

        for (var group in Iterator(result.getSecurityGroups())) {
            var tags = [];
            for (var tag in Iterator(group.getTags())) {
                tags.push({
                    key   : String(tag.getKey()),
                    value : String(tag.getValue())
                });
            }
            var inbound = [];
            for (permission in Iterator(group.getIpPermissions())) {
                inbound.push(permissionsInfo(permission));
            }
            var outbound = [];
            for (permission in Iterator(group.getIpPermissionsEgress())) {
                outbound.push(permissionsInfo(permission));
            }
            securityGroups.push({
                id          : String(group.getGroupId()),
                description : String(group.getDescription()),
                name        : String(group.getGroupName()),
                tags        : tags,
                inbound     : inbound,
                outbound    : outbound
            })
        }
        return securityGroups;
    },
    // Instances
    describeInstances      : function () {
        var result    = this.client.describeInstances(),
            instances = [];

        for (var reservation in Iterator(result.getReservations())) {
            for (var instance in Iterator(reservation.getInstances())) {
                instances.push(instanceInfo(instance));
            }
        }
        return instances;
    },
    getInstanceById        : function (instanceId) {
        var result    = this.client.describeInstances(new com.amazonaws.services.ec2.model.DescribeInstancesRequest().withInstanceIds(instanceId)),
            instances = [];

        for (var reservation in Iterator(result.getReservations())) {
            for (var instance in Iterator(reservation.getInstances())) {
                instances.push(instanceInfo(instance));
            }
        }
        return instances[0];
    },
    runInstances           : function (config) {
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

        var result    = this.client.runInstances(request),
            instances = [];
        for (var instance in Iterator(result.getReservation().getInstances())) {
            instances.push(instanceInfo(instance));
        }
        return instances;
    },
    terminateInstance      : function (instanceId) {
        var request = new com.amazonaws.services.ec2.model.TerminateInstancesRequest().withInstanceIds(instanceId);
        this.client.terminateInstances(request);
    },
    waitForInstance        : function (instanceId, state, timeout) {
        var me      = this,
            waitFor = state + 'xxx';

        if (!instanceId) {
            throw new Error('waitForInstance instanceId required');
        }
        if (!state) {
            throw new Error('waitForInstance state required');
        }

        timeout = timeout || 30;
        while (timeout > 0) {
            waitFor = me.getInstanceById((instanceId)).state;
            if (state === waitFor) {
                return;
            }
        }
        throw new Error('waitForInstance timed out');
    },
    // elastic IPs
    /**
     * Allocate a static IP
     *
     * @returns {string} ipAddress the public IP of the allocated elastic IP
     */
    allocateElasticIp      : function () {
        return String(this.client.allocateAddress().publicIp());
    },
    /**
     * Attach a static IP to an instance or network interface
     *
     * @param instanceId
     * @param publicIp
     * @returns {*}
     */
    associateElasticIp     : function (instanceId, publicIp) {
        return this.client.associateAddress(new com.amazonaws.services.ec2.model.AssociateAddressRequest(instanceId, publicIp));
    }
});

module.exports = EC2Client;

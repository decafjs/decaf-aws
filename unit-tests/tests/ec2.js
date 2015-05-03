/**
 * Created by mschwartz on 4/30/15.
 */

var ec2 = aws.getEC2Client();

suite('ec2', function () {
    var groupId,
        instanceId;

    test('describe-security-groups', function () {
        console.dir(ec2.describeSecurityGroups());
    });

    test('describe-instances', function () {
        console.dir(ec2.describeInstances());
    });

    test('create-security-group', function () {
        groupId = ec2.createSecurityGroup('testgroup', {
            description : 'unit test group',
            inbound     : [
                {
                    protocol : 'tcp',
                    fromPort : 22,
                    toPort   : 22,
                    ipRange  : [
                        '0.0.0.0/0'
                    ]
                }
            ],
            outbound    : [
                {}
            ]
        });
        console.log('security groups');
        console.dir(ec2.describeSecurityGroups());
    });

    test('run-instances', function () {
        var instances = ec2.runInstances({
            amiId             : 'ami-d05e75b8',
            instanceType      : 't2.micro',
            keyPairName       : 'test-keypair',
            securityGroupName : 'testgroup'
        });
        instanceId = instances[0].instanceId;
        console.dir(instances);
        console.log('waiting for instance ' + instanceId + ' to be running');
        ec2.waitForInstance(instanceId, 'running');
        console.log('Instance ' + instanceId + ' is now running');

    });

    test('delete-security-group', function () {
        console.log('deleting security group ' + groupId);
        ec2.removeSecurityGroup(groupId);
        console.log('security groups');
        console.dir(ec2.describeSecurityGroups());
    });

    test('terminate-instance', function () {
        console.log('terminating instance ' + instanceId);
        ec2.terminateInstance(instanceId);
        console.log('waiting for instance ' + instanceId + ' to be terminated');
        ec2.waitForInstance(instanceId, 'terminated');
        console.log('Instance ' + instanceId + ' is now terminated');
    });
});

/**
 * Created by mschwartz on 4/30/15.
 */

var ec2 = aws.getEC2Client();

suite('ec2', function () {
    test('describe-security-groups', function() {
        console.dir(ec2.describeSecurityGroups());
    });

    //test('describe-instances', function () {
    //    console.dir(ec2.describeInstances());
    //});
    //
    //test('run-instances', function () {
    //    var instances  = ec2.runInstances({
    //            amiId        : 'ami-1ecae776',
    //            instanceType : 't2.small',
    //            keyPairName  : 'test-keypair'
    //        }),
    //        instanceId = instances[0].instanceId;
    //    console.dir(instances);
    //    console.log('waiting for instance ' + instanceId + ' to be running');
    //    ec2.waitForInstance(instanceId, 'running');
    //    console.log('Instance ' + instanceId + ' is now running');
    //
    //    console.log('terminating instance ' + instanceId);
    //    ec2.terminateInstance(instanceId);
    //    console.log('waiting for instance ' + instanceId + ' to be terminated');
    //    ec2.waitForInstance(instanceId, 'terminated');
    //    console.log('Instance ' + instanceId + ' is now terminated');
    //});
});

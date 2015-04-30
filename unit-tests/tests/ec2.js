/**
 * Created by mschwartz on 4/30/15.
 */

var ec2 = aws.getEC2Client();

suite('ec2', function () {
    test('describe instances', function () {
        console.dir(ec2.describeInstances());
    });
    test('run instances', function () {
        console.dir(ec2.runInstances({
            amiId        : 'ami-1ecae776',
            instanceType : 't2.small',
            keyPairName: 'test-keypair'
        }));
    })
});

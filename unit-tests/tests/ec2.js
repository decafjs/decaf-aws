/**
 * Created by mschwartz on 4/30/15.
 */

var ec2 = aws.getEC2Client();

suite('ec2', function() {
    console.log('ec2')
    test('describe instances', function() {
        console.dir(ec2.describeInstances());
    })
});

# decaf-aws

DecafJS module interface to Amazon's AWS API.

This module provides interfaces to several AWS services.

Sample use:

```javascript
var AWS = require('decaf-aws').AWS,
    aws = new AWS(access_key_id, secret_access_key);
```

If you do not provide access_key_id and secret_access_key, then you must set the environment variables, and the AWS constructor will use those:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY


## S3

```javascript
var s3 = aws.getS3Client();
s3.use('bucket', 'bucket2', ...);

s3.bucket.putFile('somekey', filename);
s3.bucket2.putData('somekey', JSON.stringify({ a: 1, b: 2 }));
```


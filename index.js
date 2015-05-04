/*@ d
 * AWS Support for Decaf
 * @author Alex Lazar
 */

/*global decaf, require */

"use strict";

decaf.extend(exports, {
    AWS      : require('lib/AWS').AWS,
    S3Client : require('lib/S3Client')
});
/*@ d
 * AWS Support for Decaf
 * @author Alex Lazar
 */

/*global decaf, require */

"use strict";

decaf.extend(exports, {
    AWS      : require('lib/AWS').AWS,
    AmazonS3 : require('lib/AmazonS3').AmazonS3
});
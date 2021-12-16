const { awsConfig } = require("./awsConfig");

const aws = awsConfig();
const s3 = new aws.S3();

// return type def
/**
 * return object
 * @typedef {Object} SignedUrlFetchOptions
 * @property {number} url        Url for resource access
 * @property {number} method           HTTP method to use when fetching uploadUrl
 */

// function def
/**
 *  this will return an "access point" where the frontend can upload images via the PUT method
 *  eg: sending to the image recognition microservice
 * -------------------------------------------------------------------------------------------
 *  @param {object} options            Options object
 *  @param {string} options.bucket     S3 bucket name
 *  @param {string} options.key        File name when uploaded to s3 bucket
 *  @param {number} [options.time]     Limit to upload
 *  @returns {SignedUrlFetchOptions}   An object with the signed upload url and the method
 */
const generateSignedPutUrl = ({ bucket, key, expires = 300 }) => {
  const url = s3.getSignedUrl("putObject", {
    Key: key,
    Bucket: bucket,
    Expires: expires, // 5 min
  });

  return { url, method: "PUT" };
};

/**
 *  this will return an "access point" where the frontend can download images via the GET method
 *  eg: viewing an uploaded image after diagnosis
 * -------------------------------------------------------------------------------------------
 *  @param {object} options            Options object
 *  @param {string} options.bucket     S3 bucket name
 *  @param {string} options.key        File name when uploaded to s3 bucket
 *  @param {number} [options.time]     Limit to upload
 *  @returns {SignedUrlFetchOptions}   An object with the signed upload url and the method
 */
 const generateSignedGetUrl = ({ bucket, key, expires = 300 }) => {
  const url = s3.getSignedUrl("getObject", {
    Key: key,
    Bucket: bucket,
    Expires: expires, // 5 min
  });

  return { url, method: "GET" };
};

module.exports = { generateSignedPutUrl, generateSignedGetUrl };

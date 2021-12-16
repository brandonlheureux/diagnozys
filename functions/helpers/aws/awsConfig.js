require("dotenv").config();
const aws = require("aws-sdk");

// This will return a ready to use & configured aws instance.
// It might be a better idea use different configs for different endpoints,
// But this will do.
const awsConfig = () => {
  aws.config = new aws.Config({
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
    signatureVersion: "v4",
  });
  return aws;
};

module.exports = { awsConfig };

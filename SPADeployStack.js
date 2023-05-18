const { Stack, Duration } = require('@aws-cdk/core');
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");


class SPADeployStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "OAI");
        const bucket = new s3.Bucket(this, "StaticBucket", {
            bucketName: 'bio-shop-with-cdk',
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });
        bucket.addToResourcePolicy(new iam.PolicyStatement({
            action: ["S3:GetObject"],
            resources: [bucket.arnForObjects("*")],
            principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "Distribution", {
            originConfigs: [{
                    s3OriginSource: {
                        s3BucketSource: bucket,
                        originAccessIdentity: cloudfrontOAI
                    },
                    behaviors: [{
                            isDefaultBehavior: true
                        }]
                }]
        });
        new s3deploy.BucketDeployment(this, "Bucket-Deployment", {
            sources: [s3deploy.Source.asset("./dist")],
            destinationBucket: bucket,
            distribution,
            distributionPaths: ["/*"]
        });
    }

  }


module.exports = { SPADeployStack }

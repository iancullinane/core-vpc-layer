import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class CoreVpcStack extends Stack {

  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Configure the `natGatewayProvider` when defining a Vpc
    const natGatewayProvider = ec2.NatProvider.instance({
      instanceType: new ec2.InstanceType('t2.micro'),
    });


    // The code that defines your stack goes here
    const baseVpc = new ec2.Vpc(this, 'base-vpc', {
      cidr: "192.168.0.0/16",
      maxAzs: 1,
      natGatewayProvider: natGatewayProvider,
    })
    const vpcSG = new ec2.SecurityGroup(this, 'SG', { vpc: baseVpc });



    new cdk.CfnOutput(this, "VPC ID", { value: baseVpc.vpcId});
    new cdk.CfnOutput(this, "SG ID", { value: vpcSG.securityGroupId});
    // example resource
    // const queue = new sqs.Queue(this, 'CoreVpcQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}


// import * as ec2 from '@aws-cdk/aws-ec2';
// import * as cdk from '@aws-cdk/core';

// export class CdkStarterStack extends cdk.Stack {
//   constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
//       cidr: '10.0.0.0/16',
//       natGateways: 1,
//       maxAzs: 3,
//       subnetConfiguration: [
//         {
//           name: 'private-subnet-1',
//           subnetType: ec2.SubnetType.PRIVATE,
//           cidrMask: 24,
//         },
//         {
//           name: 'public-subnet-1',
//           subnetType: ec2.SubnetType.PUBLIC,
//           cidrMask: 24,
//         },
//         {
//           name: 'isolated-subnet-1',
//           subnetType: ec2.SubnetType.ISOLATED,
//           cidrMask: 28,
//         },
//       ],
//     });
//   }
// }

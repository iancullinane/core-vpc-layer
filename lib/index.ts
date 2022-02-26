import {CfnOutput} from "aws-cdk-lib";
import { Construct } from 'constructs';
import {NatProvider, InstanceType, Vpc, IVpc, SecurityGroup} from 'aws-cdk-lib/aws-ec2';

export interface CoreVpcProps {
  cidrRange?: string;
  azs?: number;
}

export class CoreVpcStack extends Construct {

  public readonly CoreVpc: IVpc;

  constructor(scope: Construct, id: string, props: CoreVpcProps = {cidrRange: "192.168.0.0/16", azs: 1}) {
    super(scope, id);

    // Configure the `natGatewayProvider` when defining a Vpc
    const natGatewayProvider = NatProvider.instance({
      instanceType: new InstanceType('t2.micro'),
    });


    // The code that defines your stack goes here
    const baseVpc = new Vpc(this, 'base-vpc', {
      cidr: props.cidrRange,
      maxAzs: props.azs,
      natGatewayProvider: natGatewayProvider,
    })
    const vpcSG = new SecurityGroup(this, 'SG', { vpc: baseVpc });



    new CfnOutput(this, "VPC ID", { value: baseVpc.vpcId});
    new CfnOutput(this, "SG ID", { value: vpcSG.securityGroupId});
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

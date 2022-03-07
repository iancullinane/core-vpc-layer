import { CfnOutput, ITaggable, TagManager } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { NatProvider, InstanceType, Vpc, IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

export interface CoreVpcProps {
  cidrRange?: string;
  azs?: number;
  natInstanceType?: string;
}

export class CoreVpcStack extends Construct implements ITaggable {

  public readonly vpc: Vpc;
  public readonly tags: TagManager;

  constructor(scope: Construct, id: string, props: CoreVpcProps = { cidrRange: "192.168.0.0/16", azs: 1 }) {
    super(scope, id);

    if (props.natInstanceType === undefined) {
      props.natInstanceType = "t2.micro";
    }

    // Configure the `natGatewayProvider` when defining a Vpc
    const natGatewayProvider = NatProvider.instance({
      instanceType: new InstanceType(props.natInstanceType),
    });

    // The code that defines your stack goes here
    const vpc = new Vpc(this, 'base-vpc', {
      cidr: props.cidrRange,
      maxAzs: props.azs,
      natGatewayProvider: natGatewayProvider,
    })

    const vpcSG = new SecurityGroup(this, 'SG', { vpc: vpc });
    this.vpc = vpc;

    new CfnOutput(this, "SG ID", { value: vpcSG.securityGroupId });
    new CfnOutput(this, 'sheetaVPC', {
      value: vpc.vpcId,
      description: 'The core vpc ID',
      exportName: 'core-vpc-id',
    });
  }
}

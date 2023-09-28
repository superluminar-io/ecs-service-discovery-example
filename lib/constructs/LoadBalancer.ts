import {aws_ec2 as ec2, aws_elasticloadbalancingv2 as loadbalancing} from 'aws-cdk-lib';
import {Construct} from 'constructs';

interface LoadBalancerProps {
    vpc: ec2.Vpc,
}

export class LoadBalancer extends Construct {

    public securityGroup: ec2.SecurityGroup;

    public loadBalancer: loadbalancing.ApplicationLoadBalancer;

    constructor(scope: Construct, id: string, props: LoadBalancerProps) {
        super(scope, id);

        this.securityGroup = new ec2.SecurityGroup(this, 'security-group', {
            vpc: props.vpc,
        });

        this.loadBalancer = new loadbalancing.ApplicationLoadBalancer(this, 'load-balancer', {
            internetFacing: true,
            vpc: props.vpc,
            vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
            securityGroup: this.securityGroup,
        });
    }
}

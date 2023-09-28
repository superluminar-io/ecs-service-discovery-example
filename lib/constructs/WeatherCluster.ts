import {
    aws_ec2 as ec2,
    aws_ecs as ecs,
} from 'aws-cdk-lib';
import {Construct} from 'constructs';

interface WeatherClusterProps {
    vpc: ec2.Vpc,
    namespace: string
}

export class WeatherCluster extends Construct {

    public cluster: ecs.Cluster;

    public securityGroup: ec2.SecurityGroup;

    public namespace: string;

    constructor(scope: Construct, id: string, props: WeatherClusterProps) {
        super(scope, id);

        this.securityGroup = new ec2.SecurityGroup(this, 'security-group', {
            vpc: props.vpc,
        });

        this.securityGroup.connections.allowInternally(
            ec2.Port.tcp(80),
            'allows service to service communication',
        );

        this.cluster = new ecs.Cluster(this, 'cluster', {
            vpc: props.vpc,
            defaultCloudMapNamespace: {
                name: props.namespace,
            }
        });

        this.namespace = props.namespace;
    }
}

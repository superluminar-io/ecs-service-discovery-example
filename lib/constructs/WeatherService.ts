import {
    aws_ec2 as ec2,
    aws_ecr_assets as ecr_assets,
    aws_ecs as ecs,
    aws_logs as logs, aws_servicediscovery as servicediscovery,
} from 'aws-cdk-lib';
import {Construct} from 'constructs';

interface WeatherAggregatorServiceProps {
    cluster: ecs.Cluster,
    securityGroup: ec2.SecurityGroup,
    namespace: string;
    serviceName: string;
    environment?: Record<string, string>;
}

export class WeatherService extends Construct {

    public serviceName: string;

    public service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: WeatherAggregatorServiceProps) {
        super(scope, id);

        const imageAsset = new ecr_assets.DockerImageAsset(this, 'image-asset', {
            directory: `src/${props.serviceName}`,
        });

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'fargate-task-definition', {
            cpu: 256,
            memoryLimitMiB: 512,
        });

        const container = taskDefinition.addContainer(`${props.serviceName}-container`, {
            image: ecs.ContainerImage.fromDockerImageAsset(imageAsset),
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: props.serviceName,
                logRetention: logs.RetentionDays.ONE_DAY,
            }),
            portMappings: [{
                containerPort: 80,
                hostPort: 80,
            }],
            essential: true,
            environment: props.environment ?? {}
        });

        this.serviceName = props.serviceName;
        this.service = new ecs.FargateService(this, 'service', {
            cluster: props.cluster,
            securityGroups: [props.securityGroup],
            vpcSubnets: {subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS},
            assignPublicIp: false,
            taskDefinition: taskDefinition,
            cloudMapOptions: {
                container,
                dnsRecordType: servicediscovery.DnsRecordType.A,
                containerPort: 80,
                name: props.serviceName,
            },
        });
    }
}

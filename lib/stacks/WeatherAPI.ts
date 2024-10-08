import {CfnOutput, Stack} from 'aws-cdk-lib';

import {Construct} from 'constructs';
import {Network} from '../constructs/Network';
import {LoadBalancer} from '../constructs/LoadBalancer';
import {WeatherCluster} from '../constructs/WeatherCluster';
import {WeatherService} from '../constructs/WeatherService';


export class WeatherAPI extends Stack {

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const network = new Network(this, 'network');

        const loadBalancer = new LoadBalancer(this, 'load-balancer', {
            vpc: network.vpc,
        });

        const weatherCluster = new WeatherCluster(this, 'weather-cluster', {
            vpc: network.vpc,
            namespace: 'weather-api'
        });

        const defaultServiceProperties = {
            cluster: weatherCluster.cluster,
            securityGroup: weatherCluster.securityGroup,
            namespace: weatherCluster.namespace,
        };

        const temperatureProvider = new WeatherService(this, 'temperature-provider-service', {
            ...defaultServiceProperties,
            serviceName: 'temperature-provider',
        });

        const humidityProvider = new WeatherService(this, 'humidity-provider-service', {
            ...defaultServiceProperties,
            serviceName: 'humidity-provider',
        });

        const weatherAggregator = new WeatherService(this, 'weather-aggregator-service', {
            ...defaultServiceProperties,
            serviceName: 'weather-aggregator',
            environment: {
                HUMIDITY_PROVIDER_URL: `http://${humidityProvider.serviceName}.${weatherCluster.namespace}:80`,
                TEMPERATURE_PROVIDER_URL: `http://${temperatureProvider.serviceName}.${weatherCluster.namespace}:80`,
            },
        });

        const httpListener = loadBalancer.loadBalancer.addListener('http-listener', {
            open: true,
            port: 80,
        });

        const httpTargetGroup = httpListener.addTargets('http-target-group', {
            port: 80,
        });

        httpTargetGroup.addTarget(weatherAggregator.service);

        new CfnOutput(this, 'vienna-weather-url', {
            value: `http://${loadBalancer.loadBalancer.loadBalancerDnsName}/weather/vienna`,
        });
    }
}

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {WeatherAPI} from '../lib/stacks/WeatherAPI';

const app = new cdk.App();

new WeatherAPI(app, 'weather-api');

app.synth();

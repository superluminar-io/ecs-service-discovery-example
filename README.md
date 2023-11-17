
## ECS-Service-Discovery-Example

### What is this repository about?
In this repository, we showcase how you can build a service discovery for ECS with CloudMap.

#### What is a service discovery?

Service discovery is the dynamic identification and locating of services in a distributed computing environment.  
In such systems, different services or components run on separate machines or containers, requiring a method for  
mutual discovery and communication. Service discovery tackles this challenge by enabling services to register and  
find each other through a designated mechanism, facilitating efficient interaction in distributed systems.

**TL;DR;** It lets services speak to each other.

#### Diagram

![diagram.svg](diagram.svg)

### How to deploy it?

1. Install dependencies `npm install`
2. Deploy `npx cdk deploy` or `npx cdk deploy --profile <your-profile-name>`

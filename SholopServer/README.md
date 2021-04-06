# Deployment

1. npm run build
2. mvn clean install -Passemble
3. scp -i ../sholop.pem target/sholop-server-0.3.0-distribution/sholop-server-0.3.0.jar   ubuntu@ec2-34-216-117-219.us-west-2.compute.amazonaws.com:/tmp
4. ssh -i "sholop.pem" ubuntu@ec2-34-216-117-219.us-west-2.compute.amazonaws.com

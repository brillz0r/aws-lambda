import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Code, Handler } from "aws-cdk-lib/aws-lambda";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLambda = new lambda.Function(this, "mylambda", {
      functionName: "lambda-webapi-docker-testing",
      runtime: lambda.Runtime.FROM_IMAGE, // lambda.Runtime.DOTNET_8
      code: Code.fromAssetImage(path.join(__dirname, "../../"), {
        file: "Dockerfile",
        exclude: ["cdk.out"],
      }),
      memorySize: 1024,
      handler: Handler.FROM_IMAGE, // "LambdaWebApiTesting::LambdaWebApiTesting.LambdaEntryPoint::FunctionHandlerAsync"
    });

    const api = new LambdaRestApi(this, "myapi", {
      handler: myLambda,
      proxy: true,
    });
    //  // API Gateway REST API
    //  var restApi = new LambdaRestApi(this, "restApi", new LambdaRestApiProps
    //  {
    //      Handler = dotnetCoreWebApiLambdaHandler,
    //      Proxy = true  // defines a greedy proxy ("{proxy+}")
    //  });

    //  // Output the API Gateway REST API Url
    //  new CfnOutput(this, "REST API Url", new CfnOutputProps
    //  {
    //      Value = restApi.Url,
    //      Description = "REST API endpoint URL"
    //  });
  }
}

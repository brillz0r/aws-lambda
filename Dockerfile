FROM public.ecr.aws/lambda/dotnet:8 as base
FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
WORKDIR /src
COPY ["LambdaWebApiTestingDocker.csproj", "LambdaWebApiTestingDocker/"]
RUN dotnet restore "LambdaWebApiTestingDocker/LambdaWebApiTestingDocker.csproj"

WORKDIR "/src/LambdaWebApiTestingDocker"
COPY . .
RUN dotnet build "LambdaWebApiTestingDocker.csproj" --configuration Release --output /app/build

FROM build AS publish
RUN dotnet publish "LambdaWebApiTestingDocker.csproj" \
            --configuration Release \ 
            --runtime linux-x64 \
            --self-contained false \ 
            --output /app/publish \
            -p:PublishReadyToRun=true  

FROM base AS final
WORKDIR /var/task
COPY --from=publish /app/publish .
CMD ["LambdaWebApiTestingDocker::LambdaWebApiTestingDocker.LambdaEntryPoint::FunctionHandlerAsync"]
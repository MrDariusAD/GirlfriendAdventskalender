#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
WORKDIR /src
COPY ["Presentation/GirlfriendAdventskalender.Presentation.WebApi/GirlfriendAdventskalender.Presentation.WebApi.csproj", "Presentation/GirlfriendAdventskalender.Presentation.WebApi/"]
COPY ["GirlfriendAdventskalender.Infrastructure.MongoDb/GirlfriendAdventskalender.Infrastructure.MongoDb.csproj", "GirlfriendAdventskalender.Infrastructure.MongoDb/"]
COPY ["GirlfriendAdventskalender.Domain/GirlfriendAdventskalender.Domain.csproj", "GirlfriendAdventskalender.Domain/"]
COPY ["Domain/GirlfriendAdventskalender.Domain.Contracts/GirlfriendAdventskalender.Domain.Contracts.csproj", "Domain/GirlfriendAdventskalender.Domain.Contracts/"]
RUN dotnet restore "Presentation/GirlfriendAdventskalender.Presentation.WebApi/GirlfriendAdventskalender.Presentation.WebApi.csproj"
COPY . .
WORKDIR "/src/Presentation/GirlfriendAdventskalender.Presentation.WebApi"
RUN dotnet build "GirlfriendAdventskalender.Presentation.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GirlfriendAdventskalender.Presentation.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GirlfriendAdventskalender.Presentation.WebApi.dll"]
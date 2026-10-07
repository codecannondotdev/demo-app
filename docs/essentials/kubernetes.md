---
outline: 'deep'
---

# Kubernetes Config

## Overview

The kubernetes config for generated applications is as straightforward as possible
and is designed to be as simple as possible to get started with.

It's composed of the `api` and `ui` services; and uses `nginx-ingress` and
`cert-manager`.

## DigitalOcean Deployment

We host our services on DigitalOcean and prepared a simple guide on how to host
Codecannon apps on the DigitalOcean Managed Kubernetes clusters.

### Prerequisites

- Build and push docker images to your docker repository
- Configure repository access on your kubernetes cluster
- Install nginx-ingress in the DigitalOcean Marketplace
- Install cert-manager in the DigitalOcean Marketplace
- Replace placeholder values in `k8s/**/*.yml` configs with actual values
- Create a `Namespace`. A simple `Namespace` config is available in `k8s/namespace.yml`

### Api Service

The api service contains your Laravel backend alongside a SQLite database.

It's based on the api Docker image (`api/Dockerfile`).

- You can find the api `Service` in `k8s/services/api_service.yml`. It's the simplest
service config exposing the api service on port `80`.
- You can find the api `Deployment` in `k8s/deployments/api_deployment.yml`.

:::info
The api deployment runs a few commands on startup:

- `yes n | cp -i /storage-initial/database/database.sqlite 2>/dev/null;` - Creates
an empty database if one doesn't exist
- `php artisan key:generate` - Generates APP_KEY
- `php artisan optimize` - Runs all Laravel cache commands
- `php artisan migrate --force` - Runs migrations
- `php artisan db:seed --force` - Runs seeders
:::

- The deployment environment variables are stored in a `ConfigMap` and `Secret`
file.
    - The `Configmap` can be found in `k8s/configmaps/api_configmap.yml`
    - The `Secret` file found in `k8s/secrets/api_secret.yml`

### UI Service

The ui service contains your Vue.js frontend.

It's based on the ui Docker image (`ui/Dockerfile`).

- You can find the ui `Service` in `k8s/services/ui_service.yml`. It's the simplest
service config exposing the ui service on port `80`.
- You can find the ui `Deployment` in `k8s/deployments/ui_deployment.yml`. It's a
simple deployment configuration with minimal presets.

### Ingress Controller

[DigitalOcean Marketplace - NGINX Ingress Controller](https://marketplace.digitalocean.com/apps/nginx-ingress-controller)

For the simplest deployment, the default DigitalOcean nginx-ingress installation
should be sufficient.

- You can find the `Ingress` config in `k8s/ingress/ingress.yml`. It's a simple
ingress config that hosts the `ui` service on the root of the domain and the
`api` service on the `/api` path.

### Cert manager

[DigitalOcean Marketplace - Cert-Manager](https://marketplace.digitalocean.com/apps/cert-manager)

For the simplest deployment, the default DigitalOcean cert-manager installation
should be sufficient.

- The `ClusterIssuer` config for the letsencrypt staging server can be found in
`k8s/cluster_issuer.yml`.
- The `Certificate` config can be found in `k8s/certificate.yml`.

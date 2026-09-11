# ADR-0016: Cloud-Agnostic Container Deployment Philosophy

## Status

`ACCEPTED`

## Context

Enterprise customers deploy their IT workloads across AWS, Azure, GCP, on-premise hybrid clouds, and air-gapped sovereign clouds. SentinelAI must maintain complete deployment flexibility to support multi-cloud SaaS, private VPC deployments, and isolated enterprise environments (`PVD Section 14`, `SRS-PORT-001`).

## Problem Statement

What cloud infrastructure and deployment packaging philosophy should SentinelAI adopt to prevent cloud vendor lock-in while ensuring identical operational behavior across heterogeneous deployment environments?

## Considered Options

1. **Option A: Proprietary Cloud Vendor Native Stack (e.g., AWS-Native)** - Utilizing AWS-specific proprietary services (Lambda, DynamoDB, Kinesis, Bedrock) natively.
2. **Option B: Cloud-Agnostic Open Container Standard Architecture** - Packaging all microservices into OCI-compliant container images deployed via Kubernetes declarative manifests and Infrastructure-as-Code (IaC) automation.
3. **Option C: Custom Bare-Metal OS Images** - Provisioning custom Linux OS images directly onto physical server hardware.

## Decision

We decide to adopt **Option B: Cloud-Agnostic Open Container Standard Architecture**.

- **Container Standards:** All microservices are packaged as Open Container Initiative (OCI) compliant images.
- **Orchestration:** Container orchestration uses standard Kubernetes manifests and Helm charts.
- **Infrastructure-as-Code (IaC):** Cloud infrastructure provisioning uses open, cloud-agnostic IaC templates (OpenTofu / Terraform).

## Rationale

- Prevents dependency on proprietary cloud APIs, allowing SentinelAI to run identically on AWS, Azure, GCP, or customer private clouds.
- Enables single-command automated deployment for enterprise pilot validations (`BO-1`, `TTV < 14 days`).

## Consequences

- **Positive:** Complete cloud vendor independence, reproducible deployments, support for private VPC / air-gapped customer clouds.
- **Negative:** Cannot leverage some proprietary managed cloud features without abstraction layers.

## Trade-offs

Abstracting cloud-specific services accepted to guarantee enterprise customer deployment freedom.

## Risks

Variations in Kubernetes CNI network performance across cloud providers. Mitigated by standardized performance benchmarking suites in CI/CD pipelines.

## Future Reconsideration Conditions

Reconsider if cloud providers standardize open cross-cloud serverless container runtimes.

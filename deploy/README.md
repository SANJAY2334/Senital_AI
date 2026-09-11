# deploy/

Infrastructure-as-Code and Kubernetes deployment manifests (ADR-0016, HLD Section 14).

- `helm/`: Kubernetes Helm charts per microservice pod pool.
- `opentofu/`: Cloud-agnostic Infrastructure-as-Code (IaC) templates for AWS, Azure, GCP, and Private VPC deployments.
- `docker/`: Base container images and multi-stage build definitions.

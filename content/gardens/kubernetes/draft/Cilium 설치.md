---
tags:
  - kubernetes
---
```yaml
ipam:
  mode: "cluster-pool"
  operator:
    clusterPoolIPv4PodCIDRList:
      - "10.128.0.0/16"
```
## Storage

### Regular Volume

- It can live across containers restart. It lives as long as the pod does.
- It can be shared by multiple containers in the same pod.
- Different types/sources. i.e `emptyDir` or `hostPath` that mounts node filesystem to pod.
- Pod level resource

### Persistent Volume

- Live beyond pod/node restarts
- Cluster level resource. That is available to all ns.
- `StorageClass` describes storage offering in cluster.
- Local or cloud drives can be attached to the cluster as a Persistent Volume. This can be thought of as plugging an external hard drive in to the cluster.
- Provides a file system that can be mounted to the cluster, without being associated with any particular node. In AWS, the EBS Volume (PV) stays detached from your nodes as long as it is not claimed by a Pod. As soon as a Pod claims it, it gets attached to the node that holds the Pod.
- On AWS, it uses EBS CSI driver to help EKS manage EBS as PVs. Since k8s version `1.11`, no storage class is required.

### Types

#### Static Provisioning

One downside is fixed sizing!

```yml
# begin with creating PV
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-pv
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 5Gi
  csi:
    driver: ebs.csi.aws.com
    fsType: ext4
    # vol needs to pre-exist
    volumeHandle: vol-03c604538dd7d2f41
  # limit what nodes this volume can be accessed from. Pods that use a PV will only be scheduled to nodes that are selected by the node affinity
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: topology.ebs.csi.aws.com/zone
              operator: In
              values:
                - us-east-2c

---
# allocate storage per claim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-claim
spec:
  storageClassName: "" # Empty string must be explicitly set otherwise default StorageClass will be set
  volumeName: test-pv
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi

---
# use it
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: centos
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo $(date -u) >> /data/out.txt; sleep 5; done"]
    volumeMounts:
    - name: persistent-storage
      mountPath: /data
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: ebs-claim
```

#### Dynamic Provisioning

`StorageClass` needs to be created by admin. It watches for `PVC`s and dynamically creates `PV` to fulfill them when no existing `PV`s match claim requests.

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
# allows for PV upsizing. Simply edit PVC to set a bigger size. However, downsizing is not supported.
# if you edit both the capacity of the PV and PVC to have the same size, k8s will assume that the backing volume size has been manually increased and that it doesn’t need to resize it.
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: Immediate
```

Once done with PV, delete PVC so the taken PV can be re-used subject to `retain` policy in `StorageClass`.

#### Notes

Use `volumeClaimTemplates` instead when using it in a [StatefulSet](./pod.md#statefulset).

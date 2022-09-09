## Storage

### Regular Volume

- It can live across containers restart. It lives as long as the pod does.
- It can be shared by multiple containers in the same pod.
- Different types/sources. i.e `emptyDir` or `hostPath` that mounts node filesystem to pod.
- Pod level resource

### Persistent Volume

- Live beyond pod/node restarts
- Cluster level resource. That is available to all ns.
- Local or cloud drives can be attached to the cluster as a Persistent Volume. This can be thought of as plugging an external hard drive in to the cluster.
- Provides a file system that can be mounted to the cluster, without being associated with any particular node. In AWS, the EBS Volume (PV) stays detached from your nodes as long as it is not claimed by a Pod. As soon as a Pod claims it, it gets attached to the node that holds the Pod.
- On AWS, it uses EBS CSI driver to help EKS manage EBS as PVs. Since k8s version `1.11`, no storage class is required.

```yml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: my-persistent-volume
spec:
  capacity:
    storage: 128M
# The list of ways the persistent volume can be mounted
  accessModes:
    - ReadWriteOnce
# Configuration settings for the persistent volume.
# In this case, we're going to store the data on minikube.
hostPath:
  path: /data/my-persistent-volume/

---
# allocation claim request
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: my-small-pvc
spec:
  # "Give me a persistent volume with at least
  # 64MB of space where I can read and write."
  resources:
    requests:
      storage: 64M
accessModes:
  - ReadWriteOnce

---
# use it via reference to pvc name
apiVersion: v1
metadata:
  name: my-pv-user-pod
spec:
  volumes:
    # This volume is of type persistentVolumeClaim -- i.e.
    # we need a persistent volume.
    - name: a-persistent-volume
      persistentVolumeClaim:
        # Must match claim name from the PVC YAML
        claimName: my-small-pvc
# Mount the volume into the container and use it
containers:
  - name: pv-user
    volumeMounts:
      - name: a-persistent-volume
        mountPath: /var/forever
    image: alpine
    command: ["/bin/sh"]
    # output written to PV
    args: ["-c", "while true; do date >> /var/forever/file.txt; sleep 5; done"]
```

Use `volumeClaimTemplates` instead when using it in a [StatefulSet](./pod.md#statefulset).

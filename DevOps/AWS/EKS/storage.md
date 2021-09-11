## Storage

### Volume

- It can live across containers restart. It lives as long as the pod does.
- It can be shared by multiple containers in the same pod.
- Different types/sources. i.e `emptyDir` or `hostPath` that mounts node filesystem to pod.
- pod level resource

### Persistent Volume

- Live beyond pod/node restarts
- Resource in cluster

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
    args: ["-c", "while true; do date >> /var/forever/file.txt; sleep 5; done"]
```

## ConfigMap & Secret


### Secret

- Value must be base64 encoded
- Stored in `tmpfs` on each node
- Sent to a node when one of node's pods explicitly requires it and removes the Secret if upon pod's removal
- Only visible inside the pod requesting it

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: api-authentication-secret
type: Opaque
data:
  key: T1VSX0FQSV9BQ0NFU1NfS0VZCg==
  token: U0VDUkVUXzd0NDgzNjM3OGVyd2RzZXIzNAo=
```

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: pod-using-secret
spec:
  # Add the Secret as a volume to the Pod
  volumes:
    # `name` here must match the name
    # specified in the volume mount
    - name: api-secret-volume
      # Populate the volume with config map data
      secret:
        # `secretName` here must match the name
        # specified in the secret's YAML
        secretName: api-authentication-secret

containers:
  - name: container-secret
  image: nginx:1.7.9
  volumeMounts:
    # `name` here must match the name
    # from the volumes section of this pod
    - name: api-secret-volume
      mountPath: /etc/secret
```

Then, you can access `/etc/secret/key` and `/etc/secret/token` files on your container.

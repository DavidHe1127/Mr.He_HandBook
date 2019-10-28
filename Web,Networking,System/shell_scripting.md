## Shell Scripting with example

```sh




function validate_art_creds {
	if [[ -z ${ARTIFACTORY_USER} || -z ${ARTIFACTORY_PASSWORD} ]]; then
		echo "provide artifactory credentials"
		exit 1;
	fi
}
```

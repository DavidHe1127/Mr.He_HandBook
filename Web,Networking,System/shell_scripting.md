## Shell Scripting with example

```sh

#!/bin/bash

# e - exit immediately if a command exits with a non-zero status
# x - print commands and their arguments as they are executed
set -xe

# turn off debugging
set +x

# evaluation & interpolation
FOO=`whoami`
EVAL_FOO=`echo Port no. is $FOO not good`

echo $EVAL_FOO

# reset var to an empty string
HTTP_PROXY=

# a func
function validate_art_creds {
  # -z <STRING> means true if string is null/empty
  if [[ -z ${ARTIFACTORY_USER} || -z ${ARTIFACTORY_PASSWORD} ]]; then
    echo "provide artifactory credentials"
    exit 1;
  fi
}
```

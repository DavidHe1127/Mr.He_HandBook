## Shell Scripting with example

```sh
#!/bin/bash

# e - exit immediately if a command exits with a non-zero status
# x - print commands and their arguments as they are executed
set -xe

### turn off debugging
set +x

### evaluation & interpolation
FOO="$(whoami)"
EVAL_FOO="echo Port no. is $FOO not good"
echo $EVAL_FOO
CommitShort=$(git  rev-parse --short HEAD) # execute cmd and assign output to CommitShort var
eval "$(aws ecr get-login --no-include-email)" # execute returned value from calling ecr get-login

### print 'Default to good if 2nd arg not provided'
Build=${2:-Default to good if 2nd arg not provided}

### reset var to an empty string
HTTP_PROXY=

### if...else
# fi closes of if statement
if [ "$NODE_ENV" == "production" ]; then
  let_us_do_it
else
  echo "fuck"
fi

### create dir recursively
mkdir a/b/c/d # will fail
mkdir -p a/b/c/d # will create a, b, c, d in the correct nested structure

### substring. arg1 - zero-based offset arg2 - length
str='123456789'
output=${str:1:5} # 23456

### func
function validate_art_creds {
  # -z <STRING> means true if string is null/empty
  if [[ -z ${ARTIFACTORY_USER} || -z ${ARTIFACTORY_PASSWORD} ]]; then
    echo "provide artifactory credentials"
    exit 1;
  fi
}

### string interpolation
template='my*appserver'
server='live'

function string_replace {
    echo "${1/\*/$2}"
}

template=$(string_replace "$template" "$server")

### regex
STATUS=200

OK_STATUS_REG='^2[0-9]{2}$'

if [[ $STATUS =~ $OK_STATUS_REG ]]
then
  echo 'matched'
fi
```

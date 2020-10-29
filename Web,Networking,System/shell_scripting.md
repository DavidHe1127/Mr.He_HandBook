## Shell Scripting with example

```sh
#!/bin/bash

### x - print commands and their arguments as they are executed
set -x

### turn off debugging
set +x

### Call echo "INTERRUPTED!" regardless. Place it at the top after non-comment line
trap 'echo "INTERRUPTED!"' EXIT

### evaluation & interpolation
# (command)
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

### check if a var is unset

# if parameter is set, replaced by x
# has no special meaning and could be replaced with any non-null string.
# It is there primarily because just [ -z $parameter ] would also return true if parameter were set to null (empty string)
# If parameter contains spaces in between different parts of string, then use [ ! "${#parameter}" == 0 ]
if [ -z ${parameter+x} ]
then
  echo 'parameter is unset'
fi

### named param implementations via using switch/case and while loop
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--deploy) deploy="$2"; shift ;;
        -u|--uglify) uglify=1 ;;
        -x|--xx) xx="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

echo "$deploy, $uglify, $xx"

# flow explained
# $ ./case.sh --deploy yes -u -x files
# 1st loop - captured by -d|--deploy and assign yes to deploy. Followed by 2 shifts, this will make -u become $1
# 2nd loop - captured by -u|--uglify and assign 1 to uglify. Given -u flag does not require value so no need to add shift. After required shift, -x becomes $1
# 3nd loop - captured by -x|--xx and assign files to xx. Followed by 2 shifts, this will make arg length 0 which exits loop
# ; means irrespective of resulting status code for command before it, always execute command after it.

### switch/case

# note "" around case value is optional
var=devss

case $var in
    "test")
        echo "this is ${var}"
        ;;
    "dev")
        echo "this is ${var}"
        ;;
    "sit")
        echo "this is ${var}"
        ;;
    "ppte")
        echo "this is ${var}"
        ;;
    *)
        echo "no match found"
        ;;
esac

### Temp switch folder context to run a command.
(cd build && zip -r "../$ZIP_FILE" .)

```

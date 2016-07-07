## Table of Contents

* [Find and Replace in files](#find-replace-in-files)

#find-replace-in-files
* Command below finds all matched files and sends the result to `sed`(stream editor) to execute.
* `-i` denotes edit files in place. `{}` denotes each resulting file name. `;` denotes the end of command and we use `\` to escape it.

```curl
find -name \*.js -exec sed -i "s/\"use strict\"/\'use strict\'/g" {} \;
```




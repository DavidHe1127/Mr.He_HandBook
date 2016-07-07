## Table of Contents

* [Find and Replace in files](#find-replace-in-files)

#find-replace-in-files
* It finds all matched files and sends the result to sed to execute.
* `-i` denotes edit files in place. `{}` denotes each resulting file name. `\;` escape semi-colon since its meanings differ in systems.

```curl
find -name \*.js -exec sed -i "s/\"use strict\"/\'use strict\'/g" {} \;
```




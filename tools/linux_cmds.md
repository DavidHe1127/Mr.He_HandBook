## Table of Contents

* [Find and Replace in files](#find-replace-in-files)

#find-replace-in-files
* It finds all matched files and sends the result to sed to execute.
* `-i` 

```curl
find -name \*.js -exec sed -i "s/\"use strict\"/\'use strict\'/g" {} \;
```




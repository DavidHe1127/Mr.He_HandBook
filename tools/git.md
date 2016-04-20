## Table of Contents

* Branch
  * [Create Branch](#create-branch)
  * [Rename Branch](#rename-branch)
  * [Check Branch presence](#check-branch)
* Changes
  * [Remove Commit from origin](#remove-commit)
  * [Reset Commit](#reset-commit)
  * [Cherry-pick Commit](#cherry-pick)
  * [Stash Changes](#stash-change) 
  * [Unstage Changed files](#unstage)

#create-branch
Create a new branch based on `yyy` and push it to remote 
```Javascript
git co -b xxx yyy
git push -u origin xxx // u - set up-stream channel
```

#rename-branch
```Javascript
git br -m <OLD_NAME> <NEW_NAME>
git push origin -u <NEW_NAME>
git push origin :<OLD_NAME> // delete old remote branch
```

#check-branch
List all branches on remote. Pass optional `BRANCH` to see if that specific branch is there
```Javascript
git ls-remote --heads git@bitbucket.org:zentri/zdc.git [BRANCH]
```

#remove-commit
Remove an already-pushed commit. Need to make sure no one else pulls out your bad changes or bad commit will come back
next time others push their code.
`git reset --hard <LAST_GOOD_COMMIT>`
`git push --force`
If others already have your bad commit. See below
```Javascript
(them) git fetch
(them) git reset --hard origin/branch
```

#reset-commit
Reset to the last two commits (yet to be pushed to remote). `--hard` discard changes, `--soft` retain changes.
```git reset --hard HEAD^^```

#cherry-pick
Cherry pick a commit. Pick it from other branches and insert it into current branch
```Javascript
git cherry-pick <COMMIT_HASH>
```

#stash-change
`git apply [stash@{0}]` does not remove stashed change(s) from list. Use `git pop [stash@{0}]` will remove it right after applying changes
```Javascript
git stash
git stash list //list all stashed changes
git apply [stash@{0}] //apply all stashed changes or apply change with index 0
git drop stash@{0} //drop change with index 0
git pop [stash@{0}] //apply all changes and remove them afterwards
git stash clear //remove all stashed changes
```

#unstage
```javascript 
git reset <FILE_PATH>
```

## Table of Contents

`[]` denotes optional params

* Branch
  * [Create Branch](#create-branch)
  * [Rename Branch](#rename-branch)
  * [Check Branch presence](#check-branch)
  * [Remove branch](#remove-branch)
  * [Check Branch merge status](#if-merge-into-master)
* Changes
  * [Remove Commit from origin](#remove-commit)
  * [Reset Commit](#reset-commit)
  * [Cherry-pick Commit](#cherry-pick)
  * [Stash Changes](#stash-change) 
  * [Unstage Changed files](#unstage)
  * [View change details after pull](#view-change-detail-after-pull)
  * [Unreset changes](#unreset-change)
* Merge
  * [Check unmerged commits](#unmerged-commits)
* Miscellaneous
  * [Ignore tracked file](#ignore-tracked-file)

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

#remove-branch
```javascript
git branch -d [BRANCH] // del local one
git push origin :[BRANCH] // del remote one
```

#if-merge-into-master
You **MUST** make sure `master` branch is up-to-date before running the check. Otherwise, result might not be true!
```javascript
git branch --no-merged master // list all unmerged feature branches
git branch [BRANCH] --merged master // If output is that BRANCH, it is merged or else not merged
```

#remove-commit
Remove an already-pushed commit. Need to make sure no one else pulls out your bad changes or bad commit will come back
next time others push their code.
```javascript
`git reset --hard <LAST_GOOD_COMMIT>`
`git push --force`
```
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
git stash apply [stash@{0}] //apply all stashed changes or apply change with index 0
git stash drop stash@{0} //drop change with index 0
git stash pop [stash@{0}] //apply all changes and remove them afterwards
git stash clear //remove all stashed changes
git stash show -p stash@{1} //view stash without applying it
```

#unstage
```javascript 
git reset <FILE_PATH>
```

#view-change-detail-after-pull
Specify `filename` if you want to see changes in a specific file. `master@{1}` means the immediate prior value of master.

If you are on branch `blabla` then `@{1}` means the same as `blabla@{1}`.

For more details see [gitrevisions](http://schacon.github.io/git/gitrevisions.html)
```javascript
git diff master@{1} master [filename]
```

#unreset-change
Whenver you did a `reset HEAD^` and want to undo it, you need to run the following.
```javascript
git reflog // shows log list which guides you which point you need to go back to
git reset HEAD@{N} // undo reset to N
```

#unmerged-commits
Whenever you want to see unmerged commits from another branch, run the following
```javascript
git log <OLD_BRANCH> ^<NEW_BRANCH> --no-merges
```

#ignore-tracked-file
Normally, any untracked files can be ignored by putting them in `.gitignore` under root directory. If file is tracked (in the INDEX), it cannot
be ignored. To force ignore, do the following
```javascript
git update-index --[no-]assume-unchanged filename // no is optional for un-assume changed
```

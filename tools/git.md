## Table of Contents

[Create Branch](#Create Branch)



* Reset to the last two commits (yet to be pushed to remote). `--hard` discard changes, `--soft` retain changes.
```git reset --hard HEAD^^```
* Remove an already-pushed commit. Need to make sure no one else pulls out your bad changes or bad commit will come back
next time others push their code.
`git reset --hard <LAST_GOOD_COMMIT>`
`git push --force`
If others already have your bad commit. See below
```
(them) git fetch
(them) git reset --hard origin/branch
```
* Rename a branch
```
git br -m <NEW_NAME>
git push origin -u <NEW_NAME>
git push origin :<OLD_NAME> // delete old remote branch

```
* Cherry pick a commit. Pick it from other branches and insert it into current branch
```
git cherry-pick <COMMIT_HASH>
```


















#####Create Branch
***
Create a new branch based on `yyy` and push it to remote 
```
git co -b xxx yyy
git push -u origin xxx // u - set up-stream channel
```

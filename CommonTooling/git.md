## Table of Contents

`[]` denotes optional params

- Concepts
  - [Merge typs](#merge-types)
  - [HEAD and refs](#head-and-refs)
  - [origin/master, master, origin, origin/HEAD](#origin-master)
  - [refspec](#refspec)
  - [Detached](#detached)

- Branch

  - [Rename Branch](#rename-branch)
  - [Check Branch presence](#check-branch)
  - [Remove branch(es)](#remove-branches)
  - [Check Branch merge status](#if-merge-into-master)
  - [Remove local branches that their remote counterparts no longer exist](#remove-non-tracking-local-branches)

- Changes

  - [Remove Commit from origin](#remove-commit)
  - [Reset Commit](#reset-commit)
  - [Cherry-pick Commit](#cherry-pick)
  - [Stash Changes](#stash-change)
  - [View change details after pull](#view-change-detail-after-pull)
  - [Unreset changes](#unreset-change)
  - [Show branches containing a commit](#show-branch-has-commit)
  - [Sync with remote, overwrite local changes](#sync-remote-kill-local)
  - [Add only modified/deleted files excluding untracked files](#add-exclude-untracked-files)
  - [Revert commited changes to align with that from main](#revert-committed-changes)

- Merge
  - [Check unmerged commits](#unmerged-commits)
  - [See when commites merged](#when-merged)
- Miscellaneous
  - [Ignore tracked file](#ignore-tracked-file)
  - [Remove node_modules committed by mistake](#remove-node_modules)
  - [See all tags with tagged messages](#show-tags)
  - [Revert vs Reset](#revert-vs-reset)
  - [Create & push a tag](#create-n-push-tag)


## Merge types

### Squash
![squash merge](squash-merge.png)

Pros:
  - Keep commit history clean by squashing multiple commits into one.
Cons:
  - While it keeps all changes from the squashed commit, it does not preserve each individual commit. This can prevent tool like `semantic-release` working out whether or not a release needs to be carried out as it needs to look through individual commits to make a decision.

### 3-way merge
![3-way-merge](3-way-merge.png)

Pros:
  - Preserve each individual commit from source branches
Cons:
  - It always creates a new commit to include all other commits done on source branch. This lead to non-linear commit history.

#### fast-forward merge
It occurs when branches have not diverged when merging. By diverged, it means target branch has new changes since source branch is checked out from it.

```
o ---- o ---- A ---- B  origin/master
               \
                C  feature
```

When no divergence, you can have a ff merge. It's good as it keeps git history linear. However, ff could confuse users as they don't know what's been done on source branch. It looks as if all changes are made directly on `master` branch.

![ff-merge](ff-merge.png)

Mr. He suggests NEVER EVER have a ff merge when working in a collaborative environment.

### Rebase
![rebase-merge](rebase-merge.png)

Pros:
  - Simplified, linear commit history
Cons:
  - It is hard to tell who made what changes when rebasing into target branch from multiple source branches
  - Manual conflicts resolving is required and very often

### HEAD and Refs

Ref is a file that records a full sha-1 associated with a commit. i.e

```sh
# local branch reference
# heads include all local branches

A/.git/refs/heads
$ cat master
f2691475f70b511bb92f05d16a260b16bb9a3d2b

# latest commit log
# * f269147 - (HEAD -> master, origin/master, origin/HEAD) update git (13 minutes ago) <David He>

# tag reference

A/.git/refs/tags
$ cat v1.0.0
d4943b8be84d8e1a5f11ad4794028fe12aea0598

# sha-1 corresponds to tag v1.0.0
```

`HEAD` is a pointer. It points to the latest commit on the current branch. So it can also be interpreted as it's pointing to the current branch.

```shell
$ cat .git/HEAD
ref: refs/heads/master
```

[Read more](https://www.softwhy.com/article-8500-1.html)

## Origin/HEAD
`HEAD` is a pointer always pointing to the current branch (latest commit).

```
 b81c023 - (HEAD, origin/main, origin/HEAD, main) Merge pull request #283 from abc/feat-100 (36 minutes ago) <David He>
```

Above log tells you that:

- local `HEAD`
- main branch on origin (remote)
- remote `HEAD`
- local `main`

All points to `b81c023` commit sha.

## Refspec

```
[remote "origin"]
  url = git@github.com:schacon/simplegit-progit.git
  # <src>:<dst>
  # Fetch all branches under .git/refs/heads folder from remote and put them in .git/refs/remotes/origin/
  # + means force fetch even if ff is impossible
  fetch = +refs/heads/*:refs/remotes/origin/*

  # fetch only master branch can also be done like - git fetch origin master:refs/remotes/origin/mymaster
  fetch = +refs/heads/master:refs/remotes/origin/master
```

## Detached

Detached `HEAD` means you are no longer on a branch, you have checked out a single commit in the history (in this case the commit previous to `HEAD`, i.e. `HEAD^`).

---

## rename-branch

```shell
git br -m <OLD_NAME> <NEW_NAME>
git push origin -u <NEW_NAME>
git push origin :<OLD_NAME> // delete old remote branch
```

## check-branch

List all branches on remote. Pass optional `BRANCH` to see if that specific branch is there

```shell
git ls-remote --heads git@bitbucket.org:zentri/zdc.git [BRANCH]
```

## remove branches

```shell
git branch -d [BRANCH] // del local one
git push origin :[BRANCH] // del remote one
git br | grep IO-9 | xargs git branch -D // remove ones starting their names with IO-9
```

## if-merge-into-master

You **MUST** make sure `master` branch is up-to-date before running the check. Otherwise, result might not be true!

```shell
git branch --no-merged master // list all unmerged feature branches
git branch [BRANCH] --merged master // If output is that BRANCH, it is merged or else not merged
```

## remove-non-tracking-local-branches

Command below will remove your local `remote tracking` branches that are no longer exist on the remote.

```shell
git remote prune origin
```

## remove-commit

Remove an already-pushed commit. Need to make sure no one else pulls out your bad changes or bad commit will come back
next time others push their code. Use `--soft` if you want to keep the changes

```shell
git reset --hard <LAST_GOOD_COMMIT>
git push --force
```

If others already have your bad commit. See below

```shell
(them) git fetch
(them) git reset --hard origin/branch
```

## reset-commit

Reset to the last two commits (yet to be pushed to remote). `--hard` discard changes, `--soft` retain changes.

```shell
git reset --hard HEAD^^
```

## cherry-pick

Cherry pick a commit. Pick it from other branches and insert it into current branch

```shell
git cherry-pick <COMMIT_HASH>
```

## stash-change

`git apply [stash@{0}]` does not remove stashed change(s) from list. Use `git pop [stash@{0}]` will remove it right after applying changes

```shell
git stash
git stash list # list all stashed changes
git stash apply [stash@{0}] # apply all stashed changes or apply change with index 0
git stash drop stash@{0} # drop change with index 0
git stash pop [stash@{0}] # apply all changes and remove them afterwards
git stash clear # remove all stashed changes
git stash show -p stash@{1} # view stash without applying it

// stash all
git stash save <MESSAGE>

// a single file
git stash push <FILE_PATH> # stash a single file only
git stash push -m '<YOUR_MESSAGE>'  -- <FILE_PATH> # stash a single file with messages
```

## view-change-detail-after-pull

Specify `filename` if you want to see changes in a specific file. `master@{1}` means the immediate prior value of master.

If you are on branch `blabla` then `@{1}` means the same as `blabla@{1}`.

For more details see [gitrevisions](http://schacon.github.io/git/gitrevisions.html)

```shell
git diff master@{1} master [filename]
```

## unreset-change

Whenver you did a `reset HEAD^` and want to undo it, you need to run the following.

```shell
git reflog # shows log list which guides you which point you need to go back to
git reset HEAD@{N} # undo reset to N
```

## show-branch-has-commit

```shell
git branch -a --contains <COMMIT_HASH> # include remote branch
git branch --contains <COMMIT_HASH> # just local one
```

## sync-remote-kill-local

```shell
git fetch origin && git reset --hard origin/<BRANCH_NAME> && git clean -f -d
```

## add-exclude-untracked-files

```shell
git add -u
```

## revert-committed-changes

```shell
git checkout origin/main <pathToFile>
```

---

## unmerged-commits

Whenever you want to see unmerged commits from another branch, run the following

```shell
git log <OLD_BRANCH> ^<NEW_BRANCH> --no-merges
```

## unmerged-commits

Use [When merged](https://github.com/mhagger/git-when-merged)

```shell
git when-merged -l <COMMIT>
```

## ignore-tracked-file

Normally, any untracked files can be ignored by putting them in `.gitignore` under root directory. If file is tracked (in the INDEX), it cannot
be ignored. To force ignore, do the following

```shell
git update-index --[no-]assume-unchanged filename // no is optional for un-assume changed.
git update-index --assume-unchanged app/*.js // supports wildcard match
```

## remove-node_modules

```shell
git rm -r --cached node_modules
```

## show-tags

```shell
git tag -n99
```

## create-n-push-tag

```
git tag -a v1.0.0 -m "Releasing version v1.0.0"
git push origin <tag>
```

## revert-vs-reset

`git revert <insert bad commit hash here>`

`git revert` creates a new commit with the changes that are rolled back. `git reset` erases your git history instead of making a new commit.

#!/bin/sh
current_branch="$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')"
local_changes=false

if [[ `git status --porcelain` ]]; then
    local_changes=true
    git stash
fi

git fetch origin master
git checkout master
git reset --hard origin/master

rm -rf dist
npm run build
git add --force dist && git commit -m "build `date +%Y%m%d%H%M%S`"
commit_id="$(git subtree split --prefix dist)"
git push --force origin "$commit_id:gh-pages"

git reset --hard origin/master
git checkout $current_branch

if [ $local_changes = true ]; then
    git stash pop
fi

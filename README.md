Staging deploy to Github Pages
==============================

git checkout gh-pages
git rebase master

jspm bundle index.js --inject --minify

git add config.js build.*
git commit --amend --no-edit
git push github gh-pages --force


Move Github Edits on gh-pages back to master
============================================

# fetch new changes from github
git fetch github
git checkout gh-pages
git merge --ff github/gh-pages
# cherry pick new commits back to master
git checkout master
git cherry-pick <HASH>...<HASH>   # for the ENTIRE range of gh-pages commits
# update the gh-pages branch
git checkout gh-pages
git rebase master
# make sure everything is ok
# should be identical! - changes are still on github/gh-pages
git diff master gh-pages !(build*|config.js)
# delete the old cherry-picked commits
git checkout github/gh-pages
git reset --hard gh-pages

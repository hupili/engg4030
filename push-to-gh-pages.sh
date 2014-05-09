#!/usr/bin/env bash
# A general gh-pages deploy script
# Adapted from:
# https://github.com/hupili/5carts/blob/master/deploy.sh

dir_input="engg4030"
dir_output="dist_to_gh_pages"
remote_url=`git config --get remote.origin.url`
cur_time=`date`


if [[ -d $dir_output ]]; then
    echo "$dir_output exist, do incremental update"
else
    echo "$dir_output not exist, init the gh-pages branch"
    # First execution:
    # Create orphan branch to init the content
    mkdir -p $dir_output
    cd $dir_output
    git init .
    git checkout --orphan gh-pages
    git remote add deploy $remote_url
    cd -
fi

rm -rf $dir_output/*
cp -r $dir_input/* $dir_output

cd $dir_output
git add .
git add -u .
git commit -m "Update Site: $cur_time"
git push deploy gh-pages --force
cd -


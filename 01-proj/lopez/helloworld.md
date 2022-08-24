Hola mundo!


https://www.reddit.com/r/ObsidianMD/comments/qb55c7/syncing_over_gitgithub_how_to_set_up_gitignore/

To sum:

1.  make a `.gitignore` file in the root directory of the vault `MyVault/.gitignore`
    
2.  Add the following line into the gitignore file: `.obsidian/workspace`
    
3.  Add the file e. g. `git add.`
    
4.  Commit
    
5.  remove the cached .obsidian/workspace: `git rm --cached .obsidian/workspace`
    
6.  Commit again.
    
7.  Done. Now the obsidian workspace will not update with the git repo and thus no merge conflicts in the future
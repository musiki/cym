---
type: exercise
author: Nicolás López 
tags: code, js, tonejs
publish: 2022
---

# Para hard reset en git:
git fetch --all
git reset --hard HEAD


---

# Para ignorar directorios/archivos trackeados:

https://www.reddit.com/r/ObsidianMD/comments/qb55c7/syncing_over_gitgithub_how_to_set_up_gitignore/

To sum:

1.  make a `.gitignore` file in the root directory of the vault `MyVault/.gitignore`
2.  Add the following line into the gitignore file: `.obsidian/workspace`
3.  Add the file e. g. `git add.`
4.  Commit
5.  remove the cached .obsidian/workspace: `git rm --cached .obsidian/workspace`
6.  Commit again.
7.  Done. Now the obsidian workspace will not update with the git repo and thus no merge conflicts in the future

---

# Se discute en más detalle acá:

https://stackoverflow.com/questions/23673174/how-to-ignore-new-changes-to-a-tracked-file-with-git
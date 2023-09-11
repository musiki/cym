# Conflicts
Please resolve them and commit them using the commands `Obsidian Git: Commit all changes` followed by `Obsidian Git: Push`
(This file will automatically be deleted before commit)
[[#Additional Instructions]] available below file list

- Not a file: .DS_Store
- Not a file: .obsidian/appearance.json
- Not a file: .obsidian/plugins/colored-tags/data.json
- Not a file: .obsidian/plugins/obsidian-activity-history/data.json
- Not a file: .obsidian/plugins/obsidian-commits/data.json
- Not a file: .obsidian/workspace.json

# Additional Instructions
I strongly recommend to use "Source mode" for viewing the conflicted files. For simple conflicts, in each file listed above replace every occurrence of the following text blocks with the desired text.

```diff
<<<<<<< HEAD
    File changes in local repository
=======
    File changes in remote repository
>>>>>>> origin/main
```
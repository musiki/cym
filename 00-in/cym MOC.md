```dataview
table file.ctime as Created, file.mtime as "últimas ediciones"
where file.name != this.file.name and contains(file.path, this.file.folder) and !contains(file.name, "MOC")
sort file.mtime descending
limit 10
```

![[topoi MOC]]
![[personas MOC]]
![[proyectos MOC]]
![[códigos MOC]]
![[obras MOC]]

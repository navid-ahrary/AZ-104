# Git cheat sheet

## Exclude .js files that are already tracked by Git

```Bash
echo *.js >> .gitignore
git rm --cached \*.js
```

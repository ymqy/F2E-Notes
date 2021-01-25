# 目录

## 参考

- [猴子都能懂的 Git 入门](https://backlog.com/git-tutorial/cn/)

## Code Review

- [Gerrit](https://www.gerritcodereview.com/)

## 提交空文件夹

```shell
find . -type d -empty -exec touch {}/.gitkeep \;
```

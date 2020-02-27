# 目录

- [提交空文件夹](#提交空文件夹)

## Code Review

- [Gerrit](https://www.gerritcodereview.com/)

## 提交空文件夹

```shell
find . -type d -empty -exec touch {}/.gitkeep \;
```

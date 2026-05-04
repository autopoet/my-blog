---
title: 第一次前端实习 Git 生存手册
date: 2026-05-03
categories:
  - 计算机基础
tags:
  - Git
  - 前端实习
  - 工程化
---
<ArticleViews slug="frontend-intern-git-survival-guide" />

> 这篇是写给未来实习时的自己看的。
> 目标不是把 Git 全部学完，而是先能在公司多人协作里安全地拉代码、建分支、提交、推送、开 PR，以及遇到冲突时不慌。

我现在对 Git 的理解还很初级，甚至 `commit` 也只是刚刚熟悉。所以这篇不会写成“Git 原理大全”，而是按实习中最容易遇到的场景整理。

真正高频的命令先记住这些：

```bash
git status
git branch
git checkout 分支名
git checkout -b 新分支名
git pull origin 分支名
git add 文件名
git commit -m "提交信息"
git push
git diff
git log --oneline
```

先把这 10 条用熟，实习初期已经够应对大部分日常协作了。

## 1. 先理解 Git 在公司里是干什么的

在公司写代码不是一个人单机写完就结束，而是多人一起改同一个项目。

Git 主要帮我们做几件事：

- 把项目代码下载到本地。
- 记录自己每次改了什么。
- 让每个人在自己的分支上开发。
- 把自己的代码推到远程仓库。
- 通过 PR/MR 给同事审核。
- 在多人改到同一块代码时解决冲突。

可以先把 Git 理解成一个“代码协作记录系统”。

本地和远程的关系大概是：

```txt
远程仓库 GitHub/GitLab
        ↓ clone / pull
你的电脑本地仓库
        ↓ add / commit
本地提交记录
        ↓ push
远程分支
        ↓ PR / MR
合并到团队主分支
```

新手先记住一句话：

> 本地写代码，commit 是保存到本地 Git 历史，push 才是推到远程让别人看见。

## 2. 第一次配置 Git

第一次在电脑上使用 Git，需要配置名字和邮箱。

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

邮箱最好和 GitHub / GitLab / 公司账号一致，否则提交记录可能关联不到你。

查看当前配置：

```bash
git config --global --list
```

重点确认：

```txt
user.name=xxx
user.email=xxx
```

这个配置一般只需要做一次。

## 3. 第一次拉公司项目

第一次拿到项目地址时，用 `clone` 下载代码。

```bash
git clone 项目地址
```

项目地址一般来自 GitHub 或 GitLab，可能是 HTTPS：

```txt
https://github.com/company/project.git
```

也可能是 SSH：

```txt
git@github.com:company/project.git
```

下载后进入项目目录：

```bash
cd 项目文件夹
```

后续 Git 命令一般都要在项目目录里执行。

如果不知道自己现在是不是在 Git 项目里，敲：

```bash
git status
```

这是最重要的命令之一。任何不确定时，先 `git status`。

## 4. 看自己在哪个分支

查看本地分支：

```bash
git branch
```

前面带 `*` 的就是当前分支：

```txt
  dev
* feature/login-page
  main
```

查看本地和远程所有分支：

```bash
git branch -a
```

远程分支通常长这样：

```txt
remotes/origin/dev
remotes/origin/main
remotes/origin/feature/login-page
```

查看更详细的提交历史：

```bash
git log --oneline --graph --decorate --all
```

这条不用天天敲，但排查分支问题很有用。

## 5. 开始做需求前，先更新主分支

在公司里，不要拿很久以前的旧代码直接开始写。

开始新需求前，先切到团队主开发分支。

如果公司主开发分支叫 `dev`：

```bash
git checkout dev
git pull origin dev
```

如果公司用 `main`：

```bash
git checkout main
git pull origin main
```

有的公司叫：

- `dev`
- `develop`
- `main`
- `master`

不要想当然。第一次进项目时先问导师：

> 我们平时开发是基于哪个分支切新分支？

## 6. 新建自己的功能分支

不要直接在 `dev` 或 `main` 上写需求。

做新功能：

```bash
git checkout -b feature/login-page
```

修 bug：

```bash
git checkout -b fix/navbar-overflow
```

常见分支命名：

```txt
feature/xxx    新功能
fix/xxx        修 bug
chore/xxx      杂项，比如配置、依赖
refactor/xxx   重构
docs/xxx       文档
style/xxx      样式调整
```

分支名不用花哨，但要让别人看得懂你在做什么。

如果要从远程已有分支切出来：

```bash
git checkout -b 本地分支名 origin/远程分支名
```

例如：

```bash
git checkout -b feature/login-page origin/feature/login-page
```

补充：新版 Git 也可以用 `git switch`：

```bash
git switch dev
git switch -c feature/login-page
```

但很多公司和教程仍然常用 `checkout`，实习初期先会 `checkout` 就够了。

## 7. 查看自己改了什么

写完一部分代码后，先看状态：

```bash
git status
```

它会告诉你：

- 哪些文件被修改了。
- 哪些文件是新文件。
- 哪些文件已经暂存。
- 当前在哪个分支。

查看具体改动：

```bash
git diff
```

这条只看还没 `add` 的改动。

查看已经 `add` 到暂存区的改动：

```bash
git diff --cached
```

查看某个文件的改动：

```bash
git diff 文件路径
```

提交前建议至少做一次：

```bash
git status
git diff
```

如果已经 `add` 了，再看：

```bash
git diff --cached
```

这一步是防止把调试代码、无关文件、环境变量一起提交上去。

## 8. 暂存改动：git add

`git add` 的意思是：把文件放进“准备提交区”。

暂存某个文件：

```bash
git add src/components/Button.tsx
```

暂存多个文件：

```bash
git add 文件1 文件2
```

暂存当前所有改动：

```bash
git add .
```

新手更推荐先一个个加文件，不要一上来就 `git add .`。

因为 `git add .` 可能会把这些东西也加进去：

- 临时调试文件。
- `.env` 环境变量。
- 无关格式化改动。
- 误生成的文件。
- 包管理器锁文件变化。

如果不小心 `git add .` 加错了，可以撤出暂存区：

```bash
git restore --staged 文件路径
```

这条很常用。它不会删除你的代码，只是把文件从暂存区拿出来。

## 9. 提交代码：git commit

`commit` 的意思是：把暂存区的改动保存成一次本地提交记录。

```bash
git commit -m "feat: add login page"
```

好的 commit 信息应该说明“做了什么”。

常见前缀：

```txt
feat:      新功能
fix:       修复问题
style:     样式调整，不影响逻辑
refactor:  重构
chore:     配置、依赖、构建相关
docs:      文档
test:      测试
```

示例：

```bash
git commit -m "feat: add login page"
git commit -m "fix: handle empty avatar url"
git commit -m "style: adjust navbar spacing"
git commit -m "docs: update setup guide"
```

不推荐：

```bash
git commit -m "改了一下"
git commit -m "update"
git commit -m "fix bug"
```

因为别人看提交历史时完全不知道你改了什么。

我现在可以先记住一个模板：

```bash
git commit -m "类型: 做了什么"
```

比如：

```bash
git commit -m "feat: add user profile card"
```

## 10. 推送到远程：git push

`commit` 只是保存到本地，别人还看不到。

要推到远程仓库，需要：

```bash
git push
```

如果是第一次推送一个新分支：

```bash
git push -u origin feature/login-page
```

`-u` 的意思是建立本地分支和远程分支的关联。

第一次设置过之后，同一个分支后面可以直接：

```bash
git push
```

如果 push 失败，提示远程有更新，通常需要先同步远程：

```bash
git pull --rebase origin 分支名
git push
```

但是实习初期如果看到不熟悉的错误，不要乱试 `force push`，先问同事。

尤其不要随便用：

```bash
git push --force
```

这条可能覆盖别人远程提交。

## 11. 提交 PR / MR

代码推到远程分支后，一般不是自己直接合并主分支，而是开 PR / MR。

GitHub 叫 Pull Request，GitLab 叫 Merge Request。

常见流程：

```txt
本地 feature 分支
-> push 到远程 feature 分支
-> 打开 GitHub/GitLab
-> New Pull Request / Merge Request
-> 选择目标分支
-> 填描述
-> 等 reviewer 审核
-> 修改意见
-> 通过后合并
```

目标分支要选团队指定分支，比如 `dev`、`develop` 或 `main`。

不要随便选错。

PR 描述可以这样写：

```md
## 做了什么
- 新增登录页面
- 添加表单校验
- 接入登录接口

## 如何测试
- 本地运行 npm run dev
- 测试空用户名、错误密码、正确登录

## 截图
放截图
```

前端改 UI 最好附截图或录屏，这样 reviewer 不用自己跑项目也能先看效果。

## 12. 开发中同步主分支最新代码

你开发自己的分支时，团队主分支可能已经更新了。

这时要把主分支最新代码同步到自己的分支。

新手更容易理解的方式是 merge：

```bash
git checkout dev
git pull origin dev
git checkout feature/login-page
git merge dev
```

意思是：

```txt
先更新 dev
再回到自己的分支
把 dev 合进来
```

如果公司推荐 rebase，也可能这样：

```bash
git checkout feature/login-page
git fetch origin
git rebase origin/dev
```

merge 和 rebase 的区别先不用钻太深。

实习初期先记住：

- 不确定用 merge 还是 rebase，问导师。
- rebase 出冲突时，不要乱 commit。
- 团队有规范就按团队来。

## 13. 遇到代码冲突

冲突通常发生在：

- `git pull`
- `git merge`
- `git rebase`

提示 conflict 时，先敲：

```bash
git status
```

它会告诉你哪些文件冲突。

打开冲突文件，可能看到：

```txt
<<<<<<< HEAD
你的代码
=======
别人的代码
>>>>>>> dev
```

你要做的是：

1. 判断最终应该保留什么。
2. 改成正常代码。
3. 删除所有冲突标记。
4. 保存文件。
5. `git add` 冲突文件。
6. 根据当前流程继续。

比如最终改成：

```js
const title = props.title || '默认标题';
```

解决 merge 冲突后：

```bash
git add 冲突文件
git commit
```

解决 rebase 冲突后：

```bash
git add 冲突文件
git rebase --continue
```

如果想放弃本次 merge：

```bash
git merge --abort
```

如果想放弃本次 rebase：

```bash
git rebase --abort
```

冲突时最重要的是：不要慌，不要乱删一大片，不懂就叫同事一起看。

## 14. 暂时保存当前改动：stash

有时你代码写到一半，突然需要切分支处理别的事情。

这时可以把当前改动临时收起来：

```bash
git stash
```

带说明保存：

```bash
git stash push -m "login page half done"
```

查看 stash 列表：

```bash
git stash list
```

恢复最近一次 stash：

```bash
git stash pop
```

恢复但保留 stash：

```bash
git stash apply
```

如果有新文件还没被 Git 跟踪，普通 `git stash` 可能不会保存它。

可以用：

```bash
git stash -u
```

但 stash 也别当长期仓库用。它只是临时存放。

## 15. 撤销还没提交的改动

取消已经 `add` 的文件：

```bash
git restore --staged 文件路径
```

这只是从暂存区拿出来，不会删代码。

撤销某个文件的本地修改：

```bash
git restore 文件路径
```

这会丢掉这个文件还没提交的修改，慎用。

撤销所有未提交改动：

```bash
git restore .
```

非常危险。确认这些改动都不要了再用。

旧教程里可能会看到：

```bash
git checkout -- 文件路径
```

新版 Git 更推荐用：

```bash
git restore 文件路径
```

实习初期最常用的是：

```bash
git restore --staged 文件路径
```

因为经常会出现 `git add .` 后发现加错文件的情况。

## 16. 修改最近一次 commit

commit 信息写错了，而且还没 push：

```bash
git commit --amend -m "新的提交信息"
```

忘记 add 某个文件，而且还没 push：

```bash
git add 漏掉的文件
git commit --amend
```

如果已经 push 了，还想 amend，就会涉及改远程历史。

这通常需要：

```bash
git push --force-with-lease
```

但是实习阶段不要自己直接用。先问导师。

简单记：

> amend 适合改“还没推上去”的最近一次 commit。

## 17. 回退已经提交的代码

多人协作时，优先用 `revert`。

查看提交 id：

```bash
git log --oneline
```

撤销某个已经提交的 commit，并保留历史：

```bash
git revert commit_id
```

这会生成一个新的提交，用来抵消旧提交。

如果本地提交还没 push，想撤销 commit 但保留代码改动：

```bash
git reset --soft HEAD~1
```

如果本地提交还没 push，想彻底丢掉最近一次提交和代码：

```bash
git reset --hard HEAD~1
```

`reset --hard` 很危险，会丢代码。

新手原则：

- 多人协作优先 `git revert`。
- 少用 `git reset --hard`。
- 不确定先问人。

## 18. 删除分支

功能合并后，可以删除本地分支：

```bash
git branch -d feature/login-page
```

强制删除本地分支：

```bash
git branch -D feature/login-page
```

慎用，可能删除未合并代码。

删除远程分支：

```bash
git push origin --delete feature/login-page
```

通常 PR 合并后，GitHub / GitLab 页面会提供删除远程分支按钮。

## 19. 查看远程仓库信息

查看远程地址：

```bash
git remote -v
```

你会看到类似：

```txt
origin  https://github.com/company/project.git (fetch)
origin  https://github.com/company/project.git (push)
```

修改远程地址：

```bash
git remote set-url origin 新地址
```

只拉取远程分支信息，不自动合并：

```bash
git fetch origin
```

`fetch` 比 `pull` 更安全，因为它只是把远程信息拿下来，不会直接改你当前代码。

## 20. 前端项目特别注意

前端项目里，Git 最容易踩这些坑。

### 不要提交 node_modules

`node_modules` 应该在 `.gitignore` 里。

如果发现 `git status` 里出现大量 `node_modules` 文件，先停下来，不要提交。

### 不要提交 .env

这些文件可能包含接口地址、token、密钥：

```txt
.env
.env.local
.env.development.local
```

一般不要提交。

### 不要混用包管理器

看项目里有什么锁文件：

```txt
pnpm-lock.yaml  -> 用 pnpm
yarn.lock       -> 用 yarn
package-lock.json -> 用 npm
```

不要项目本来用 `pnpm`，你又跑 `npm install`，生成一个 `package-lock.json` 提上去。

### 提交前跑检查

具体命令看 `package.json`：

```bash
npm run lint
npm run test
npm run build
```

如果项目用 pnpm：

```bash
pnpm lint
pnpm test
pnpm build
```

改 UI 时，本地跑起来检查页面，最好给 PR 附截图。

## 21. 一个实习生最常用的完整流程

假设主开发分支叫 `dev`，我要做登录页。

```bash
# 1. 切到主开发分支
git checkout dev

# 2. 拉最新代码
git pull origin dev

# 3. 新建自己的功能分支
git checkout -b feature/login-page

# 4. 写代码
# ...

# 5. 查看改动
git status
git diff

# 6. 暂存文件
git add src/pages/Login.tsx src/styles/login.css

# 7. 提交
git commit -m "feat: add login page"

# 8. 推送远程
git push -u origin feature/login-page
```

然后去 GitHub / GitLab 上开 PR / MR。

## 22. 每天上班可以照这个节奏

早上开始前：

```bash
git checkout dev
git pull origin dev
```

切到自己的分支：

```bash
git checkout feature/xxx
```

同步主分支最新代码：

```bash
git merge dev
```

写代码：

```bash
npm run dev
```

提交前检查：

```bash
git status
git diff
npm run lint
npm run build
```

提交并推送：

```bash
git add 文件路径
git commit -m "feat: xxx"
git push
```

如果有不确定的文件，不要用 `git add .`，一个个加更安全。

## 23. 新手最容易踩的坑

| 坑 | 怎么避免 |
| :--- | :--- |
| 直接在 `main` / `dev` 上开发 | 每个需求都新建分支 |
| `git add .` 把无关文件也提交了 | 提交前看 `git status` 和 `git diff --cached` |
| commit 信息乱写 | 用 `feat:`、`fix:`、`style:` 这类格式 |
| 没拉最新代码就开始写 | 开发前先 `git pull` |
| 冲突时乱删代码 | 看清楚哪部分是你的、哪部分是别人的 |
| 随便用 `reset --hard` | 这条会丢代码，新手慎用 |
| 提交 `.env` | 环境变量文件不要进 Git |
| 混用包管理器 | 有 `pnpm-lock.yaml` 就用 pnpm，有 `yarn.lock` 就用 yarn |
| push 失败就 force push | 先问同事，不要直接强推 |
| PR 目标分支选错 | 看团队要求，通常是 `dev` 或 `develop` |

## 24. 我现在最应该熟练的 10 条命令

不用一开始就背完所有 Git 命令。

先把这 10 条敲熟：

```bash
git status
git branch
git checkout 分支名
git checkout -b 新分支名
git pull origin 分支名
git add 文件名
git commit -m "提交信息"
git push
git diff
git log --oneline
```

它们分别解决：

| 命令 | 用来干什么 |
| :--- | :--- |
| `git status` | 看当前状态 |
| `git branch` | 看分支 |
| `git checkout 分支名` | 切分支 |
| `git checkout -b 新分支名` | 新建并切换分支 |
| `git pull origin 分支名` | 拉最新代码 |
| `git add 文件名` | 暂存文件 |
| `git commit -m "提交信息"` | 提交到本地 |
| `git push` | 推到远程 |
| `git diff` | 看具体改动 |
| `git log --oneline` | 看提交历史 |

后面的 stash、rebase、revert、reset，可以等遇到真实场景再慢慢掌握。

## 25. 最后给自己的提醒

实习初期用 Git，最重要的不是炫技，而是安全。

遇到不确定情况，先做三件事：

```bash
git status
git branch
git log --oneline
```

然后再决定下一步。

特别危险的命令要谨慎：

```bash
git reset --hard
git push --force
git branch -D
```

看到这些命令，先停一下，确认自己真的知道会发生什么。

可以记住一句话：

> Git 新手最大的能力，不是会多少高级命令，而是知道什么时候该停下来问人。

把 `status`、`diff`、`add`、`commit`、`push`、`pull`、`checkout -b` 和解决冲突流程练熟，就足够支撑第一次前端实习的日常开发了。

<ArticleComments slug="frontend-intern-git-survival-guide" />

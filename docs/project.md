# Horizon & Jasmine — 项目文档

## 概述

**Horizon & Jasmine** 是一个基于 [Hexo](https://hexo.io/) 7.x 构建的个人技术博客，部署于 GitHub Pages（`holycandle.github.io`）。主题 **Jasmine** 为自定义主题，设计风格参考 [BlueSun](https://huang-jerryc.com)（huang-jerryc.com），具有独特的脊柱线时间轴、胶囊导航和 LXGW WenKai 中文字体。

- **站点地址**: https://holycandle.github.io
- **站点标题**: Horizon & Jasmine
- **标语**: 码上见性，屏前忘机
- **作者**: Horizon
- **语言**: zh-CN

---

## 技术栈

| 层 | 技术 |
|------|------|
| 静态生成器 | Hexo 7.3.0 |
| 模板引擎 | EJS |
| 样式 | CSS（无框架，约 1700 行） |
| 客户端 JS | 原生 JavaScript（无框架） |
| Markdown 渲染 | hexo-renderer-marked 6.x |
| 评论 | Giscus（基于 GitHub Discussions） |
| 字体 | LXGW WenKai（霞鹜文楷）+ Calligraffitti |
| 托管部署 | GitHub Pages + GitHub Actions |
| 包管理 | npm |

### NPM 依赖

```
hexo: ^7.3.0
hexo-generator-archive: ^2.0.0
hexo-generator-category: ^2.0.0
hexo-generator-index: ^3.0.0
hexo-generator-tag: ^2.0.0
hexo-renderer-ejs: ^2.0.0
hexo-renderer-marked: ^6.3.0
hexo-server: ^3.0.0
```

---

## 项目结构

```
holycandle.github.io/
│
├── _config.yml                  # Hexo 站点配置（标题、URL、主题）
├── package.json                 # npm 依赖
├── .gitignore
│
├── .github/workflows/
│   └── deploy.yml               # GitHub Actions：push main → 构建 → 发布 gh-pages
│
├── scaffolds/                   # 创建新文章/页面时的模板
│   ├── post.md
│   ├── page.md
│   └── draft.md
│
├── source/                      # ★ 内容源目录
│   ├── _posts/                  # Markdown 博客文章
│   │   ├── 东方不败为什么"不败".md
│   │   ├── 哲学的开端，就是"没有开端".md
│   │   ├── 100块钱与理解上帝的本体论证明发展.md
│   │   ├── 夜登老鹰嘴.md
│   │   ├── 再别君.md
│   │   └── 望江南·中秋.md
│   ├── about/index.md           # "关于"页面
│   ├── categories/index.md      # 分类索引页（layout: category）
│   └── tags/index.md            # 标签索引页（layout: tag）
│
├── themes/jasmine/              # ★ 自定义 Jasmine 主题
│   ├── _config.yml              # 主题配置（导航、头像、Giscus）
│   ├── layout/                  # EJS 布局模板
│   │   ├── layout.ejs           # 基础布局（HTML 壳、字体、模态框）
│   │   ├── index.ejs            # 首页（Hero + 时间轴）
│   │   ├── post.ejs             # 文章页（边栏、目录、评论、滚动监听）
│   │   ├── archive.ejs          # 博客归档页（全部文章时间轴）
│   │   ├── category.ejs         # 分类页（分类药丸 + 分组文章列表）
│   │   ├── tag.ejs              # 标签页（标签药丸 + 分组文章列表）
│   │   └── page.ejs             # 关于页
│   ├── source/
│   │   ├── css/
│   │   │   ├── style.css        # 主样式表（约 1587 行）
│   │   │   └── personal.css     # 文章排版覆写（阅读体验优化）
│   │   ├── js/
│   │   │   └── main.js          # 客户端脚本（目录、返回顶部、模态框、平滑滚动）
│   │   └── images/
│   │       ├── avatar.svg
│   │       └── profile.jpg      # 头像（100×100px 圆形）
│   └── scripts/                 # Hexo 辅助脚本目录（当前为空）
│
├── public/                      # 生成的静态站点（gitignore，由 CI 构建）
└── docs/                        # 项目文档
    ├── project.md               # 本文档
    └── design.md                # 设计风格文档
```

---

## 页面路由

| 路由 | 布局 | 功能 |
|------|--------|------|
| `/` | `index` | 首页：头像、站点名、导航、最近文章时间轴 |
| `/archives/` | `archive` | 博客归档：全部文章按年份分组的时间轴 |
| `/YYYY/MM/DD/slug/` | `post` | 文章详情：正文、右侧边栏（目录+导航）、评论 |
| `/categories/` | `category` | 分类索引：分类药丸 + 按分类分组的文章列表 |
| `/categories/<name>/` | — | 特定分类的文章列表（Hexo 自动生成） |
| `/tags/` | `tag` | 标签索引：标签药丸 + 按标签分组的文章列表 |
| `/tags/<name>/` | — | 特定标签的文章列表（Hexo 自动生成） |
| `/about/` | `page` | 关于页：个人信息、联系方式、位置 |

---

## 核心设计决策

### 1. 盒子导航系统（Toolbox）

「盒子」是 BlueSun 设计的标志性导航组件：一个始终显示为 40px 圆形按钮的导航菜单。hover 时水平（非文章页）或垂直（文章页）展开，展示导航项。

**两种模式：**
- **非文章页**（Blog、分类、标签、关于）：盒子位于页面头部左侧，hover 时水平向右展开为横向菜单栏，入口文字从「盒子」切换为「主页」
- **文章页**：盒子位于右侧边栏，hover 时垂直向下展开为纵向菜单

### 2. 脊柱线时间轴（Spine Timeline）

所有列表页使用 4px 灰色的左边框线（`#f0f0f0`）作为视觉脊柱，年份/分类标题用彩色 10px 圆点串联，文章条目用灰色 8px 圆点串联。这是从 BlueSun 复刻的核心视觉特征。

### 3. 文章页双栏布局

文章页采用绝对定位的右侧边栏（`post-sidebar`），包含盒子导航和 TOC 目录。边栏通过 JavaScript 动态测量 `.article-content` 位置，与正文内容（而非标题）对齐。TOC 滚动到文章内容顶部上方时变为固定定位（`position: fixed`），始终可见。

### 4. 标签系统

支持 Obsidian 风格的 frontmatter 标签（如 `tags: ["#黑格尔"]`），所有模板在渲染时通过 `.replace(/^#/, '')` 去除 `#` 前缀。

### 5. Giscus 评论

文章页底部集成 Giscus——一个基于 GitHub Discussions 的无追踪评论系统。配置通过主题 `_config.yml` 中的 `giscus` 字段传递。

### 6. CMS 工作流

文章直接通过 Obsidian 笔记系统编写（Markdown + YAML frontmatter），放置在 `source/_posts/` 目录下。Git push → GitHub Actions 自动构建并部署到 `gh-pages` 分支。

---

## 常用命令

```bash
npx hexo server          # 本地开发服务器（http://localhost:4000）
npx hexo generate        # 生成静态文件到 public/
npx hexo clean           # 清空 public/
npx hexo new "文章标题"  # 基于 scaffolds/post.md 创建新文章
npm run build            # hexo generate（CI 中使用的别名）
```

---

## 部署流程

1. 在 Obsidian 中编写 Markdown 文章，添加 frontmatter
2. 文件放入 `source/_posts/`
3. `git commit && git push origin main`
4. GitHub Actions 触发：
   - 检出代码
   - `npm ci`
   - `npx hexo generate`
   - 将 `public/` 发布到 `gh-pages` 分支
5. GitHub Pages 从 `gh-pages` 分支提供服务（`holycandle.github.io`）

---

## 已知注意事项

- 文章 frontmatter 中的 `author` 字段会覆盖站点默认作者（`page.author || config.author`）
- 标签名中的 `#` 前缀在所有 EJS 模板中统一去除
- 移动端（<768px）：侧边栏隐藏，盒子切换为底部固定按钮（触发模态框），脊柱线移除
- 平板端（768px–1024px）：文章页侧边栏隐藏
- TOC 目录仅在文章包含标题时显示（通过 `toc(page.content)` 检测）
- `personal.css` 覆写了文章排版样式（h2 下划线、引用块左边框颜色、表格样式等），在 `style.css` 之后加载

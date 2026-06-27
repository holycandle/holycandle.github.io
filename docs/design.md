# Horizon & Jasmine — 设计风格文档

## 设计理念

Jasmine 主题的设计复刻自 [BlueSun](https://huang-jerryc.com)（Jerry Huang 的个人博客），追求**安静、内敛、书卷气**的阅读氛围。整体风格可以概括为：

> **淡雅的学术笔记风** — 像一本摊开的 moleskine，脊柱线贯穿始终，彩色圆点标记时间节点，胶囊药丸优雅地组织分类与标签。

核心设计目标：
- **阅读优先**：LXGW WenKai 正文 + 舒适的 1.85 行高 + 两端对齐
- **安静但不无聊**：脊柱线上的彩色圆点是唯一的视觉调味剂
- **导航不争抢注意力**：盒子（Toolbox）始终是 40px 的灰色圆形，hover 才展示全貌
- **中文友好**：霞鹜文楷（LXGW WenKai）作为正文字体，在中文阅读体验上远超系统字体

---

## 色彩系统

```
┌─────────────────────────────────────────────────────┐
│  主色调 (Accent)                                      │
│  #1abc9c  ████████████████████████████  青色         │
│  #169d82  ████████████████████████████  悬停加深      │
│                                                      │
│  文字色                                               │
│  #000     ████████████████████████████  标题/强调     │
│  #444     ████████████████████████████  正文          │
│  #888     ████████████████████████████  次要文字      │
│  #999     ████████████████████████████  辅助/元信息   │
│  #aaa     ████████████████████████████  日期          │
│  #ccc     ████████████████████████████  分隔符        │
│  #d0d0d0  ████████████████████████████  面包屑        │
│                                                      │
│  背景色                                               │
│  #fff     ████████████████████████████  页面背景      │
│  #fafafa  ████████████████████████████  引用块背景    │
│  #f7f7f7  ████████████████████████████  代码块背景    │
│  #f6f6f6  ████████████████████████████  药丸默认背景  │
│  #f0f0f0  ████████████████████████████  按钮/脊柱线   │
│  #dfdfdf  ████████████████████████████  悬停背景      │
│                                                      │
│  时间轴圆点配色 (Timeline Dots)                        │
│  #1abc9c  ████████████████████████████  青色 (0)      │
│  #3498db  ████████████████████████████  蓝色 (1)      │
│  #9b59b6  ████████████████████████████  紫色 (2)      │
│  #e67e22  ████████████████████████████  橙色 (3)      │
│  #e74c3c  ████████████████████████████  红色 (4)      │
│                                                      │
│  表格配色 (personal.css)                               │
│  #f4fbf8  ████████████████████████████  表头渐变上    │
│  #eef8f5  ████████████████████████████  表头渐变下    │
│  #2f4f46  ████████████████████████████  表头文字      │
│  #edf2f0  ████████████████████████████  单元格边框    │
│  #e3eee9  ████████████████████████████  表格外框      │
└─────────────────────────────────────────────────────┘
```

### 用色原则

1. **#1abc9c（青色）是唯一的强调色**：用于链接、悬停态、分类链接、特殊圆点。不引入第二强调色。
2. **灰色是主基调**：从背景到文字，9 个灰度层级构成安静的氛围
3. **彩色仅限于时间轴圆点**：5 种颜色轮换，用于区分不同年份/分组，是页面唯一的色彩点缀
4. **悬停交互统一**：几乎所有 hover 都变为 `#1abc9c`（链接）或 `#dfdfdf`（按钮背景）

---

## 字体系统

### 字体堆栈

```css
/* 正文/UI */
font-family: "LXGW WenKai", "Source Serif 4", "Noto Serif SC",
             "Songti SC", "STSong", serif;

/* 英文装饰（年份、计数） */
font-family: "Calligraffitti", cursive;

/* 代码 */
font-family: "SF Mono", Menlo, Monaco, "Courier New", monospace;

/* 文章摘要（无衬线回退） */
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Helvetica Neue", sans-serif;
```

### 字体来源

| 字体 | 来源 | 用途 |
|------|--------|--------|
| LXGW WenKai（霞鹜文楷） | jsDelivr CDN (`lxgw-wenkai-webfont@1.7.0`) | 全局正文字体 |
| Calligraffitti | Google Fonts | 年份标签、计数数字的装饰手写体 |
| SF Mono / Menlo | 系统字体 | 代码块、行内代码 |

### 字体大小与层级

```
网站标题 (首页 Hero)         26px / bold
标语 (首页 Hero)              21px / 800
文章标题                      2rem ≈ 32px
文章 h2                       1.45em
文章 h3                       1.2em
文章正文                      16px / line-height: 1.85
文章元信息（日期/作者/分类）   13px
文章标签药丸                  12px
时间轴文章标题                18px / 600
时间轴年份                    20px（Calligraffitti）
文章摘要                      13px（无衬线）
导航项                        13px ~ 14px
面包屑                        13px / 16px
```

---

## 布局系统

### 页面宽度

| 页面类型 | 桌面宽度 | 说明 |
|----------|--------|------|
| 首页 Hero | 720px | 居中 |
| 文章页 | 800px | 居中，右侧 180px 侧边栏 |
| 归档/分类/标签页 | 720px | 居中，带 4px 脊柱线 |
| 关于页 | 500px | 居中，带 4px 脊柱线 |
| 移动端 | `calc(100% - 32px)` | 16px 内边距 |

### 侧边栏定位（文章页）

```
视口中心 + 420px → 侧边栏左边缘
                    宽度: 180px
                    定位: absolute（脱离文档流，不影响文章宽度）
                    对齐: JS 动态设置 top = .article-content 的 Y 坐标
```

侧边栏内部垂直布局：
```
┌──────────────┐
│  盒子导航     │  ← 纵向展开
│  (post-toolbox)│
├──────────────┤
│              │
│  文章目录     │  ← 滚动超过阈值时 fixed
│  (toc-article)│
│              │
└──────────────┘
```

### 脊柱线 (Spine Line)

脊柱线是贯穿归档、分类、标签、关于等页面的 4px 灰色竖线（`border-left: 4px solid #f0f0f0`），圆点从脊柱线向左偏移居中。

```
    ●  ← 彩色 10px 圆点 (年份/分组标题)
    │
    ○  ← 灰色 8px 圆点 (文章条目)
    │
    ○
    │
    ●  ← 下一个年份
    │
    ○
```

圆点通过 `::before` 伪元素实现：
```css
.item-year::before {
  position: absolute;
  left: -2px;          /* 对齐 content 左边框 */
  width: 10px; height: 10px;
  margin-left: -5px;   /* 圆点水平居中于脊柱线 */
  border-radius: 50%;
}
```

---

## 组件库

### 1. 工具箱导航 (Toolbox)

**设计意图**：将导航缩为 40px 的圆形按钮，减少视觉噪音。仅在需要时展开。

**HTML 结构**：
```
.toolbox
  a.toolbox-entry          ← 入口按钮（40px 圆形）
    span.toolbox-entry-text     ← 默认显示「盒子」
    i.icon-angle-down           ← ▾ 符号 (文章页)
    span.icon-home-text         ← SVG 房屋图标 (非文章页)
    span.toolbox-entry-home-text← 显示「主页」(hover 时)
  ul.list-toolbox           ← 导航项列表（默认隐藏，hover 展开）
    li.item-toolbox
      a.CIRCLE
```

**两种模式**：

| 特征 | 非文章页 | 文章页 |
|------|-----------|----------|
| 定位 | `.page-header` 内，`margin-left: -18px` 连接脊柱 | `.post-sidebar` 内，绝对定位右侧 |
| 展开方向 | 水平向右（`left: 46px; white-space: nowrap`） | 垂直向下（`display: block`） |
| 默认入口文字 | 「盒子」 | 「盒子」 |
| 展开时入口文字 | 「主页」→「主页」（保持主页） | 「盒子」+ ▾（保持盒子） |
| 展开触发 | hover 整个 `.toolbox` | hover 整个 `.post-toolbox` |

**悬停行为（非文章页）**：
```
默认状态:    [盒子]           ← 灰色圆形，显示"盒子"
悬浮入口:    [主页]           ← 只显示"主页"文字
            [Blog][分类][标签][关于]  ← 水平展开
```

**动画**：展开时，导航项逐个阶梯渐入（`toolboxFadeIn`，每项延迟 0.08s）。仅对前 10 项定义延迟。

**移动端**：桌面端盒子隐藏，改为底部固定圆形按钮 (`toolbox-mobile`)，点击弹出底部模态框。

### 2. 文章元信息区 (Article Meta)

位于文章标题下方，居中排列，两行结构：

```
行 1:  📅 2026.06.26  ·  ✍ Horizon  ·  📂 生活
行 2:  [黑格尔] [《逻辑学》] [哲学]     ← 标签药丸
```

- 第一行：图标（📅 ✍ 📂）+ 文字 + `·` 分隔符
- 第二行：圆角药丸（`border-radius: 14px`），悬停变青
- 分类链接指向 `/categories/<name>/`
- 标签链接指向 `/tags/<name>/`
- 每篇文章可用 `author` frontmatter 覆盖站点默认作者

### 3. 文章目录 (TOC)

- 数据源：Hexo `toc(page.content)` 辅助函数
- 渲染位置：文章页右侧边栏，盒子下方
- 定位：跟随 `.article-content` 顶部对齐，滚动超过阈值后固定 (`position: fixed; top: 20px`)
- 活跃项高亮：`scroll-spy` 监听各标题，当前可见标题的 TOC 链接加 `font-weight: bold` + `color: #111`
- 平板/移动端（<1024px）：隐藏

### 4. 分类 / 标签药丸

位于分类页和标签页顶部的横向药丸列表：

```
    ●                              ← 左侧小圆形按钮 (标签/分类标题)
    [三省吾身(12)] [哲学(5)] [诗歌(3)]  ← 右侧药丸列表
```

- 药丸样式：`border-radius: 15px; padding: 0 12px; height: 30px; background: #f6f6f6`
- 计数用 Calligraffitti 手写体
- 悬停变深灰（`#333`）

### 5. 时间轴文章列表 (Timeline)

三种变体：

**首页 + 归档页 (`list-post-rich`)**：
```
● 2026（Calligraffitti 年份）
  ○  06-27  东方不败为什么"不败"  [三国] [哲学]
             备存疑，最近总有奇思妙想...（摘要）
```

**分类/标签页 (`item-post`)**：
```
● 哲学（彩色圆点）
  ○  06-27  东方不败为什么"不败"
```

- 文章条目间用 `#f3f3f3` 分隔线
- 摘要前用虚线分隔（`border-top: 1px dashed #e8e8e8`）
- 摘要文字使用系统无衬线字体

### 6. 上一页 / 下一页

文章底部的导航按钮：
- 两个 36px 圆形按钮，一左一右（`◀` / `▶`）
- 边框 `1px solid #dfdfdf`，颜色 `#ccc`
- 悬停变深
- 无下一篇时隐藏

### 7. 返回顶部

- 右下角固定 40px 圆形按钮
- 页面滚动 >300px 时显示
- 平滑滚动回顶部
- 移动端隐藏（`display: none !important`）

### 8. 模态导航框（移动端）

- 底部弹出式导航：半透明遮罩 + 底部白色面板
- 导航项水平排列在面板内
- 关闭方式：点击遮罩 / 点击「关闭」按钮
- 动画：`translate3d` 上下滑动

---

## 响应式断点

| 断点 | 目标 | 行为 |
|--------|------|--------|
| < 768px | 手机 | 脊柱线移除，侧边栏隐藏，移动端盒子按钮显示，文章宽度 100% |
| 768px–1023px | 平板 | 文章页侧边栏隐藏 |
| 768px–1024px | 平板（文章页） | 文章宽度 95% |
| ≥ 1024px | 桌面 | 完整布局：脊柱线、侧边栏、TOC 全部可见 |

---

## 交互模式

| 交互 | 实现 | 说明 |
|----------|------------|------|
| 盒子展开 | CSS `:hover` | 纯 CSS，无需 JS |
| 盒子展开动画 | `@keyframes toolboxFadeIn` + `animation-delay` | 每项延迟 0.08s 阶梯式渐入 |
| TOC 固定 | `position: sticky` → JS 切换 `.fixed` | 滚动到阈值时固定 |
| TOC 活跃追踪 | `getBoundingClientRect()` scroll-spy | 比 `offsetTop` 更准确（考虑绝对定位父元素） |
| 侧边栏对齐 | JS 读取 `.article-content` 位置 | DOMContentLoaded 后计算一次 |
| 返回顶部 | 平滑滚动 | `scrollTo({ behavior: 'smooth' })` |
| 锚点平滑滚动 | 事件委托 | 拦截 `a[href^="#"]` 点击 |
| 移动端模态框 | 类名切换 | `show-dialog` / `hide-dialog` + CSS transition |
| 文章链接下划线 | `text-decoration-color` 半透明 | 悬停时加重（`rgba(26,188,156,0.35)` → `0.8`） |

---

## CSS 架构

```
style.css (~1587 lines)
├── Reset & Base            (L1–95)
├── Homepage Hero           (L102–170)
├── Recent Posts Timeline   (L171–218)
├── Year Titles             (L219–258)
├── Rich Post Items         (L259–369)
├── Toolbox System          (L371–647)     ← 最复杂区块
│   ├── Post Sidebar        (L382–477)
│   ├── Base Toolbox        (L479–622)
│   └── Mobile Toolbox      (L624–647)
├── TOC                     (L648–700)
├── Article Header          (L701–806)
├── Article Content         (L807–965)
├── Back to Top             (L966–1001)
├── Prev/Next Navigation    (L1002–1044)
├── Modal                   (L1045–1147)
├── Giscus Comments         (L1148–1168)
├── Archive Page Header     (L1169–1260)
├── Breadcrumb              (L1252–1279)
├── Archive Timeline        (L1281–1310)
├── About Page              (L1311–1372)
├── Category/Tag Box        (L1373–1436)
├── Category/Tag Content    (L1437–1486)
└── Simple Post List        (L1487–1586)

personal.css (~170 lines) — 覆写
├── Article Images
├── Headings (h2 下划线)
├── Body Text (两端对齐, hyphens)
├── Blockquote (青色左边框)
├── Inline & Block Code
├── Links (下划线)
└── Tables (绿色渐变表头 + 圆角)
```

**CSS 特色技巧**：
- `.page-header::before` 白色伪元素遮盖脊柱线，使脊柱从页面内容区才开始
- `.post-sidebar` 使用绝对定位脱离文档流，避免盒子展开时推动页面内容
- 工具箱按钮的三种文字状态（盒子/图标/主页）通过 `display: none/block` 切换，互斥显示

---

## 设计参考

本主题基于 BlueSun (huang-jerryc.com) 设计，主要保留：
1. 脊柱线 + 彩色圆点时间轴
2. 40px 圆形盒子导航
3. 分类/标签药丸样式
4. LXGW WenKai + Calligraffitti 字体组合
5. #1abc9c 青色调
6. 文章页右侧 TOC 边栏

与原版的主要差异：
- 底层框架从 Ghost 改为 Hexo（EJS 模板语法）
- 文章页元信息两行布局（增加 emoji 图标）
- 盒子 hover 展开时保持「主页」文字（原版切换为房屋图标）
- 新增 Giscus 评论集成
- 标签名 `#` 前缀兼容（Obsidian 写作习惯）

# 开发日志

## 2026-07-18: CI 部署日期早一天（已修复）

**根因**: Hexo 的 `post.js` schema 在用户 `_config.yml` 合并前就用默认值创建。`SchemaTypeMoment.cast()` 中的 `options.timezone` 始终为空字符串（默认值），`.tz()` 从未执行。CI (UTC) 上 `moment()` 按本机时区格式化，被 `timezone()` 调整过的 Date 偏移 -1 天。

**修复**: [themes/jasmine/scripts/init-timezone.js](../../themes/jasmine/scripts/init-timezone.js) — monkey-patch `SchemaTypeMoment.prototype.cast`，在 moment 对象上手动调用 `.tz(hexo.config.timezone)`。

**验证**: `TZ=UTC npx hexo generate`（模拟 CI）→ 所有 8 篇文章日期与 URL 路径一致。

---

## 2026-07-18: TOC 折叠/展开嵌套内容被裁剪

**状态**: 暂缓（已知 bug）

**现象**:
文章目录（TOC）中，折叠再展开某个有子项的条目（如"配置 Nginx"），只有第一个子项（如"A.静态资源"）能显示，后续同级子项（如"B.配置规则"）以及父级后续兄弟条目（如"（3）启动"）被吞掉无法显示。

**已知信息**:
- 树结构构建经多次验证正确（`buildOl` 递归、`stack` 弹出逻辑）
- 折叠动画使用 `max-height` 过渡方案：CSS `.collapsed { max-height: 0 !important }` + `overflow: hidden`
- 已排除：根 `ol` 不必要的 `overflow: hidden`（已通过 `classList.remove('toc-children')` 移除）
- 已尝试：折叠时保存 `dataset.expandedH`、展开时从保存值恢复、`updateAncestorHeights` 向上更新祖先 `max-height`、测量前强制 `offsetHeight` 回流
- 未生效，根因待查

**怀疑方向**:
1. `scrollHeight` 在多层嵌套 + `overflow: hidden` + `max-height` 过渡场景下，浏览器返回的值可能与预期不符
2. CSS `transition: max-height 0.25s` 在 `!important` 移除/添加时的过渡行为与 JS 同步更新之间的竞态
3. 可能需要改用 JS `requestAnimationFrame` 驱动的高度动画，放弃纯 CSS transition 方案

**相关文件**:
- `themes/jasmine/layout/post.ejs` — TOC JS 逻辑（~130行，56-206行）
- `themes/jasmine/source/css/style.css` — TOC 相关 CSS（652-752行）

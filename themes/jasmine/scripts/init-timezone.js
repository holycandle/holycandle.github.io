/**
 * 修复 CI (UTC) 环境下文章日期早一天的 Hexo bug。
 *
 * 根因：Hexo post schema 在用户配置合并前用默认值创建，
 * SchemaTypeMoment.cast() 中的 options.timezone 永远为空字符串，
 * 导致 .tz() 从未执行。
 *
 * 本脚本 monkey-patch SchemaTypeMoment.prototype.cast，
 * 在 moment 对象上手动调用 .tz() 应用配置时区。
 */
hexo.on('ready', () => {
  const tz = hexo.config.timezone;
  if (!tz) return;

  // 清除 require 缓存，确保拿到 Hexo 正在使用的同一个模块
  const modPath = require.resolve('hexo/dist/models/types/moment');
  const SchemaTypeMoment = require(modPath);
  const origCast = SchemaTypeMoment.prototype.cast;

  SchemaTypeMoment.prototype.cast = function (value, data) {
    const result = origCast.call(this, value, data);
    if (result && tz && !result.tz()) {
      return result.tz(tz);
    }
    return result;
  };
});

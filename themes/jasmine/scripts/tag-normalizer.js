/**
 * Strip leading '#' from tag names before Hexo generates pages.
 * This way Obsidian-style tags ("#黑格尔") and plain tags ("黑格尔")
 * are treated as the same tag across all posts.
 */
hexo.extend.filter.register('before_generate', function () {
  this.model('Post').forEach(function (post) {
    if (post.tags && post.tags.data) {
      post.tags.data.forEach(function (tag) {
        tag.name = tag.name.replace(/^#/, '');
      });
    }
  });
});

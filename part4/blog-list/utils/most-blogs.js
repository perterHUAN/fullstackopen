function mostBlogs(blogs) {
  const m = new Map();
  let mostBlogsCount = 0;
  let mostBlogsAuthor = null;
  for (const blog of blogs) {
    m.set(blog.author, m.has(blog.author) ? m.get(blog.author) + 1 : 1);

    const cnt = m.get(blog.author);
    if (cnt > mostBlogsCount) {
      mostBlogsCount = cnt;
      mostBlogsAuthor = blog.author;
    }
  }
  return mostBlogsAuthor
    ? { author: mostBlogsAuthor, blogs: mostBlogsCount }
    : null;
}

module.exports = mostBlogs;

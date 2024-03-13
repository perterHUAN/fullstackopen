function favoriteBlog(blogs) {
  const result = blogs.reduce((pre, cur) =>
    cur.likes > pre.likes ? cur : pre
  );

  return { title: result.title, author: result.author, likes: result.likes };
}

module.exports = favoriteBlog;

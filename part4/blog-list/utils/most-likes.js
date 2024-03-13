function mostLikes(blogs) {
  const m = new Map();
  let mostLikesCount = 0;
  let mostLikesAuthor = null;
  for (const blog of blogs) {
    m.set(
      blog.author,
      m.has(blog.author) ? m.get(blog.author) + blog.likes : blog.likes
    );
    const cnt = m.get(blog.author);
    if (cnt > mostLikesCount) {
      mostLikesCount = cnt;
      mostLikesAuthor = blog.author;
    }
  }
  return mostLikesAuthor
    ? { author: mostLikesAuthor, likes: mostLikesCount }
    : null;
}

module.exports = mostLikes;

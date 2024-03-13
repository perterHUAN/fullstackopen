const totalLikes = (blogs) => {
  return blogs.reduce((pre, cur) => pre + cur.likes, 0);
};

module.exports = totalLikes;

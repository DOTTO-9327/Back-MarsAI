const getPagination = (items, page, limit) => {
  return {
    success: true,
    data: items,
    currentPage: page,
    limit: limit,
    count: items.length,
  };
};

module.exports = { getPagination };

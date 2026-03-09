/**
 * Formate la réponse de pagination
 */
const getPagination = (data, page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  return {
    success: true,
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      from,
      to
    }
  };
};

module.exports = { getPagination };
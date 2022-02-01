module.exports.pagination = (response, url, page, limit, totalPages) => {
    const linkHeader = {
      first: `${url}?limit=${limit}&page=1`,
      prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page - 1}` : `${url}?limit=${limit}&page=${page}`,
      next: response.hasNextPage ? `${url}?limit=${limit}&page=${page + 1}` : `${url}?limit=${limit}&page=${page}`,
      last: `${url}?limit=${limit}&page=${totalPages}`,
    };
  
    return linkHeader;
  };


module.exports.isValidEmail = (email) => (new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)).test(email);
module.exports.isValidPassword = (password) => password.length >= 3;

//module.exports.isValidPassword = (password) => (new RegExp(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/).test(password));
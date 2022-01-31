module.exports.getLink=(res, url, page, limit, total) => {
    const link = { 
        first: page===1 ? '' : `${url}?limit=${limit}&page=1`,
        prev: res.hasPrevPage ? `${url}?limit=${limit}&page=${page - 1}` : '',
        next: res.hasNextPage ? `${url}?limit=${limit}&page=${page + 1}` : '',
        last: page===total ? '' : `${url}?limit=${limit}&page=${total}`,
    }
    return link
}

module.exports.isValidEmail = (email) => (new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)).test(email);
module.exports.isValidPassword = (password) => (new RegExp(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/).test(password));
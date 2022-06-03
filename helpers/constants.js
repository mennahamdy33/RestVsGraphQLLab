const hateos = {
  
    getArticleHateos: (scheme, hostname) => ({
        'self_url': `${scheme}${hostname}/articles`,
        'article_url':  `${scheme}${hostname}/articles/{article_id}`,
    }),
    getUsersHateos: (scheme, hostname) => ({
        'self_url': `${scheme}${hostname}/users`,
        'user_url':  `${scheme}${hostname}/users/{user_id}`,
    })
    
}

module.exports = hateos
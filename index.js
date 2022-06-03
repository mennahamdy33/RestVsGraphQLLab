const express = require('express');
require('./helpers/dbConnection');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middlewares');
const { User, Article } = require('./models');
const { getUsersHateos,getArticleHateos } = require('./helpers/constants');


const server = express();

server.use(bodyParser.json());

const userRouter = express.Router();
const articlesRouter = express.Router();


// Articles router
articlesRouter.post('/', async (req, res, next) => {
    const {author, title, body,comments,date} = req.body;



    try {
        const { _id: articleId } = await Article.create(
            { author, title, body,date,comments }
        );
        console.log(articleId)
        

    } catch (err) {
        return next(err);
    }
    res.status(204).end();
});

articlesRouter.get('/', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const articles = await Article.find({});
    res.status(200).send(articles);
    // const articleHateos = getArticleHateos('https://', 'localhost')
    // res.status(200).send(articleHateos);
});

articlesRouter.get('/:article_id', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const article = await Article.findById(req.params.article_id);
    res.status(201)
        .send(article);
}); 

articlesRouter.get('/:article_id/comments', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const article = await Article.findById(req.params.article_id);
    res.status(201)
        .send(article.comments);
}); 

articlesRouter.get('/:article_id/author', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const article = await Article.findById(req.params.article_id);
    const author = await User.findById(article.author);
    res.status(201)
        .send(author);
}); 

articlesRouter.param('article_id', async (req, res, next, articleId) => {
    console.log('articleID: ', articleId);
    try {
        const article = await Article.findById(articleId);
        if (!article) throw new Error('notfound');
        req.article = article;
    } catch (err) {
        return next(err);
    }
    next();
});


articlesRouter.patch('/:article_id' ,async (req, res,next)=> {
    const { id } = req.params;
    try {
        await Article.findByIdAndUpdate(id, {$set: req.body});
        // res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
    res.status(204).end();
});



articlesRouter.delete("/:article_id", async (req, res, next) => {
    const { id } = req.params;
 
    try {
      await Article.findByIdAndDelete(id);
    //   res.send({ message: "successfully deleted" });
  
    } catch (error) {
      next(error);
    }
    res.status(204).end();
  });
// User Router

userRouter.get('/', async (req, res, next) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const users = await User.find({});
    // const userHateos = getUsersHateos('https://', 'localhost')
    // res.status(200).send(userHateos);
    res.status(200).send(users);
});

userRouter.get('/:user_id', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const user = await User.findById(req.params.user_id);
    res.status(201)
        .send(user);
}); 

userRouter.post('/', async (req, res, next) => {
    const {firstname, lastname, email, dob, isSuspended} = req.body;

    try {
        await User.create({ firstname, lastname, email, dob, isSuspended });
    } catch (err) {
        next(err);
    }
    res.status(204);
    res.send();
});

userRouter.get('/:user_id/articles', async (req, res, next) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const articles = await Article.find({'author':req.params.user_id});
    res.status(200).send(articles);
});
userRouter.param('user_id', async (req, res, next, userId) => {
    console.log('userID: ', userId);
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('notfound');
        req.user = user;
    } catch (err) {
        return next(err);
    }
    next();
});


userRouter.patch('/:user_id' ,async (req, res,next)=> {
    const { id } = req.params;
    try {
        await User.findByIdAndUpdate(id, {$set: req.body});
        // res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
    res.status(204).end();
});


userRouter.patch('/:user_id/suspend' ,async (req, res,next)=> {
    const { id } = req.params;
    try {
        await User.findByIdAndUpdate(id, {$set: {'isSuspended':true}});
        // res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
    res.status(204).end();
});

userRouter.patch('/:user_id/unsuspend' ,async (req, res,next)=> {
    const { id } = req.params;
    try {
        await User.findByIdAndUpdate(id, {$set: {'isSuspended':false}});
        // res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
    res.status(204).end();
});

userRouter.delete("/:user_id", async (req, res, next) => {
    const { id } = req.params;
 
    try {
      await User.findByIdAndDelete(id);
      res.send({ message: "successfully deleted" });    
  
    } catch (error) {
      next(error);
    }
    res.status(204).end();
  });
// userRouter.use('/:user_id/blogs', blogsRouter);
server.use('/users', userRouter);
server.use('/articles', articlesRouter);


server.use(errorHandler);

server.listen(3000, 'localhost', () => {
    console.log(`server is listening on: 3000`);
});

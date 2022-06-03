const { ApolloServer, gql } = require('apollo-server');
require('../helpers/dbConnection');
const {  Article } = require('../models');

const schema = `
type User {
    _id: ID!
    firstname: String!
    lastname: String!
    email: String
    dob: String
    isSuspended: Boolean
}
type Comment {
    _id: ID!
    content: String
    user:User
    date: String
}

type Article {
    _id: ID!
    title: String!
    body: String
    date: String
    author: [User]!
    comments: [Comment]
    }


  
    type Query {
        allArticles (last: Int): [Article]
        
    }

    type Mutation {
        deleteArticle (id: String): String
    createArticle( title: String,
    body:String,
    date:String,
    author:String,
    
    ): [Article]
        
     }
`

const typeDefs = gql(schema);

const resolvers = {
    Query: {
        allArticles: async(_, { last }) => {
         const length =   await  Article.count();
       const articles=await     Article.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author"
                    }
                },
               
            ]).skip(last?length-last:0);
           
            return articles;
            
        },
      
    },
    Mutation: {
        deleteArticle:async (_, { id }) => {
            await Article.findByIdAndDelete(id);
            return "done"
            
        },
        createArticle: async (_, {   title,
            body,
            author,
            date,
           
        }) => {

         
            
            try {
                const d = new Date(date);
                console.log(d, typeof d)
                const { _id: articleId } = await Article.create(
                    { author,
                         title,
                          body,
                          date:d,
                          comments:[]}
                );
                console.log(articleId)
        
        
            } catch (err) {
                console.log(err);
            }
         

        }
    }
}


const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4001).then(({ url }) => { console.log('url: ', url) });



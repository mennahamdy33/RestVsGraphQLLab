const { ApolloServer, gql } = require('apollo-server');



let users = [
    { id: 1, firstname: 'ahmed',lastname: 'ahmed',
     email:'sadasd',isSuspended:true,dob:'11-2-2010' },
     { id: 2, firstname: 'mohamed',lastname: 'ahmed',
     email:'sadasd',isSuspended:true,dob:'11-2-2010' },
     { id: 3, firstname: 'mostafa',lastname: 'ahmed',
     email:'sadasd',isSuspended:true,dob:'11-2-2010' }
  
];
let comments = [
    {  content: "this is a comment",
        user:users[1],
        date: '12-2-2010' },
   
  
];
let articles = [
    { id: 1, title: 'article1',
    body:'sadasd fdsf edad',date:'11-2-2010',
    author:users[0],comments:[comments[0]] },
    { id: 2, title: 'article2',
    body:'sadasd fdsf edad',date:'11-2-2010',
    author:users[0],comments:[comments[0]] },
    { id: 3, title: 'article3',
    body:'sadasd fdsf edad',date:'11-2-2010',
    author:users[0],comments:[comments[0]] }
   
];
const schema = `
type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String
    dob: String
    isSuspended: Boolean
}
type Comment {
    content: String
    user:User
    date: String
}

type Article {
    id: ID!
    title: String!
    body: String
    date: String
  
    author: User!
    comments: [Comment]
    }


  
    type Query {
        allArticles (last: Int): [Article]
        
    }

    type Mutation {
        deleteArticle (id: Int): [Article]
    createArticle(id: Int, title: String,
    body:String,
    author:Int): [Article]
        
     }
`

const typeDefs = gql(schema);

const resolvers = {
    Query: {
        allArticles: (_, { last }) => {
           
            if (!last) return articles;
            if (last) return articles.slice(articles.length-last);
        },
      
    },
    Mutation: {
        deleteArticle: (_, { id }) => {
            articles = articles.filter((article) => article.id !== id);
            return articles;
        },
        createArticle: (_, { id,  title,
            body,
            author }) => {
            articles.push({id,
                title,
                body,
                author: users.filter((user) => user.id === author)[0],
                });
            return articles;
            
        }
    }
}


const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4001).then(({ url }) => { console.log('url: ', url) });



import { ApolloServer } from 'apollo-server-micro';
import mysql from 'serverless-mysql'
import { db } from '../../backend/db';
import { schema } from '../../backend/schema'

const apolloServer = new ApolloServer({ schema, context: { db } });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });

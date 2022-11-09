// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PostStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE"
};

const { Post, Comment, User, PostEditor } = initSchema(schema);

export {
  Post,
  Comment,
  User,
  PostEditor,
  PostStatus
};
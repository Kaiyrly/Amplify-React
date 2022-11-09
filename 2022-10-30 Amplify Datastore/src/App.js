import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Amplify, DataStore, Hub, conHub} from "aws-amplify";
import { Predicates, SortDirection, syncExpression, DISCARD  } from "@aws-amplify/datastore"
import { Post, PostStatus, Comment } from "./models";

import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

//Use next two lines only if syncing with the cloud
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

DataStore.configure({
  conflictHandler: async (data) => {
    // Example conflict handler

    const modelConstructor = data.modelConstructor;
    if (modelConstructor === Post) {
      console.log('this is custom conflict resolution function');
      const remoteModel = data.remoteModel;
      const localModel = data.localModel;
      const newModel = modelConstructor.copyOf(remoteModel, (d) => {
        d.title = localModel.title;
      });
      return newModel;
    }

    return DISCARD;
  },
  maxRecordsToSync: 30000,
  fullSyncInterval: 60, // minutes
});

let rating = 5;

// DataStore.configure({
//   syncExpressions: [
//     syncExpression(Post, post => post.rating('gte', rating))
//   ]
// });

async function getRandomPost(){
  const post = await DataStore.query(Post, Predicates.ALL, {
    page: 0,
    limit: 1
  });
  return Promise.resolve(post[0]);
}

function createPost() {
  DataStore.save(
    new Post({
      title: `New title ${Date.now()}`,
      rating: (function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      })(1, 10),
      status: PostStatus.ACTIVE,
    })
  );
}

function deleteAllPosts() {
  DataStore.delete(Post, Predicates.ALL);
}

async function createComment(){
  const post = await getRandomPost();
  if(post == null){
    console.log("There are no posts!");
  }
  else{
    DataStore.save(
      new Comment({
        content: `New comment ${post.id}`,
        postID: post.id
      })
    )
  }
  console.log(post);


}

function deleteAllComments() {
  DataStore.delete(Comment, Predicates.ALL);
}

async function getPosts(num) {
  const posts = await DataStore.query(Post, Predicates.ALL, {
    sort: s => s.rating(SortDirection.ASCENDING).title(SortDirection.DESCENDING)
  });

  console.log(posts);
}

async function getComments() {
  const posts = await DataStore.query(Comment, Predicates.ALL);

  console.log(posts);
}

async function syncData(){
  // rating = 6;
  await DataStore.clear();
  await DataStore.start();
}

async function decrementRating(){
  rating = 4;
  await DataStore.stop();
  await DataStore.start();
}

async function testConflict(){
  const post = await getRandomPost();
  if(post == null){
    console.log('No posts were found');
  }
  else{
    DataStore.save(
      Post.copyOf(post, updated => {
        updated.title = "Conflicted title1"
        updated._version = 1
      })
    );
    DataStore.save(
      Post.copyOf(post, updated => {
        updated.title = "Conflicted title2"
        updated._version = 1
      })
    );
  }
}

function App({ signOut, user}) {

  DataStore.observeQuery(
    Post,
    p => p.title("beginsWith", "post").rating("gt", 10),
    {
      sort: s => s.rating(SortDirection.ASCENDING)
    }
  ).subscribe(snapshot => {
    const { items, isSynced } = snapshot;
    console.log(`[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
  });

  Hub.listen('auth', async (data) => {
    console.log('Someone is authorizing');
    if (data.payload.event === 'signOut') {
      console.log('User is signing out');
      // await DataStore.clear();
    }
  });
  const listener = Hub.listen('datastore', async hubData => {
    const  { event, data } = hubData.payload;
    if (event === 'networkStatus') {
      console.log(`User has a network connection: ${data.active}`)
    }
  })
  
  // Remove listener
  listener();

  // conHub.listen("datastore", async hubData => {
  //   const  { event, data } = hubData.payload;
  //   if (event === "ready") {
  //     // do something here once the data is synced from the cloud
  //   }
  // })

  const numRef = useRef();
  useEffect(() => {
    const subscription = DataStore.observe(Post).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      <Button onClick={signOut} style={styles.button}>Sign out</Button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input type="button" value="NEW POST" onClick={createPost} />
          <input type="button" value="DELETE ALL POSTS " onClick={deleteAllPosts} />
          <input type="button" value="QUERY ALL POSTS" onClick={getPosts} />
        </div>
        <div>
          <input type="button" value="NEW COMMENT" onClick={createComment}/>
          <input type="button" value="DELETE ALL COMMENTS " onClick={deleteAllComments} />
          <input type="button" value="QUERY ALL COMMENTS" onClick={getComments} />
        </div>
        <div>
          <input type="button" value="Resync the data" onClick={syncData}/>
          {/* <input type="button" value="Decrement showing post rating" onClick={decrementRating}/> */}
        </div>
        <div>
          <input type="button" value="Test conflict resolution" onClick={testConflict}/>
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);
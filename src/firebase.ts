import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

let app: ReturnType<typeof initializeApp>

const firebaseConfig = {
  apiKey: "AIzaSyAp1-3FTV9NuUHGm1VUAkmE6gumUxkyIto",
  authDomain: "shogi-webapp-dev.firebaseapp.com",
  projectId: "shogi-webapp-dev",
  storageBucket: "shogi-webapp-dev.appspot.com",
  messagingSenderId: "634968408189",
  appId: "1:634968408189:web:a1085be3bdbb6644abf114"
};

export class FirebaseApp {
  constructor() {
    if (!app) {
      app = initializeApp(firebaseConfig);
    }
  }

  get app() {
    return app;
  }

  get firestore() {
    return getFirestore(this.app)
  }
}

export const initialize = () => {
  return new FirebaseApp()
}

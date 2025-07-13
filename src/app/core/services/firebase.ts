import {Injectable} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { onSnapshot, getFirestore, collection, addDoc, getDocs, where, query, orderBy } from 'firebase/firestore';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);

  private commentsApi: string = `${environment.apiUrl}/comments`;

  constructor(
    private httpClient: HttpClient,
  ) { }

  // Obține comentariile unui film
  async getComments(movieId: string) {
    try {
      const commentsCol = collection(this.db, "movies-comments", movieId, "comments");
      const snapshot = await getDocs(commentsCol);

      // snapshot.forEach(doc => {
      //   console.log(doc.id, "=>", doc.data());
      // });

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Eroare la getComments:", error);
      throw error;
    }
  }


  getCommentsLive(movieId: string): Observable<any[]> {
    return new Observable(observer => {
      const commentsRef = collection(this.db, 'movies-comments', movieId, 'comments');
      const q = query(commentsRef, orderBy('timestamp', 'asc'));   // vechi sus, noi jos

      const unsubscribe = onSnapshot(q, snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        observer.next(list);
      }, err => observer.error(err));

      return () => unsubscribe();
    });
  }


  async getDonationComments(movieId: string) {
    try {
      const commentsCol = collection(this.db, "donation-comments", movieId, "comments");
      const snapshot = await getDocs(commentsCol);

      // snapshot.forEach(doc => {
      //   console.log(doc.id, "=>", doc.data());
      // });

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Eroare la getComments:", error);
      throw error;
    }
  }

  async getDeletedComments(movieId: string) {
    try {
      const commentsCol = collection(this.db, "comments-blacklist");
      const snapshot = await getDocs(commentsCol);

      // snapshot.forEach(doc => {
      //   console.log(doc.id, "=>", doc.data());
      // });

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Eroare la getComments:", error);
      throw error;
    }
  }

  addComment(movieId: string, body: {text: string}) {
    return this.httpClient.post(`${this.commentsApi}/add/${movieId}`, body);
  }

  updateCommentsStatusByUserInRoom(userId: string, movieId: string, body: {status: string}) {
    console.log(movieId)
    return this.httpClient.post(`${this.commentsApi}/update-comment-status/${userId}/${movieId}`, body);
  }

  async addCommentToFirestore(movieId: string, text: string, userId: string, userName: string) {
    const commentRef = doc(collection(this.db, "movies-comments", movieId, "comments")); // generez id automat
    await setDoc(commentRef, {
      text,
      userId,
      userName,
      timestamp: serverTimestamp()
    });
  }

  // addComment(movieId: string, body: {text: string}) {
  //   return this.httpClient.post(`${this.commentsApi}/add/${movieId}`, body);
  // }

  addDonationComment(movieId: string, body: {text: string, amount: string}) {
    return this.httpClient.post(`${this.commentsApi}/add-donation-message/${movieId}`, body);
  }

  userDeleteOwnComment(userId: string, movieId: string, commentId: string) {
    return this.httpClient.post(`${this.commentsApi}/delete/${userId}/${movieId}/${commentId}`, {});
  }

  deleteComment(movieId: string, commentId: string) {
    return this.httpClient.post(`${this.commentsApi}/admin/delete/${movieId}/${commentId}`, {});
  }

}

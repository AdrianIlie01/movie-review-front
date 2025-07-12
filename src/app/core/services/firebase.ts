import {Injectable} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, where, query, orderBy } from 'firebase/firestore';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RoomDataInterface} from '../../shared/interfaces/room-data.interface';
import {PersonInterface} from '../../shared/interfaces/person.interface';
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

  addDonationComment(movieId: string, body: {text: string, amount: string}) {
    return this.httpClient.post(`${this.commentsApi}/add-donation-message/${movieId}`, body);
  }

  userDeleteOwnComment(movieId: string, commentId: string) {
    return this.httpClient.delete(`${this.commentsApi}/delete/${movieId}/${commentId}`);
  }

  deleteComment(movieId: string, commentId: string) {
    return this.httpClient.delete(`${this.commentsApi}admin//delete/${movieId}/${commentId}`);
  }

}

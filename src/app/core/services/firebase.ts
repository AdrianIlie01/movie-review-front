import {Injectable} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, where, query, orderBy } from 'firebase/firestore';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);


  // Obține comentariile unui film
  async getComments(movieId: string) {
    try {
      const commentsCol = collection(this.db, "movies", movieId, "comments");
      const snapshot = await getDocs(commentsCol);

      snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
      });

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Eroare la getComments:", error);
      throw error;
    }
  }
}

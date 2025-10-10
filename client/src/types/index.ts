import { Timestamp } from 'firebase/firestore';

export interface Note {
  id: string;
  content: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  author: {
    uid: string;
    name: string;
    photoURL?: string;
  };
}

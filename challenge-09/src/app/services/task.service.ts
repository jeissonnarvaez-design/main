// src/app/services/task.service.ts
import { Injectable, signal } from '@angular/core';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Task extends DocumentData {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private collectionName = 'tasks';
  readonly results = signal<Task[]>([]);
  readonly isPending = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async getAll() {
    this.isPending.set(true);
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const tasks = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Task[];
      this.results.set(tasks);
      this.isPending.set(false);
    } catch (err: any) {
      this.error.set(err.message);
      this.isPending.set(false);
    }
  }

  async add(task: Omit<Task, 'id'>) {
    try {
      await addDoc(collection(db, this.collectionName), {
        ...task,
        createdAt: serverTimestamp()
      });
      await this.getAll();
    } catch (err: any) {
      this.error.set(err.message);
      throw err;
    }
  }

  async update(id: string, data: Partial<Task>) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      await this.getAll();
    } catch (err: any) {
      this.error.set(err.message);
      throw err;
    }
  }

  async remove(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      await this.getAll();
    } catch (err: any) {
      this.error.set(err.message);
      throw err;
    }
  }
}
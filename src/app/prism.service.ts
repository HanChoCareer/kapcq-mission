import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Post {
  title: string;
  content: string;
}

@Injectable()
export class PrismService {

  postsCol: AngularFirestoreCollection<Post>;

  constructor(
    private afs: AngularFirestore
  ) { }

  getPosts() {
    return this.afs.collection('posts');
  }

  getAnnouncements(){
    return this.afs.collection('announcement');
  }

  getMembers() {
    return this.afs.collection('members');
  }

  getTeamMembers(team) {
    return this.afs.collection('members', ref => ref.where('Team','==',team)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      })
    })
  }

  addPost(title: string, content: string) {
    this.afs.collection('posts').add({'title': title, 'content': content});
  }

  addMembers(name: string, team: string) {
    this.afs.collection('members').add({'Name': name, 'Team': team});
  }

  addAttendance(id, date, service, meeting) {
    this.afs.collection('members').doc(id).collection('attendance').add({'date':date,'service': service, 'meeting': meeting});
  }

  getDocumentId() {
    return this.afs.collection('members').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      })
    })
  }
}

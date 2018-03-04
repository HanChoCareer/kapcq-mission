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

  getAnnouncements() {
    return this.afs.collection('announcement');
  }

  getMembers() {
    return this.afs.collection('members').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getTeamMembers(team) {
    return this.afs.collection('members', ref => ref.where('Team', '==', team)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getAttendance(date) {
    return this.afs.collection('attendance', ref => ref.where('attendance_date', '==', date)).snapshotChanges().map(actions => {
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
  addAnnouncement(content: string, group: string, teamcolor: string, title: string, writer: string) {
    this.afs.collection('announcement').add({'Content': content, 'Group': group, 'TeamColor': teamcolor, 'Title': title, 'Writer': writer});
  }

  addAttendance(id, team, date, service, meeting) {
    this.afs.collection('attendance').doc(id + '-' + date.toISOString().split('T')[0]).set({
      member_id: id,
      team_name: team,
      attendance_date: date,
      service: service,
      meeting: meeting
    }, {merge: true});
  }

  getDocumentId() {
    return this.afs.collection('members').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }
}

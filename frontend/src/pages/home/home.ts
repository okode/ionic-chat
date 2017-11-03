import { Component } from '@angular/core';
import { StompService } from '../../services/stomp';
import { ChatMessage } from '../../models/chatmessage';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public static readonly MESSAGES_CHANNEL = "/topic/messages";

  private messages: ChatMessage[] = [];

  constructor(private stompService: StompService, private http: Http, private alertCtrl: AlertController) { }

  ionViewDidEnter() {
    this.http
      .get('http://localhost:8080/messages')
      .mergeMap(res => Observable.from(<ChatMessage[]>res.json()))
      .subscribe(message => this.messages.push(message));
    this.stompService.listen(HomePage.MESSAGES_CHANNEL)
      .map(message => <ChatMessage>JSON.parse(message.body))
      .subscribe(chatMessage => this.messages.push(chatMessage));
  }

  ionViewWillLeave() {
    this.stompService.clearListeners();
  }

  newMessage() {
    this.alertCtrl.create({
      title: 'New chat message',
      inputs: [
        {
          name: 'text',
          placeholder: 'Message'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: (data: any) => {this.sendMessage(data.text); }
        }
      ]
    }).present();
  }

  private sendMessage(text: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.http
      .post('http://localhost:8080/messages', { text: text, userId: 1 }, options)
      .subscribe(null, error => console.log(JSON.stringify(error)));
  }

}

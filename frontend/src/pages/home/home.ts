import { Component } from '@angular/core';
import { StompService } from '../../services/stomp';
import { ChatMessage } from '../../models/chatmessage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private messages: ChatMessage[] = [];

  constructor(private stompService: StompService, private http: Http, private alertCtrl: AlertController) {
    this.stompService
      .listen(StompService.MESSAGES_CHANNEL)
      .map(message => <ChatMessage>JSON.parse(message.body))
      .subscribe(chatMessage => this.messages.push(chatMessage));
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
      .post('http://localhost:8080/messages', { text: text }, options)
      .subscribe(null, error => console.log(JSON.stringify(error)));
  }

}

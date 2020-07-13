import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User} from "../user";
import {environment} from "../../environments/environment.prod";

const serverUrl = environment.serverUrl;

@Injectable()
export class UserService {


  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(serverUrl + '/users');
  }

  getById(id: number) {
    return this.http.get(serverUrl + '/users' + id);
  }



  update(user: User) {
    return this.http.put(serverUrl + '/users/' + user.id, user);
  }

  delete(id: number) {
    return this.http.delete(serverUrl + '/users/' + id);
  }
}

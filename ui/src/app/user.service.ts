import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User} from "./user";

const serverUrl = "http://0.0.0.0:8094/api";

@Injectable()
export class UserService {


  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(serverUrl + '/users');
  }

  getById(id: number) {
    return this.http.get(serverUrl + '/users' + id);
  }

  register(user: User) {
    return this.http.post(serverUrl + '/users/register', user);
  }

  update(user: User) {
    return this.http.put(serverUrl + '/users/' + user.id, user);
  }

  delete(id: number) {
    return this.http.delete(serverUrl + '/users/' + id);
  }
}

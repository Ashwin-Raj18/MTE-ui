import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebServiceService } from './base-web-service.service';

@Injectable({
  providedIn: 'root'
})
export class JiraService extends BaseWebServiceService{

  getJiraData(key): Observable<any> {
    let url = `project/metrics?project=${key}`
    return this.doAsyncTask('GET', url);
  }
}

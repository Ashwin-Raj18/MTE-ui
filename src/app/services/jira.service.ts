import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebServiceService } from './base-web-service.service';

@Injectable({
  providedIn: 'root'
})
export class JiraService extends BaseWebServiceService{

  getJiraData(key): Observable<any> {
    let url = `project/metrics?project=${key}`;
    return this.doAsyncTask('GET', url);
  }

  getSprints(key): Observable<any> {
    let url = `project/Sprints?project=${key}`;
    return this.doAsyncTask('GET', url);
  }

  getProjects(): Observable<any> {
    let url = 'jiraProjects';
    return this.doAsyncTask('GET', url);
  }

  getMetricsBySprint(project, sprint) {
    let url = `project/Sprint/Issues?project=${project}&sprint=${sprint}`;
    return this.doAsyncTask('GET', url);    
  }
}

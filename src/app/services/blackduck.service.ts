import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebServiceService } from './base-web-service.service';

@Injectable({
  providedIn: 'root'
})
export class BlackduckService extends BaseWebServiceService{

  getBdMetricsByProject(key): Observable<any> {
    let url = `bdMetricsByProject?project=${key}`;
    return this.doAsyncTask('GET', url);
  }

  bdComponentByProject(key): Observable<any> {
    let url = `bdComponentByProject?project=${key}`;
    return this.doAsyncTask('GET', url);
  }

  bdSecurityByProject(key): Observable<any> {
    let url = `bdVulsByProject?project=${key}`;
    return this.doAsyncTask('GET', url);
  }

  getBDProjects(): Observable<any> {
    let url = 'bdProjects';
    return this.doAsyncTask('GET', url);
  }


}

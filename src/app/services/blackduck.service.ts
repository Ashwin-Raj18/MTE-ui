import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebServiceService } from './base-web-service.service';

@Injectable({
  providedIn: 'root'
})
export class BlackduckService extends BaseWebServiceService{

  getBdMetricsByProject(): Observable<any> {
    let url = 'bdMetricsByProject?project=arta-api';
    return this.doAsyncTask('GET', url);
  }

  bdComponentByProject(): Observable<any> {
    let url = 'bdComponentByProject?project=arta-api';
    return this.doAsyncTask('GET', url);
  }

  bdSecurityByProject(): Observable<any> {
    let url = 'bdVulsByProject?project=arta-api';
    return this.doAsyncTask('GET', url);
  }

  getBDProjects(): Observable<any> {
    let url = 'bdProjects';
    return this.doAsyncTask('GET', url);
  }


}

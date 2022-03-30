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
}

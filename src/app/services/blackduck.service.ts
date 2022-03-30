import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebServiceService } from './base-web-service.service';

@Injectable({
  providedIn: 'root'
})
export class BlackduckService extends BaseWebServiceService{

  getBdMetricsByProject(): Observable<any> {
    let url = 'bdMetricsByProject?project=xot-frontend';
    return this.doAsyncTask('GET', url);
  }
}

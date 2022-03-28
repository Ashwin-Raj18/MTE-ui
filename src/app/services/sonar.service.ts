import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebServiceService } from './base-web-service.service';

@Injectable({
  providedIn: 'root'
})
export class SonarService extends BaseWebServiceService{

  getSonarProjects(): Observable<any> {
    let url = 'sqProjects';
    return this.doAsyncTask('GET', url);
  }

  getMetrics(): Observable<any> {
    let url = 'sqMetricsByProject?project=artaui';
    return this.doAsyncTask('GET', url);
  }
}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseWebServiceService {
  baseUrl: any;
  pueBaseUrl: any;

  constructor(
    public httpClient: HttpClient,
  ) { }

  //method to call http api
  doAsyncTask(httpType = '', endPoint = '', reqData = {}): Observable<any> {
    this.baseUrl = environment.baseUrl;
    const params = new HttpParams();

    switch (httpType) {
      case 'GET':
        let getRequest;
        getRequest = this.httpClient.get(this.baseUrl + endPoint, { params });
        return getRequest.pipe(
          map((data) => {
            return data;
          }),
          catchError((err) => this.handleError(err))
        );
      case 'POST':
        let promise;
        promise = this.httpClient.post(this.baseUrl + endPoint, reqData, {
          params,
        });
        return promise.pipe(
          map((data) => {
            return data;
          }),
          catchError((err) => this.handleError(err))
        );
      case 'PUT':
        return this.httpClient
          .put(this.baseUrl + endPoint, reqData, { params })
          .pipe(
            map((data) => {
              return data;
            }),
            catchError((err) => this.handleError(err))
          );
      case 'DELETE':
        return this.httpClient.delete(this.baseUrl + endPoint, { params }).pipe(
          map((data) => {
            return data;
          }),
          catchError((err) => this.handleError(err))
        );
      case 'POSTPUE':

        let promisepue;
        promisepue = this.httpClient.post(this.pueBaseUrl + endPoint, reqData, {
          params,
        });
        return promisepue.pipe(
          map((data) => {
            return data;
          }),
          catchError((err) => this.handleError(err))
        );

      case 'GETPUE':
        let getpueRequest;
        getpueRequest = this.httpClient.get(this.pueBaseUrl + endPoint, { params });
        return getpueRequest.pipe(
          map((data) => {
            return data;
          }),
          catchError((err) => this.handleError(err))
        );

    }
  }


  handleError(error: HttpErrorResponse) {
    if (
      error instanceof HttpErrorResponse &&
      error.error instanceof Blob &&
      error.error.type === 'application/json'
    ) {
      const reader: FileReader = new FileReader();
      const obs = new Observable((observer: any) => {
        reader.onloadend = (e) => {
          const messageObject = reader.result;
          observer.error({
            error: {
              message: messageObject,
            },
            message: messageObject,
            status: error.status,
          });
          observer.complete();
        };
      });
      reader.readAsText(error.error);
      return obs;
    } else {
      return throwError(error);
    }
  }
}

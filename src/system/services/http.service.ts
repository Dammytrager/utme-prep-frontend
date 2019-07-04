import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  _headers: HttpHeaders = new HttpHeaders();

  /**
   * Http Service Constructor
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
  }

  /**
   * GET | Sends Http GET request
   * @param url
   * @returns {Promise<HttpResponse<any>>}
   */
  get(url: string) {
    return this.http.get(url,{
      headers: this.Headers
    }).pipe(
      map((res: HttpResponse<any>) => res)
    ).toPromise();
  }

  /**
   * download | Sends Http GET request to download a file
   * @param {string} url
   * @param {{}} options
   * @returns {Promise<Object>}
   */
  download(url: string, options = {}) {
    return this.http.get(url, {
      headers: this.Headers,
      ...options
    }).toPromise();
  }

  /**
   * POST | Sends Http POST request
   * @param {string} url
   * @param {object} data
   * @param headers
   * @returns {Promise<HttpResponse<any>>}
   */
  post(url: string, data: object, headers?) {
    return this.http.post(url, data, {
      headers: headers || this.Headers
    }).pipe(
      map((res: HttpResponse<any>) => res)
    ).toPromise();
  }

  /**
   * PUT | Sends Http PUT request
   * @param {string} url
   * @param {object} data
   * @returns {Promise<HttpResponse<any>>}
   */
  put(url: string, data: object) {
    return this.http.put(url, data, {
      headers: this.Headers
    }).pipe(
      map((res: HttpResponse<any>) => res)
    ).toPromise();
  }

  /**
   * DELETE | Sends Http DELETE request
   * @param {string} url
   * @param {object} data
   * @returns {Promise<HttpResponse<any>>}
   */
  delete(url: string, data?: object) {
    return this.http.delete(url, {
      headers: this.Headers
    }).pipe(
      map((res: HttpResponse<any>) => res)
    ).toPromise();
  }

  /**
   * Set Headers | Set appropriate custom headers
   * @param {{token: string}} data
   */
  setHeaders(data?: { token: string }, content_type?) {
    let headers: HttpHeaders = new HttpHeaders();
    // headers = headers.append('Content-Type', content_type || 'application/json');
    if (data && data.token) {
      headers = headers.append('Authorization', `Bearer ${data.token}`);
    }
    this._headers = headers;
  }

  /**
   * Get Headers | Return custom request headers
   * @returns {HttpHeaders}
   * @constructor
   */
  get Headers() {
    return this._headers;
  }

  /**
   * Custom Headers | Add Custom Header to Request
   * @param {{name: string; value: string}[]} options
   * @returns {HttpHeaders}
   */
  customHeaders(options: { name: string, value: string }[]) {
    let headers: HttpHeaders = new HttpHeaders();
    options.forEach(header => {
      headers = headers.append(header.name, header.value);
    });

    return headers;
  }
}



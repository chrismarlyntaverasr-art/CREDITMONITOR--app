import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface ApiPost {
  userId?: number;
  id?: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://jsonplaceholder.typicode.com/posts';


  // =========================================================
  // GET
  // =========================================================

  obtenerPublicaciones(): Observable<ApiPost[]> {

    return this.http
      .get<ApiPost[]>(this.apiUrl)
      .pipe(
        timeout(10000)
      );

  }


  // =========================================================
  // POST
  // =========================================================

  crearPublicacion(
    publicacion: ApiPost
  ): Observable<ApiPost> {

    return this.http
      .post<ApiPost>(
        this.apiUrl,
        publicacion
      )
      .pipe(
        timeout(10000)
      );

  }

}
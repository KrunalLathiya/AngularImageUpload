import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private cancelUpload$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  uploadFile(file: File): {
    uploadProgress$: Observable<number>;
    cancelUpload: () => void;
  } {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', 'http://localhost:4000/add', formData, {
      reportProgress: true,
    });

    const uploadProgress$ = this.http.request(req).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return Math.round((100 * event.loaded) / (event.total ?? 1));
          case HttpEventType.Response:
            return 100;
          default:
            return 0;
        }
      })
    );

    return {
      uploadProgress$: uploadProgress$,
      cancelUpload: () => this.cancelUpload$.next(),
    };
  }
}

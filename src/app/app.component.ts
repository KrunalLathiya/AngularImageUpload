import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadService } from './upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatProgressBarModule,
  ],
})
export class AppComponent {
  uploadProgress: number | null = null;
  isUploading = false;
  file: File | null = null;
  uploadSuccess: boolean = false;
  fileError: string | null = null;

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const fileType = this.file.type;
      if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
        this.fileError = 'Only PNG or JPG files are allowed';
        this.file = null; // Reset the file
        this.uploadSuccess = false;
      } else {
        this.fileError = null;
      }
    }
  }

  uploadFile() {
    if (!this.file) return;

    this.isUploading = true;
    this.uploadSuccess = false;
    const { uploadProgress$, cancelUpload } = this.fileUploadService.uploadFile(
      this.file
    );

    uploadProgress$.subscribe({
      next: (progress) => {
        this.uploadProgress = progress;
        if (progress === 100) {
          this.isUploading = false;
          this.uploadSuccess = true;
          this.fileError = null;
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
      },
    });
  }

  cancelUpload() {
    this.isUploading = false;
    this.uploadProgress = null;
    this.uploadSuccess = false;
  }
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  @ViewChild('feedbackDescription')
  feedbackDescription!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('feedbackTitle') feedbackTitle!: ElementRef<HTMLInputElement>;
  @Input() showMobileFeedbackForm: boolean = false;
  constructor(private http: HttpClient) {}
  private apiUrl = '/api/userFeedback';

  feedbackSent: boolean = false;
  showFeedbackForm: boolean = false;
  emptySubjectOrDescription: boolean = false;

  ngOnChanges() {
    this.showFeedbackForm = this.showMobileFeedbackForm;
  }

  autoResize(textarea: HTMLTextAreaElement | HTMLInputElement) {
    textarea.style.height = 'auto'; // reset
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  submitFeedback(
    feedbackTitle: string,
    feedbackDescription: string,
    isMobile?: boolean,
  ) {
    const title = feedbackTitle.trim();
    const feedback = feedbackDescription.trim();

    if (feedback && title) {
      const formData = {
        title: title,
        message: feedback,
      };

      this.http.post(this.apiUrl, formData).subscribe({
        next: (res) => {
          console.log('Email sent successfully', res);

          this.showFeedbackForm = isMobile ? true : false;
          this.feedbackSent = true;

          this.feedbackTitle.nativeElement.value = '';
          this.feedbackDescription.nativeElement.value = '';
          this.autoResize(this.feedbackDescription.nativeElement);

          setTimeout(() => {
            this.feedbackSent = false;
            this.showFeedbackForm = false;
          }, 4000);
        },
        error: (err) => {
          console.error('Email sending failed', err);
        },
      });
    } else {
      this.emptySubjectOrDescription = true;
      setTimeout(() => {
        this.emptySubjectOrDescription = false;
      }, 4000);
    }
  }
}

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
  formSubmitBtnLabel: string = 'Submit';
  forSubmitHeading: string = '';
  formSubmitTagline: string = '';
  formSubmittedSuccess: boolean = false;
  feedbackInProcess: boolean = false;

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

      this.formSubmitBtnLabel = 'Sending...';
      this.feedbackInProcess = true;

      this.http.post(this.apiUrl, formData).subscribe({
        next: (res) => {
          this.showFeedbackForm = isMobile ? true : false;
          this.feedbackSent = true;
          this.forSubmitHeading = '✓ Feedback submitted!';
          this.formSubmitTagline =
            'We appreciate you taking the time to help us improve our app.';
          this.formSubmittedSuccess = true;

          this.feedbackTitle.nativeElement.value = '';
          this.feedbackDescription.nativeElement.value = '';
          this.autoResize(this.feedbackDescription.nativeElement);

          setTimeout(() => {
            this.feedbackSent = false;
            this.feedbackInProcess = false;
            this.showFeedbackForm = false;
            this.formSubmitBtnLabel = 'Submit';
            this.forSubmitHeading = '';
            this.formSubmitTagline = '';
            this.formSubmittedSuccess = false;
          }, 4000);
        },
        error: (err) => {
          this.showFeedbackForm = isMobile ? true : false;
          this.feedbackSent = true;
          this.formSubmittedSuccess = false;

          this.forSubmitHeading = '⚠️ Error submitting feedback!';
          this.formSubmitTagline =
            'We apologize for the inconvenience, Please try again after some time!';
          console.error('Email sending failed', err);

          setTimeout(() => {
            this.feedbackSent = false;
            this.feedbackInProcess = false;
            this.showFeedbackForm = false;
            this.formSubmitBtnLabel = 'Submit';
            this.forSubmitHeading = '';
            this.formSubmitTagline = '';
          }, 4000);
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

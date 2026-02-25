import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  @ViewChild('feedbackDescription')
  feedbackDescription!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('feedbackTitle') feedbackTitle!: ElementRef<HTMLInputElement>;

  feedbackSent: boolean = false;
  showFeedbackForm: boolean = false;

  autoResize(textarea: HTMLTextAreaElement | HTMLDivElement) {
    textarea.style.height = 'auto'; // reset
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  submitFeedback() {
    this.feedbackSent = true;
    this.showFeedbackForm = false;
    const title = this.feedbackTitle.nativeElement.value.trim();
    const feedback = this.feedbackDescription.nativeElement.value.trim();
    if (feedback) {
      console.log('Title: ', title, ', Description: ', feedback);
      this.feedbackSent = true;
      this.feedbackTitle.nativeElement.value = '';
      this.feedbackDescription.nativeElement.value = '';
      this.autoResize(this.feedbackDescription.nativeElement);
      setTimeout(() => {
        this.feedbackSent = false;
      }, 3000);
    }
  }
}

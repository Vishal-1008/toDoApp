import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  submitFeedback(feedbackTitle: string, feedbackDescription: string, isMobile?: boolean) {
    // this.showFeedbackForm = isMobile ? true : false;
    const title = feedbackTitle.trim();
    const feedback = feedbackDescription.trim();
    if (feedback && title) {
      console.log(title, feedback);
    this.showFeedbackForm = isMobile ? true : false;

      this.feedbackSent = true;
      this.feedbackTitle.nativeElement.value = '';
      this.feedbackDescription.nativeElement.value = '';
      this.autoResize(this.feedbackDescription.nativeElement);
      setTimeout(() => {
        this.feedbackSent = false;
        this.showFeedbackForm = false;
      }, 4000);
    } else {
      this.emptySubjectOrDescription = true;
      setTimeout(() => {
        this.emptySubjectOrDescription = false;
      }, 4000);
    }
  }
}

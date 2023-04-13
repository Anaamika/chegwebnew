import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiConstants } from '@config/api-constants';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { utilities } from '@app/utilities/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FooterService } from '@app/core/services/footer.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { TitleService } from '@app/core/services/title.service';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;

  bankName = utilities.getBankName();
  walletBalance: number = 0;
  showLoader: boolean = false;
  //For Validation
  //nameFormControl = new FormControl('');

  mobileFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(10),
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  summaryFormControl = new FormControl('', [
    Validators.required,
  ]);

  descriptionFormControl = new FormControl('', [
    Validators.required
  ]);

  selectedTopic = new FormControl('', [
    Validators.required,
  ]);

  topicsList: string[] = [];

  constructor(
    private titleService: TitleService,
    private dataService: DataService,
    private storageService: StorageService,
    private footerService: FooterService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle("All your questions answered. Get in touch with us");
    this.titleService.updateDescription("Get in touch with the "+ this.bankName + " team!")
    this.footerService.getfooterdeatils()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.topicsList = res[0]['topicsArray'];
        } else {
          this.topicsList = [];
        }
      }, err => {
      });
  }


  postContactInfo() {
    if (this.mobileFormControl.status == "VALID" && this.emailFormControl.status == "VALID" && this.summaryFormControl.status == "VALID" && this.selectedTopic.status == "VALID" && this.descriptionFormControl.status == "VALID") {
      this.showLoader = true;
      const model = {
        Topics: this.selectedTopic.value,
        // Name: this.nameFormControl.value,
        Email: this.emailFormControl.value,
        PhoneNo: this.mobileFormControl.value,
        Summary: this.summaryFormControl.value,
        Description: this.descriptionFormControl.value,
        MsgContent: this.descriptionFormControl.value,
      }

      this.dataService.parseApiCall(`${ApiConstants.URL.POST_CONTACT_INFO}`,
        'post',
        model,
        this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
          if (res) {
            this._snackBar.open('Thank You! Your message has been successfully sent. We will contact you very soon!', '', {
              duration: 5000,
              panelClass: ['green-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.showLoader = false;
            this.clear();
          }
        }, err => {
          this.showLoader = false;
        });

    } else {
      this._snackBar.open('There are incomplete required fields. Please complete them', '', {
        duration: 2000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  clear() {
    this.selectedTopic.reset();
    //this.nameFormControl.reset();
    this.emailFormControl.reset();
    this.mobileFormControl.reset();
    this.summaryFormControl.reset();
    this.descriptionFormControl.reset();
  }

  public resolved(captchaResponse: string): void {
    if (captchaResponse) {
      this.postContactInfo();
      this.captchaRef.reset();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

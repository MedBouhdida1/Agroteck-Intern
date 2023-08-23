import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { HotToastService } from "@ngneat/hot-toast";
import { TranslateService } from "@ngx-translate/core";
import { Page, initPage } from "app/shared/models";
import { GrowoutService } from "app/modules/growout/services/growout.service";
import { Growout } from "app/modules/growout/models/growout";
import { ConfirmDialogComponent } from "app/shared/components/confirm-dialog/confirm-dialog.component";
import { StepperComponent } from "app/shared/components/stepper/stepper.component";
import { WizardDialogComponent } from "app/shared/components/wizard-dialog/wizard-dialog.component";
import { Currency } from "../models/currency";
import { CurrencyService } from "../services/currency.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-trash",
  templateUrl: "./curtrash.component.html",
  styleUrls: ["./curtrash.component.scss"],
})
export class CurrTrashComponent implements OnInit {
  @ViewChild("deleteModal")
  deleteModal!: ConfirmDialogComponent;

  @ViewChild("disarchiveModal")
  disarchiveModal!: ConfirmDialogComponent;

  @ViewChild("formModal")
  formModal!: WizardDialogComponent;

  @ViewChild("stepper")
  stepper!: StepperComponent;

  loading? = false;
  pageNumber = 0;
  pageSize = 10;
  filter = "";

  currency: Currency = {};
  currencys: Array<Currency> = [];
  Page: Page<Currency> = initPage;
  onPaginationChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private translateService: TranslateService,
    private toastService: HotToastService,
    private currrencyService: CurrencyService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.findArchivedPage();
    console.log(this.findArchivedPage.length);
    this.onPaginationChange.subscribe(() => this.findArchivedPage());
  }

  findArchivedPage() {
    this.loading = true;
    this.currrencyService
      .findArchivedPage(this.pageNumber, this.pageSize, this.filter)
      .subscribe({
        next: (result) => {
          this.currencys = result.content;
          this.Page = result;
        },
        error: (error) => {
          this.loading = false;
          console.error(error);
        },
        complete: () => (this.loading = false),
      });
  }
  goto(){
    this.router.navigateByUrl("/currency")
  }

  findById(id: string) {
    this.currrencyService.findById(id).subscribe({
      next: (result) => (this.currency = result),
      error: (error) => console.error(error),
    });
  }

  onFilterChange(filter: string) {
    this.filter = filter;
    this.pageNumber = 0;
    this.onPaginationChange.emit("");
  }

  onPageNumberChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.onPaginationChange.emit("");
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 0;
    this.onPaginationChange.emit("");
  }

  onClickdisArchive(id: string) {
    this.currrencyService.disArchive(id).subscribe({
      next: () => {
        this.findArchivedPage();

        this.toastService.success(
          this.translateService.instant("success.deleted", {
            elem: this.translateService.instant("currency"),
          })
        );
        console.log(id);
      },
    });
  }

  // onClickdisArchive(id: string) {
  //   console.log("====================================");
  //   console.log("ji");
  //   console.log("====================================");
  //   this.disarchiveModal.show(() => {
  //     console.log("====================================");
  //     console.log("yep");
  //     console.log("====================================");
  //     this.toastService.loading(
  //       this.translateService.instant("message.loading..."),
  //       {
  //         id: "0",
  //       }
  //     );
  //     this.currrencyService.disArchive(id).subscribe({
  //       next: () => {
  //         this.disarchiveModal.hide();
  //         this.toastService.close("0");
  //         this.toastService.success(
  //           this.translateService.instant("success.deleted", {
  //             elem: this.translateService.instant("item"),
  //           })
  //         );
  //       },
  //       // error: (error) => {
  //       //   this.disarchiveModal.hide();
  //       //   this.toastService.close("0");
  //       //   this.toastService.error(
  //       //     this.translateService.instant(error.error, {
  //       //       elem: this.translateService.instant("item"),
  //       //     })
  //       //   );
  //       // },
  //     });
  //   });
  // }

  onClickDelete(id: string) {
    this.currrencyService.delete(id).subscribe({
      next: () => {
        this.findArchivedPage();
        console.log("Success");
        this.toastService.success(
          this.translateService.instant("success.deleted", {
            elem: this.translateService.instant("currency"),
          })
        );
      },
    });
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
    template: `
    <div class="row">
        <div class="col-lg-12">
            <form [formGroup]="form" novalidate (ngSubmit)="onSubmit()">
                <div class="card">
                    <div class="card-header">
                        <strong>Manage websites</strong>
                    </div>
                    <div class="card-body" formArrayName="Sites">
                        <div class="row">
                            <div class="form-group col-sm-5">
                                <label for="HostName">Host Name</label>
                            </div>
                            <div class="form-group col-sm-6">
                                <label for="StartPage">Start Page</label>
                            </div>
                            <div class="form-group col-sm-1">
                                <label>Actions</label>
                            </div>
                        </div>
                        <div class="row" *ngFor="let user of form['controls'].Sites['controls']; let i=index" [formGroupName]="i">
                            <div class="form-group col-sm-5" >
                                <input type="text" class="form-control" placeholder="Host Name" formControlName="HostName"/>
                            </div>
                            <div class="form-group col-sm-6">
                                <content-reference formControlName="StartPage" name="'StartPage'"></content-reference>
                            </div>
                            <div class="form-group col-sm-1">
                                <button class="btn btn-sm btn-danger" type="button" *ngIf="form['controls'].Sites['controls'].length > 1" (click)="removeHost(i)">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-12">
                                <button type="button" class="btn btn-sm btn-success" (click)="addHost()">Add Host</button>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-sm btn-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  `
})
export class SiteManageComponent {

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            Sites: this.formBuilder.array([])
        });
        this.addHost();

        // if (this.appCofig.pinterestConfig.users && this.appCofig.pinterestConfig.users.length > 0) {
        //     this.getHosts();
        // } else {
        //     this.addHost();

        // }
    }

    // private getHosts() {
    //     const control = <FormArray>this.form['controls']['Sites'];
    //     this.appCofig.pinterestConfig.users.forEach((user: PinterestUser) => {
    //         let userCtrl = this.formBuilder.group({
    //             Username: [user.username]
    //         });;
    //         control.push(userCtrl);
    //     })
    // }

    addHost() {
        const control = <FormArray>this.form['controls']['Sites'];
        const formCtrl = this.formBuilder.group({
            HostName: [''],
            StartPage: ['']
        });;

        control.push(formCtrl);
    }

    removeHost(index: number) {
        const control = <FormArray>this.form['controls']['Sites'];
        control.removeAt(index);
    }

    onSubmit() {
        console.log(this.form.value);
        //this.onSavePinterestSettings.emit(this.form.value);
    }
}

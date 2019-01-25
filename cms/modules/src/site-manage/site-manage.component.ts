import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
    template: `
  <div>
    <form [formGroup]="form" novalidate (ngSubmit)="onSubmit()">
        <div formArrayName="Sites">
            <div>Manage websites</div>
            <div *ngFor="let user of form['controls'].Sites['controls']; let i=index" [formGroupName]="i">
                <input type="text" placeholder="Host Name" formControlName="HostName"/>
                <input type="text" placeholder="Start Page" formControlName="StartPage"/>
                <button type="button" *ngIf="form['controls'].Sites['controls'].length > 1" (click)="removeHost(i)">
                    Delete
                </button>
            </div>
        </div>
        <div>
            <button type="button" (click)="addHost()">Add Host</button>
        </div>
        <div>
            <button type="submit" color="accent">Save</button>
        </div>
    </form>
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

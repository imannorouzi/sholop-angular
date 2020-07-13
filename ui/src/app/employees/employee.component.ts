import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {User} from "../user";
import {SpinnerComponent} from "../spinner/spinner.component";
import {ConfirmComponent} from "../confirm/confirm.component";
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../utils/common.service";
import {AddEmployeeComponent} from "../add-employee/add-employee.component";

@Component({
  selector: 'app-employees',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild("spinner", {static: true}) spinner: SpinnerComponent;
  @ViewChild("confirm", {static: true}) confirm: ConfirmComponent;
  @ViewChild("editEmployee", {static: true}) addEmployee: AddEmployeeComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

  employees: any[] = [];
  deletingContact: any;
  loading: boolean = false;

  currentUser: User;
  searchString: string = '';
  role: string = '';

  constructor(private dataService: DataService,
              public commonService: CommonService,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.role = params['role'];
      this.readContacts('', params['role']);
    });
  }

  readContacts(hint: string, role: string){

    this.loading = true;

    this.dataService.getEmployees(hint, role).subscribe(
      data => {
        if(data.msg === "OK") {

          this.employees = [];

          data.object.forEach(contact => {
            this.employees.push(contact);
          });
        }

        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  deleteConfirmed(employee){
    this.dataService.deleteEmployee(employee.id).subscribe(
      data => {
        this.employees.splice(employee.index, 1);
      },
      error1 => {
        console.log(error1);
      }
    )
  }


  onEmployeeAdded(employee){
    let c = this.employees.find(c => { return c.id === employee.id});
    if(c){
      let i = this.employees.indexOf(c);
      this.employees.splice(i, 1);
      this.employees.splice(i, 0, employee);
    }else{
      this.employees.push(employee);
    }
  }

  onDeleteUser(id: any, index: number, event) {
    event.preventDefault();
    this.deletingContact = this.employees[index];
    this.confirm.setObject({id: id, index: index});
    this.confirm.show();
  }

  onEditContact(employee: any, index: number) {
    event.preventDefault();
    this.addEmployee.setContact(employee, index);
    this.addEmployee.show();
  }

  onKeyUp(event){
    this.readContacts(this.searchString, this.role)
  }

  onUploadFileClick(event) {
    event.preventDefault();
    this.fileInput.nativeElement.click();
  }

  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
    }
  }
}

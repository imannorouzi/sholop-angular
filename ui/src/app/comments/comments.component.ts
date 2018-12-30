import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {DataService} from "../data.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit, OnChanges {

  commentForm: FormGroup;
  submitted: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private dataService: DataService,
              private formBuilder: FormBuilder) { }

  @Input() eventId: number = 0;
  page: number = 0;

  comments: any[] = [];
  loading: boolean = false;
  @Input() anonymous: boolean = false;
  noMoreComments: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.eventId.currentValue !== changes.eventId.previousValue){
      this.reset();
    }
  }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.minLength(3), Validators.required]]
    });
  }

  ngAfterViewInit(){
    // this.reset();
  }

  reset(){
    // this.commentForm.reset();
    this.page = 0;
    this.comments = [];


    this.readComments();
  }

  readComments(event = undefined){
    if(event) event.preventDefault();

    this.dataService.getComments(this.eventId, this.page++).subscribe(
      data => {
        if(data && data.msg === "OK"){
          this.comments.push(...data.object);

          if(data.object.length < 5){
            // No more comments
            this.noMoreComments = true;
          }
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.commentForm.invalid) {
      return;
    }

    this.postComment(this.f.comment.value);
  }

  get f() { return this.commentForm.controls; }

  postComment(c){


    let comment = {
      text: c,
      eventId: this.eventId
    };

    this.loading = true;
    this.dataService.postComment(comment).subscribe(
      value => {
        if(value && value['msg'] === "OK"){
          this.comments.unshift(value['object']);

          this.commentForm.reset();
          this.submitted = false;
        }
        this.loading = false;

      }, error =>{
        console.log(error);
        this.loading = false;
      }
    )
  }
}

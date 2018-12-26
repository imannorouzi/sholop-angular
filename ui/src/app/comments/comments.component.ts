import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {DataService} from "../data.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit, OnChanges {

  constructor(private authenticationService: AuthenticationService,
              private dataService: DataService) { }

  @Input() eventId: number = 0;
  page: number = 0;

  comments: any[] = [];
  noMoreComments: boolean = false;

  comment: any = {
    text: '',
    eventId: this.eventId
  };


  ngOnChanges(changes: SimpleChanges): void {
    if(changes.eventId.currentValue !== changes.eventId.previousValue){
      this.reset();
    }
  }

  ngOnInit() {
    // this.reset();
  }

  ngAfterViewInit(){
    // this.reset();
  }

  reset(){
    this.comment = {
      text: '',
      eventId: this.eventId
    };

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


  postComment(){
    this.dataService.postComment(this.comment).subscribe(
      value => {
        if(value && value['msg'] === "OK"){
          this.comments.unshift(value['object']);

          this.comment.text = '';
        }

      }, error =>{
        console.log(error);
      }
    )
  }
}

import { Component , Input } from '@angular/core' ;
import { Post } from '../post.model';

@Component({
  selector : 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent  {
  // posts = [
  //    {title: 'First Post', content : "first Post Component"},
  //    {title: 'Second Post', content : "Second Post Component"},
  //    {title: 'Third Post', content : "Third Post Component"}

  // ];
 @Input() posts: Post[] = [];

}

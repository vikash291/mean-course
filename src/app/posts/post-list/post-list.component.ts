import { Component , OnInit, OnDestroy } from '@angular/core' ;
import { Post } from '../post.model';
import { PostService } from '../post.service';

import { Subscription} from 'rxjs' ;

@Component({
  selector : 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //    {title: 'First Post', content : "first Post Component"},
  //    {title: 'Second Post', content : "Second Post Component"},
  //    {title: 'Third Post', content : "Third Post Component"}

  // ];
 posts: Post[] = [];
 private postsSub: Subscription;

 constructor(public postService: PostService) { }

 ngOnInit() {
   this.posts = this.postService.getPosts();
   this.postsSub = this.postService.getPostUpdateListener().
   subscribe((posts: Post[]) => {
     this.posts = posts;
   });
 }


 ngOnDestroy() {
   this.postsSub.unsubscribe();
 }
}

import { Component , OnInit, OnDestroy } from '@angular/core' ;
import { Post } from '../post.model';
import { PostService } from '../post.service';

import { Subscription} from 'rxjs' ;
import { PageEvent } from '@angular/material';

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
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 10;
  postPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  private postsSub: Subscription;

 constructor(public postService: PostService) { }

 ngOnInit() {
   this.isLoading = true;
   this.postService.getPosts(this.postPerPage, 1);
   this.postsSub = this.postService.getPostUpdateListener().
   subscribe((postData: {posts: Post[], postCount: number } ) => {
     this.isLoading = false;
     this.posts = postData.posts;
     this.totalPosts = postData.postCount;
   });
 }

 onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postPerPage = pageData.pageSize;
  this.postService.getPosts(this.postPerPage, this.currentPage);

 }

 onDelete(postsId: string) {
   this.postService.deletePost(postsId).subscribe(() => {
    this.postService.getPosts(this.postPerPage, this.currentPage);
   });

 }

 ngOnDestroy() {
   this.postsSub.unsubscribe();
 }
}

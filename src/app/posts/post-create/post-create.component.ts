import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl : './post-create.component.html',
  styleUrls : ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '' ;
  private mode = 'create';
  private postId: string;
  isLoading = false;
  singlePost: Post;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        // this.singlePost = this.postService.getPost(this.postId);
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.singlePost = {id: postData._id, title: postData.title, content: postData.content};
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // const post: Post = {
    //   title : form.value.title,
    //   content : form.value.content
    // };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title , form.value.content);
    } else {
      this.postService.updatePost(this.postId, form.value.title , form.value.content);
    }
    form.resetForm();

  }
}

import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mineType} from './mine-type.validator';
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
  imagePreview: any; // imagePreview: string;

  form: FormGroup; // creating form programatically.

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    // initialization for form
    this.form = new FormGroup({
      'title': new FormControl(null , {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mineType] } )
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        // this.singlePost = this.postService.getPost(this.postId);
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.singlePost = {id: postData._id, title: postData.title, content: postData.content};
          this.form.setValue({
            'title': this.singlePost.title,
            'content': this.singlePost.content
          });
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    // const post: Post = {
    //   title : form.value.title,
    //   content : form.value.content
    // };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title ,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postService.updatePost(this.postId, this.form.value.title , this.form.value.content);
    }
    // form.resetForm(); // angular resetForm
    this.form.reset(); // reset form for reactive form.
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog_table;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Notifications\DatabaseNotification;
use Notification;
use App\Notifications\BlogPostNotification;
use App\Notifications\UserBlogNotification;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function add_comment($blog_id,Request $request)
    {
        
        $blog=Blog_table::where('id',$blog_id)->first();
        if($blog){
            $validator=Validator::make($request->all(),[
                'message'=>'required',
            ]);
            if($validator->fails()){
                return response()->json([
                    'message'=>'Validation errors',
                    'errors'=>$validator->messages()
                ],422);
            }
            $comment=Comment::create([
                'user_id'=>$request->user_id,
                'blog_id'=>$blog->id,
                'name'=>$request->name,
                'message'=>$request->message
            ]);
            $user=User::all();
            $data_notify=[
                'id'=>$request->user_id,
                'name'=>$request->name." Added a comment on ".$blog->title,
                'blog_url_with_id'=>'read/'.$blog->id,
            ];
            $user->each->notify(new UserBlogNotification($data_notify));
            return response()->json([
                'message'=>'Comment successfully created',
                'data'=>$comment
            ]);
        }
        else{
            return response()->json([
                'message'=>'No blog found',
            ],400);
        }
    }
    public function get_comment($blog_id){
    
        $comment_data=Comment::where('blog_id',$blog_id)->get();
        return response()->json($comment_data);
    }
    public function delete_comment(Request $req){
        $comment_id=$req->comment_id;
        $user_id=$req->user_id;
        $result=Comment::where([['id',"=",$comment_id],['user_id',"=",$user_id]])->delete();
        if($result)
        {
            
            return["Result"=>"Comment has been deleted successfully !"];
        }
        else
        {
            return["Result"=>"Deletion operation has been failed !"];
        }
        
    }
    public function delete_All_Comment_by_owner($blog_id){
        $result=Comment::where('blog_id',$blog_id)->delete();
        if($result)
        {
            return["Result"=>"All comments are deleted successfully !"];
        }
        else
        {
            return["Result"=>"All comments are not deleted !"];
        }
    }
    public function delete_Selected_comment(Request $req){
        $arr=$req->arr;
        $result=Comment::destroy($arr);
        if($result)
        {
            return["Result"=>"Selected comments are deleted successfully !"];
        }
        else
        {
            return["Result"=>"Selected comments are not deleted !"];
        }
    }
}

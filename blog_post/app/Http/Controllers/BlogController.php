<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Blog_table;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;
use Notification;
use App\Notifications\BlogPostNotification;
use App\Notifications\UserBlogNotification;

class BlogController extends Controller
{
    //
    function blog_data()
    {
        $records= Blog_table::all();
        if($records->isEmpty()){
            return null;
            
        }
        else{
            return $records;
        }
        //return DB::select('select * from blog_tables');
    }
    function add_data(Request $req)
    {
        $req->validate([
            'image'=>'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $user_id=$req->input('user_id');
        $title=$req->input('title');
        $desc=$req->input('descriptions');
        
        if($req->file('image')){
            $image=$req->file('image');
            $imageName=$image->getClientOriginalName();
            $image->storeAs('public/images',$imageName);
            $device=new Blog_table;
            $device->user_id=$user_id;
            $device->title=$title;
            $device->descriptions=$desc;
            $device->image=$imageName;
            $result=$device->save();
            if($result)
               { 
               
                $user=User::all();
                $details=[
                'greeting'=>'Hello !',
                'body'=>'A new blog for you.',
                'actionText'=>'Please visit the post',
                'actionUrl'=>'http://localhost:3000/',
                'lastLine'=>'Thank You',
                ];
                 Notification::send($user, new BlogPostNotification($details));
                 $data_notify=[
                    'id'=>$user_id,
                    'name'=>User::find($user_id)->name." Added a Blog!",
                    'blog_url_with_id'=>'http://localhost:3000/',
                ];
                $user->each->notify(new UserBlogNotification($data_notify));
                return["Result"=>"Data has been saved successfully"];
               }
            else
               {
                return["Result"=>"Operation Failed"];
               }
            }
        else
          {
            return["Result"=>"No image found"];
           }
           
    }
    function search($title)
    {
        $searchData=Blog_table::where('title',"like","%".$title."%")->get();  
        if($searchData->isEmpty()){
            return null;
            
        }
        else{
            return $searchData;
        }
    }
    public function update_data(Request $req,$id)
    {   
        $device= Blog_table::find($id);
        $previousImageName=$device->image;
        $previousFilePath=storage_path("app/public/images/".$previousImageName);
        $req->validate([
            'image'=>'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        $title=$req->title;
        $desc=$req->descriptions;
        $image=$req->image;
        //return[$title,$desc,$id,$img];
        if($req->hasFile('image')){
            //return Blog_table::find($id);
           // File::delete($previousFilePath);
            $imageName=$image->getClientOriginalName();
            $image->storeAs('public/images',$imageName);
            $device->title=$title;
            $device->descriptions=$desc;
            $device->image=$imageName;
            $result=$device->save();
           if($result)
            {
                return["Result"=>"Data has been Updated successfully"];
            }
            else
            {
                return["Result"=>"Update operation has been failed"];
            }
        }
        else{
            return["Result"=>"No image found"];
        }
    }
    function delete($id){
        $device=Blog_table::find($id);
        $fileName=$device->image;
        $result=$device->delete();
        $filePath=storage_path("app/public/images/".$fileName);
        if($result)
        {
           // File::delete($filePath);
            return["Result"=>"Record has been deleted successfully"];
        }
        else
        {
            return["Result"=>"Deletion operation has been failed"];
        }
    }
    function blog_data_id($id){
        return Blog_table::where('id',$id)->get();
    }


    
    function blog_pagination(Request $req)
    {    
        $page=$req->query('page',1);
        $perPage=$req->query('perPage',9);
        $blog=Blog_table::paginate($perPage,['*'],'page',$page);
        if($blog->isEmpty()){
            return null;
            
        }
        else{
            return $blog;
        }
    }
   /* function blog_notification()
    {   
        
        $user=User::all();
        $data_notify=[
            'id'=>3,
            'name'=>User::find(3)->name,
        ];
        $user->each->notify(new UserBlogNotification($data_notify));
        return["Result"=>$user];

    }*/
    function get_all_blog_notification($user_id)
    {   //return ["Result"=>"Ok"];
        $notification=DatabaseNotification::where("notifiable_id", $user_id)->whereNull('read_at')->orderBy('created_at','desc')->get();
        return response()->json($notification);
    }
    //Marked as Read
    function notify_notification(Request $req)
    {   $notificationId=$req->id;
        $notification=DatabaseNotification::where('id',$notificationId)->get();
        $notification->markAsRead();
        return["Result"=>"OK"];
    }
    function markedAsReadAll($user_id){
        $notification=DatabaseNotification::where('notifiable_id',$user_id)->get();
        $notification->markAsRead();
        return["Result"=>"OK"];
    }
}
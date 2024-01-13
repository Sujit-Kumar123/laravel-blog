<?php

namespace App\Http\Controllers;
use App\Models\Profiles;
use Illuminate\Http\Request;

class ProfilesController extends Controller
{
    public function add_profile(Request $req)
    {  $req->validate([
        'image'=>'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);
        $user_id=$req->input('user_id');
        $ifExit=Profiles::where('user_id',$user_id)->get();
        if($ifExit && $req->file('image'))
        {
            Profiles::where('user_id',$user_id)->delete();
        }
        
        if($req->file('image'))
        {
            $user_id=$req->input('user_id');    
            $image=$req->file('image');
            $imageName=$image->getClientOriginalName(); 
            $image->storeAs('public/images',$imageName);
            $profile=new Profiles;
            $profile->user_id=$user_id;
            $profile->profile_image=$imageName;
            $result=$profile->save();
            if($result)
            {
                return["Result"=>"Data has been Updated successfully"];
            }
            else
            {
                return["Result"=>"Update operation has been failed"];
            }
        }
        else
        {
            return["Result"=>"No image found"];
        }
    }
    public function get_profile($user_id)
    {
        $result=Profiles::where('user_id',$user_id)->get();
        if($result)
        {
            return $result;
        }
        else
        {
            return["Result"=>"No record found !"];
        }
    }
}

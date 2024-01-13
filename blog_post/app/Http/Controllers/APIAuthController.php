<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Validator;

class APIAuthController extends Controller
{
    //
    public function register(Request $request)
    {
        $user=User::create([        
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=> \Hash::make($request->password)
        ]);
        $token=$user->createToken('Token')->accessToken;
        return response()->json(['token'=>$token,'user'=>$user],200);
    }
    public function login(Request $request)
    {
        $data=[
            'email'=>$request->email,
            'password'=>$request->password,
        ];
        if(auth()->attempt($data)){
            $token=auth()->user()->createToken('Token')->accessToken;
            return response()->json(['token'=>$token],200);
        }
        else{
            return response()->json(['error'=>'Unauthorized'],401);
        }
    }
    public function userInfo()
    {
        $user=auth()->user();
        if($user){
        return response()->json(['user'=>$user]);
        }
        else{
            return response()->Json(['error'=>'Unauthorized access'],401);
        }
    }
    public function logout(Request $request){
        if( $request->user()->tokens()->delete())
        { 
        return response()->json([
            'message'=>'User successfully logout',
        ],200);
        }
    }
    public function change_password(Request $request){
        $validator=Validator::make($request->all(),
        [
            'old_password'=>'required',
            'password'=>'required|min:4|max:16',
            'confirm_password'=>'required|same:password'
        ]);
        if($validator->fails()){
            return response()->json([
                'message'=>'Validation Failed !',
                'errors'=>$validator->errors()
            ],422);
        }
        $user=$request->user();
        $old_password=$request->old_password;
        if(\Hash::check($old_password,$user->password)){
            $user->update([
                'password'=>\Hash::make($request->password)
            ]);
            return response()->json([
                'message'=>'Password successfully updated !',
            ],200);
        }
        else{
            return response()->json([
                'message'=>'Old password does not matched !',
            ],400);
        }
    }
}

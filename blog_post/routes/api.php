<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\APIAuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfilesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//Route for Blog data
Route::get('blog_data',[BlogController::class,'blog_data']);
Route::get('blog_data_id/{id}',[BlogController::class,'blog_data_id']);
Route::group(['middleware'=>['cors']],function(){
    Route::post('add_data',[BlogController::class,'add_data']);
});
//UserBlogNotification
Route::middleware('auth:api')->group(function(){
Route::get('blog_notification',[BlogController::class,'blog_notification']);
});
//Access Database Notification
Route::get('get_all_blog_notification/{user_id}',[BlogController::class,'get_all_blog_notification']);
//Notify the Notification
Route::post('notify_notification',[BlogController::class,'notify_notification']);
//Marked As Read
Route::post('markedAsReadAll/{user_id}',[BlogController::class,'markedAsReadAll']);
//Search
Route::get('search/{title}',[BlogController::class,'search']);
Route::put('update_data/{id}',[BlogController::class,'update_data']);
Route::delete('delete/{id}',[BlogController::class,'delete']);
//API with Pagination.
Route::get('blog_pagination',[BlogController::class,'blog_pagination']);

//Route for Authentication
Route::post('register',[APIAuthController::class,'register']);
Route::post('login',[APIAuthController::class,'login']);
//Route with middleware
Route::middleware('auth:api')->group(function(){
    Route::get('get-user',[APIAuthController::class,'userInfo']);
});
//Log out with middleware
Route::middleware('auth:api')->group(function(){
    Route::post('logout',[APIAuthController::class,'logout']);
});
//change password with middleware
Route::middleware('auth:api')->group(function(){
    Route::post('change_password',[APIAuthController::class,'change_password']);
});
//Comment route
Route::post('add_comment/{blog_id}',[CommentController::class,'add_comment']);
Route::get('get_comment/{blog_id}',[CommentController::class,'get_comment']);
Route::delete('delete_comment',[CommentController::class,'delete_comment']);
Route::delete('delete_All_Comment_by_owner/{blog_id}',[CommentController::class,'delete_All_Comment_by_owner']);
Route::delete('delete_Selected_comment',[CommentController::class,'delete_Selected_comment']);
//User Profile
Route::post('add_profile',[ProfilesController::class,'add_profile']);
Route::get('get_profile/{user_id}',[ProfilesController::class,'get_profile']);

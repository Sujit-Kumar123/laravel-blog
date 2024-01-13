<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog_table extends Model
{
    use HasFactory;
    public $table="blog_tables";
    public $timestamp=false;
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

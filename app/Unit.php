<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
     protected $table = 'unit';
     protected $primaryKey = 'Id'; 

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    //protected $fillable = ['Login', 'Email', 'Password'];
     
     public function armies() {
        return $this->belongsToMany('App\Army','army_unit','Unit_id','Army_id');
    }
    
    public function resource() {
        return $this->belongsTo('App\Resource');
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
     protected $table = 'building';
     protected $primaryKey = 'Id'; 

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    //protected $fillable = ['Login', 'Email', 'Password'];
     
     public function cities() {
        return $this->belongsToMany('App\City','city_building','Building_id','City_id')->withPivot('Id');
    }
    
    public function resource() {
        return $this->belongsTo('App\Resource');
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model {

    public $timestamps = false;
    protected $table = 'city';
    protected $primaryKey = 'Object_id';

    public function player() {
        return $this->belongsTo('App\User');
    }

    public function buildings() {
        return $this->belongsToMany('App\Building', 'city_building', 'City_id', 'Building_id')->withPivot('Id');
    }

    public function resource() {
        return $this->belongsTo('App\Resource');
    }
    
    public function income() {
        return $this->hasOne('App\Income');
    }
    
    public function population(){
        return $this->hasOne('App\Population');
    }
    
    public function position(){
        return $this->belongsTo('App\Position');
    }

}

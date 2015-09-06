<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Population extends Model {

    public $timestamps = false;
    protected $table = 'population';
    protected $primaryKey = 'city_id';

    public function city() {
        return $this->belongsTo('App\City');
    }

}

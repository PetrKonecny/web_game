<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Income extends Model {

    protected $table = 'income';
    protected $primaryKey = 'city_id';
    public $timestamps = false;

    public function city() {
        return $this->belongsTo('App/City');
    }

}

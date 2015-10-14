<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Army extends Model {

    protected $table = 'army';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    public function units() {
        return $this->belongsToMany('App\Unit', 'army_unit', 'Army_id', 'Unit_id')->withPivot('Unit_count');
    }

    public function player() {
        return $this->belongsTo('App\User','Player_id');
    }

    public function position() {
        return $this->belongsTo('App\Position');
    }

}

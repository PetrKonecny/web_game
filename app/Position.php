<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Position extends Model {

    public $timestamps = false;
    protected $table = 'position';
    protected $primaryKey = 'id';

    public function cities() {
        return $this->hasOne('App\City');
    }

    public function armies() {
        return $this->hasOne('App\Army');
    }

    public function compare($subject) {
        return ($this->x == $subject->x && $this->y == $subject->y);
    }

}

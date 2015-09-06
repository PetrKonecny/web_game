<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model {

    public $timestamps = false;
    protected $table = 'resource';

    public function city() {
        return $this->hasOne('App\City');
    }

    public function unit() {
        return $this->hasOne('App\Unit');
    }

    public function building() {
        return $this->hasOne('App\Building');
    }

    public function substractResource($resource) {
        $this->wood -= $resource->wood;
        $this->gold -= $resource->gold;
        $this->stone -= $resource->stone;
        $this->platinum -= $resource->platinum;
        $this->silver -= $resource->silver;
        $this->food -= $resource->food;
    }

    public function addResource($resource) {
        $this->wood += $resource->wood;
        $this->gold += $resource->gold;
        $this->stone += $resource->stone;
        $this->platinum += $resource->platinum;
        $this->silver += $resource->silver;
        $this->food += $resource->food;
    }

    public function multiplyResource($multiplier) {
        $this->wood *= $multiplier;
        $this->gold *= $multiplier;
        $this->stone *= $multiplier;
        $this->platinum *= $multiplier;
        $this->silver *= $multiplier;
        $this->food *= $multiplier;
    }

    public function substractResourceArray($resourceArray) {
        foreach ($resourceArray as $resource) {
            $this->substractResource($resource);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller extends BaseController {

    use DispatchesJobs,
        ValidatesRequests;

    public function arrayDiffNotUnique($array1, $array2) {
        foreach ($array2 as $a) {
            $pos = array_search($a, $array1);
            unset($array1[$pos]);
        }
        return array_values($array1);
    }

    public function getIdArray($array) {
        $result = array();
        foreach ($array as $item) {
            array_push($result, $item['Id']);
        }
        return $result;
    }
    
    public function decodeArray($array) {
        $result = array();
        foreach($array as $item) {
            array_push($result, json_decode($item));
        }
        return $result;   
    }

}

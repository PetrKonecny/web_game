<?php
namespace App\Jobs;

use App\Army;
use App\Unit;
use App\Pivot;
use Log;

class GenerateNeutralArmy {
 
    public $army;
    
    public function handle(){
        $this->army = new Army();
        Log::info($this->army);
        $this->army->units = $this->generateUnits();
        return $this->army;
    }
       
    public function generateUnits(){
        $result = array();
        $unit = Unit::where('Name','Stupid')->first();
        $pivot = new Pivot();
        $pivot->Unit_count = rand(100, 500);
        $unit->pivot = $pivot;
        array_push($result, $unit);
        return $result;
    }
    
}
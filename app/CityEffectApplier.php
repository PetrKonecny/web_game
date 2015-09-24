<?php

namespace App;

use App\Income;

class CityEffectApplier {

    public static function modifyBuildingPricesByCity($prices, $city) {
        foreach ($city->buildings as $building) {
            CityEffectApplier::applyPriceEffect($building, $prices);
        }
        return $prices;
    }

    public static function modifyUnitPricesByCity($units, $city) {
        foreach ($city->buildings as $building) {
            CityEffectApplier::applyPriceEffectUnits($building, $units);
        }
        return $units;
    }

    public static function applyPriceEffect($building, $prices) {
        if ($building->Name === "dadadad") {
            foreach ($prices as $price) {
                $price->multiplyResource(1.2);
            }
        }
    }

    public static function applyPriceEffectUnits($building, $units) {
        switch ($building->Name) {
            case "Barracks" : CityEffectApplier::applyBarracks($units);
                break;
            case "Archery Range" : CityEffectApplier::applyArcheryRange($units);
                break;
        }
    }

    public static function applyBarracks($units) {
        foreach ($units as $unit) {
            if ($unit->class == "melee") {
                $unit->resource->multiplyResource(0.85);
            }
        }
    }
    
     public static function applyArcheryRange($units) {
        foreach ($units as $unit) {
            if ($unit->class == "ranged") {
                $unit->resource->multiplyResource(0.85);
            }
        }
    }

    public static function applyBuildEffect($building, $city) {
        switch ($building->Name) {
            case "Farm" :
                $income = Income::find($city->Object_id);
                $income->food += 0.1;
                $income->save();
                break;
            case "Quarry" :
                $income = Income::find($city->Object_id);
                $income->stone += 0.1;
                $income->save();
                break;
            case "Silversmith" :
                $income = Income::find($city->Object_id);
                $income->silver += 0.1;
                $income->save();
                break;
            case "Platinum mine" :
                $income = Income::find($city->Object_id);
                $income->platinum += 0.1;
                $income->save();
                break;
            case "Goldsmith" :
                $income = Income::find($city->Object_id);
                $income->gold += 0.1;
                $income->save();
                break;
        }
    }

}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


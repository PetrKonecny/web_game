<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Resource;
use App\CityEffectApplier;
use App\Http\Controllers\Controller;

class ResourceController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        return Resource::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        //
    }

    public static function getPricesForUnits($units, $city) {
        $basePrices = array();
        foreach ($units as $unit) {
            $unit->resource;
        }
        $modifiedUnits = CityEffectApplier::modifyUnitPricesByCity($units, $city);
        foreach ($modifiedUnits as $unit) {
            array_push($basePrices, $unit->resource);
        }
        return $basePrices;
    }

    public static function getPricesForBuildings($buildings, $city) {
        $basePrices = array();
        foreach ($buildings as $building) {
            array_push($basePrices, $building->resource_id);
        }
        $basePrices = \App\Resource::whereIn('Id', $basePrices)->get();
        return \App\CityEffectApplier::modifyBuildingPricesByCity($basePrices, $city);
    }

}

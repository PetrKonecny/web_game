<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\City;
use App\Building;
use App\Resource;
use App\Population;
use App\CityEffectApplier;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class CityController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        $cities = City::all();
        return $cities;
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
    public function store(Request $request) {

        $resource = new Resource;
        $resource->wood = 1000;
        $resource->stone = 1000;
        $resource->gold = 1000;
        $resource->save();

        $population = new Population;
        $population->count = 1000;
        $population->save();

        $city = new City;
        $city->Name = $request->name;
        $city->player()->associate(Auth::user());
        $city->resource()->associate($resource);
        $city->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        $city = City::find($id);
        $city->buildings;
        $city->resource;
        $city->position;
        $city->income;
        return $city; //
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
    public function update($id, Request $request) {
        $city = City::find($id);
        $buildingIds = $this->getIdArray($request->input('buildings'));
        $result = $this->arrayDiffNotUnique($buildingIds, $this->getIdArray($city->buildings));
        $city->buildings()->attach($result);
        $city->save();
        $building = Building::find($result);
        CityEffectApplier::applyBuildEffect($building[0], $city);
        $resource = $building[0]->resource;
        $cityResource = $city->resource;
        $cityResource->substractResource($resource);
        $cityResource->save();

        $return = City::find($id);
        $return->buildings;
        $return->resource;
        $return->income;
        return $return;
    }

    public function getBuildingsForCity($id) {
        $city = City::find($id);
        $buildings = \App\Building::all();
        $modifiedPrices = ResourceController::getPricesForBuildings($buildings, $city);
        return $modifiedPrices;
        for ($i = 0; $i < count($buildings); $i++) {
            $buildings[$i]->resource = $modifiedPrices[$i];
        }
        return $buildings;
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

}

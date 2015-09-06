<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Commands\ResolveBattle;
use App\Http\Controllers\Controller;
use App\Army;
use App\Unit;
use App\City;
use App\Resource;
use App\Position;
use App\Http\Controllers\ResourceController;

class ArmyController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        $armies = Army::all();
        return $armies;
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
        $army = Army::find($id);
        $army->units;
        $army->position;
        return $army;
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
        $army = Army::find($id);
        $units = $request->input('units');
        $result = array();
        foreach ($units as $unit) {
            $result[$unit['Id']] = array('Unit_count' => $unit['pivot']['Unit_count']);
        }
        $army->units()->sync($result);
    }

    public function buyUnits($id, Request $request) {
        $army = Army::find($id);
        $unitsToBuy = $request->input('units');
        $result = array();
        foreach ($unitsToBuy as $unit) {
            $result[$unit['Id']] = array('Unit_count' => $unit['pivot']['Unit_count']);
        }
        $city = $this->getCityArmyIsIn($army);
        $this->payForUnits($unitsToBuy, $army->units, $this->getCityArmyIsIn($army)->resource);
        $army->units()->sync($result);
    }

    public function payForUnits($unitsToBuy, $units, $resource) {
        $prices = ResourceController::getPricesForUnits($units);
        $unitsToBuy = $this->getBuyCount($units, $unitsToBuy);
        foreach ($prices as $price) {
            foreach ($unitsToBuy as $unit) {
                if ($price['id'] == $unit['resource_id']) {
                    $price->multiplyResource($unit['countToBuy']);
                }
            }
        }       
        $resource = Resource::find($resource->id);
        $resource->substractResourceArray($prices);
        $resource->save();
    }

    public function getBuyCount($unitsBefore, $unitsAfter) {
        foreach ($unitsAfter as &$unitA) {
            foreach ($unitsBefore as $unitB) {
                if ($unitA['Id'] === $unitB['Id']) {
                    $unitA['countToBuy'] = $unitA['pivot']['Unit_count'] - $unitB['pivot']['Unit_count'];
                }
            }
        }
        return $unitsAfter;
    }

    public function getCityArmyIsIn($army) {
        $position = Position::where('y', $army->position->y)->where('x', $army->position->x)->get()->lists('id');
        $city = City::whereIn('position_id', $position)->get();
        return $city[0];
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

    public function attack($id, Request $request) {
        $targetId = $request->input('target');
        $target = $this->show($targetId);
        $subject = $this->show($id);
        $command = new ResolveBattle($subject, $target);
        return $command->handle();
    }

}

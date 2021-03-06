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
        $army->name = $request->input('name');
        $army->save();
    }

    public function buyUnits($id, Request $request) {
        $army = Army::find($id);
        $unitsToBuy = $request->input('units');
        $result = array();
        foreach ($unitsToBuy as $unit) {
            $result[$unit['Id']] = array('Unit_count' => $unit['pivot']['Unit_count']);
        }
        $this->payForUnits($unitsToBuy, $army, $this->getCityArmyIsIn($army));
        $army->units()->sync($result);
    }

    public function payForUnits($unitsToBuy, $army, $city) {
        $prices = ResourceController::getPricesForUnits($army->units, $city);
        $unitsToBuy = $this->getBuyCount($army->units, $unitsToBuy);
        foreach ($prices as $price) {
            foreach ($unitsToBuy as $unit) {
                if ($price['id'] == $unit['resource_id']) {
                    $price->multiplyResource($unit['countToBuy']);
                }
            }
        }
        $resource = Resource::find($city->resource->id);
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
    
    
    public function move($id, Request $request) {
        $delay = 30;
        $army = Army::find($id);
        $army->move_to_x = $request->input('move_to_x');
        $army->move_to_y = $request->input('move_to_y');
        $job = (new \App\Jobs\MoveArmy($army))->delay($delay)->onQueue('moves');
        $this->dispatch($job);
        $army->move_at = round(microtime(true)) + $delay;
        $army->save();
    }
}

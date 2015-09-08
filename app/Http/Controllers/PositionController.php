<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Position;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\City;
use Log;
use App\Unit;
use App\ObjectWrapper;
use App\Jobs\MoveArmy;

class PositionController extends Controller {

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
        return Position::find($id);
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
        $delay = 240;
        $position = Position::find($id);
        $position->move_to_x = $request->input('x');
        $position->move_to_y = $request->input('y');
        $job = (new MoveArmy($position))->delay($delay)->onQueue('moves');
        $this->dispatch($job);
        $position->move_at = round(microtime(true)) + $delay;
        $position->save();
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

    public function getAvailableUnits($id) {
        $file = file_get_contents("units.txt");
        $units = json_decode($file, true);
        $position = Position::find($id);
        $x = $position->x;
        $y = $position->y;
        $position = Position::where('y', $y)->where('x', $x)->get()->lists('id');
        $city = City::whereIn('position_id', $position)->get();
        if (count($city) == 0) {
            return $city;
        } else {
            switch ($city[0]->tier) {
                case 1: $txt = 'tier1';
                    break;
                case 2: $txt = 'tier2';
                    break;
            }
            return Unit::whereIn('Id', $units[$txt])->with('resource')->get();
        }
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Position;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\City;
use App\Unit;
use App\ObjectWrapper;

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
        $position = Position::find($id);
        $position->x = $request->input('x');
        $position->y = $request->input('y');
        $position->save();
        return $position;
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

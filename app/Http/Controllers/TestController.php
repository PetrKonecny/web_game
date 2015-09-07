<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Commands\ResolveTurn;
use App\Http\Controllers\Controller;
use App\Army;
use Vinkla\Pusher\PusherManager;

class TestController extends Controller {

    private $queue;
    private $index;
    private $file;

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        return 'Hello';
        $armies = Army::lists('Army_name', 'Id');
        return view('test', ['armies' => $armies]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        //
    }
    
    public function push(PusherManager $pusher) {
        $message = 'Hello world' + rand(0, 1000);
        $pusher->trigger('test-channel', 'new-message', ['message' => $message]);
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
        //
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
    
    public function runTestCommand(){
        \Illuminate\Support\Facades\Artisan::call('turn:resolve');
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

    public function recount() {
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

    public function generate() {
        $this->queue = array();
        $this->file = fopen("map.txt", "w");
        $this->index = 1;
        $this->queue->enqueue(1);
        generateNodes();
    }

    public function getMap() {
        return file_get_contents("map2.txt");
    }

    public function generateNodes() {
        $n = rand(1, 4);
        for ($i = 0; $i < $n; $i++) {
            $this->index++;
            $this->queue->enqueue($this->index);
            fwrite($this->file, "{" + $this->queue->current() + "," + $this->index + "}");
        }
        $this->queue->dequeue;
        if ($this->index > 2000) {
            return;
        }
        $this->generateNodes();
    }

    public function generateMap() {
        $level = 50;
        $file = fopen("map2.txt", "w");
        fwrite($file, '{ "nodes": [[');
        $startX = 0;
        $startY = 0;
        for ($i = 1; $i <= $level; $i++) {
            for ($j = 1; $j <= $level; $j++) {
                $x = $startX + 50 * $j;
                $y = $startY + 50 * $j;
                if ($j == $level) {
                    $txt = '{"map_x":' . $j . ',"map_y":' . $i . ',"x": ' . $x . ' ,"y": ' . $y . '}],[';
                    if ($i == $level) {
                        $txt = '{"map_x":' . $j . ',"map_y":' . $i . ',"x": ' . $x . ' ,"y": ' . $y . '}]],"routes": [[';
                    }
                } else {
                    $txt = '{"map_x":' . $j . ',"map_y":' . $i . ',"x": ' . $x . ' ,"y": ' . $y . '},';
                }
                fwrite($file, $txt);
                $x += 50;
                $y += 50;
            }
            $startX += 50;
            $startY -= 50;
        }

        for ($i = 1; $i <= $level; $i++) {
            for ($j = 1; $j <= $level; $j++) {
                $first = true;
                if ((rand(0, 10) < 7 || $j == 1) && $i != $level) {
                    $to = $j;
                    $toLvl = $i + 1;
                    if ($j == 1) {
                        $txt = '{"from_x": ' . $j . ',"from_y":' . $i . ' ,"to_x": ' . $to . '  , "to_y":' . $toLvl . ',"cost": 0 }';
                        fwrite($file, $txt);
                        $first = false;
                    } else {
                        $txt = ',{"from_x": ' . $j . ',"from_y":' . $i . ' ,"to_x": ' . $to . '  , "to_y":' . $toLvl . ',"cost": 0 }';
                        fwrite($file, $txt);
                    }
                }
                if ((rand(0, 10) < 6 && $j != $level) && $i != $level) {
                    $to = $j + 1;
                    $toLvl = $i + 1;
                    if ($j == 1 && $first) {
                        $txt = '{"from_x": ' . $j . ',"from_y":' . $i . ' ,"to_x": ' . $to . '  , "to_y":' . $toLvl . ',"cost": 0 }';
                        fwrite($file, $txt);
                        $first = false;
                    } else {
                        $txt = ',{"from_x": ' . $j . ',"from_y":' . $i . ' ,"to_x": ' . $to . '  , "to_y":' . $toLvl . ',"cost": 0 }';
                        fwrite($file, $txt);
                    }
                }

                if (rand(0, 10) < 8 && $j != $level) {
                    $to = $j + 1;
                    $toLvl = $i;
                    if ($j == 1 && $first) {
                        $txt = '{"from_x": ' . $j . ',"from_y":' . $i . ' ,"to_x": ' . $to . '  , "to_y":' . $toLvl . ',"cost": 0 }';
                        fwrite($file, $txt);
                    } else {
                        $txt = ',{"from_x": ' . $j . ',"from_y":' . $i . ' ,"to_x": ' . $to . '  , "to_y":' . $toLvl . ',"cost": 0 }';
                        fwrite($file, $txt);
                    }
                }
                if ($j == $level && $i != $level) {
                    $txt = '],[';
                    fwrite($file, $txt);
                }
            }
        }
        fwrite($file, ']]}');
    }

}

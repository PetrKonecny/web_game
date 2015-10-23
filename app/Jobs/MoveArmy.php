<?php

namespace App\Jobs;

use App\Jobs\Job;
use Log;
use App\Position;
use App\Army;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;

/* Moves army from one space to the other
 * validation
 * move has to be legal (to the field that is connected to this field) // TO DO
 * 
 * after validation 
 * process fights with every unfriendly army on this field 
 * if army looses this fights stop processing
 * assign new (in case it was not visited by anyone yet) or existing position record to this army (move)
 * assign player id of this army to that position if it doesn't have one or it is not friendly
 */

class MoveArmy extends Job implements SelfHandling, ShouldQueue {

    use InteractsWithQueue,
        SerializesModels;

    public $army;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Army $army) {
        $this->army = $army;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $winner = null;
        if (!$this->validate()) {
            return;
        }
        $position = $this->getPositionToMoveTo();
        if ($position->player == null || $this->army->player->id != $position->player->id){
            $winner = $this->fightArmies($position);
        }
        if ($winner == null || $this->isArmyEqual($winner)) {
            $this->moveArmy($position);
        }  
    }
    
    public function moveArmy($position){
        $this->army->player->positions()->save($position);
        $this->army->move_at = null;
        $this->army->move_to_x = null;
        $this->army->move_to_y = null;
        $position->army()->save($this->army);
    }
    

    public function getNeutralArmy() {
         $generator = new \App\Jobs\GenerateNeutralArmy();
         return $generator->handle();
    }

    public function fightArmies($position) {
        $armies = $this->getUnfriendlyArmies($position);
        foreach ($armies as $army) {
            $handler = new \App\Jobs\ResolveBattle($this->army, $army);
            $winner = $handler->handle();
            if (!$this->isArmyEqual($winner)) {
                break;
            }
        }
        return $winner;
    }

    public function isArmyEqual($army) {
        return $army->Id == $this->army->Id;
    }

    public function getUnfriendlyArmies($position) {
        $result = array();
        if ($position->player == null) {
            array_push($result, $this->getNeutralArmy());
            return $result;
        }
        $armies = Army::where('position_id', $position->id);
        foreach ($armies as $army) {
            if ($this->isArmyFriendly($army)) {
                array_push($result, $army);
            }
        }
        return $result;
    }

    public function isArmyFriendly($army) {
        if ($army->player == null) {
            return false;
        }
        if ($army->player->id != $this->army->player->id) {
            return false;
        }
        return true;
    }

    public function getPositionToMoveTo() {
        $x = $this->army->move_to_x;
        $y = $this->army->move_to_y;
        $position = Position::where('x', $x)->where('y', $y)->first();
        if ($position == null) {
            $position = new Position();
            $position->x = $x;
            $position->y = $y;
        }
        return $position;
    }

    public function validate() {
        return true;
    }

}

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
        $x = $this->army->move_to_x;
        $y = $this->army->move_to_y;
        $position = Position::where('x', $x)->where('y', $y)->first();
        if ($position == null) {
            $position = new Position();
            $position->x = $x;
            $position->y = $y;
        }
        $this->resolveMove($position);
        Log::info($position);
        $this->army->player->positions()->save($position);
        $this->army->move_at = null;
        $this->army->move_to_x = null;
        $this->army->move_to_y = null;
        $position->army()->save($this->army);
    }

    public function resolveMove($position) {
        Log::info($position->player);
        if ($position->player == null) {
            Log::info('trying to resolve');
            $handler = new \App\Commands\ResolveBattle($this->army, $this->prepareNeutralArmy());
            $handler->handle();
        }
    }

    public function prepareNeutralArmy() {
        return Army::find(1);
    }

}

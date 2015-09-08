<?php

namespace App\Jobs;

use App\Jobs\Job;
use Log;
use App\Position;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;

class MoveArmy extends Job implements SelfHandling, ShouldQueue {

    use InteractsWithQueue, SerializesModels;

    public $position;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Position $position) {
        $this->position = $position;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        
        $this->position->x = $this->position->move_to_x;
        $this->position->y = $this->position->move_to_y;
        $this->position->move_to_x = null;
        $this->position->move_to_y = null;
        $this->position->move_at = null;
        $this->position->save();
    }
   
}

<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Population;
use Illuminate\Support\Facades\DB;

class ResolveTurn extends Job implements SelfHandling, ShouldQueue {

    use InteractsWithQueue,
        SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct() {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $this->processCityResources();
    }

    public function processCityResources() {
        DB::table('population')->update(['count' => DB::raw('count * inc')]);
    }

}

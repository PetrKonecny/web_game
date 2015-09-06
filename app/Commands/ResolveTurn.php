<?php

namespace App\Commands;

use App\Commands\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Bus\SelfHandling;

class ResolveTurn extends Command implements SelfHandling {

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct() {
        //
    }

    /**
     * Execute the command.
     *
     * @return void
     */
    public function handle() {
       $this->processCityResources();
    }

    public function processCityResources() {
       return DB::table('resource')
                ->whereExists(function ($query) {
                    $query->select()
                    ->from('city')
                    ->whereRaw('city.resource_id = resource.id');
                })
                ->update(['population' => DB::raw('population * incppl')]);
    }

}

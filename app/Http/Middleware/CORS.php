<?php

namespace App\Http\Middleware;

use Closure;

class CORS {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $http_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : false; 
        $allowed_origins = ['http://localhost:8383' , 'http://example.com'];
        if (in_array($http_origin, $allowed_origins)) {
            return $next($request)->header('Access-Control-Allow-Origin', '*')
                            ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
                            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
        }

        return $next($request);
    }

}

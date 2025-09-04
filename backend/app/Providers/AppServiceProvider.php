<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRoutes();
    }

    /**
     * Configure the application routes.
     */
    protected function configureRoutes(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->name('api.')  // Optional: adds 'api.' prefix to route names
            ->group(base_path('routes/api.php'));

        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}

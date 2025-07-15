<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) { //ローカル設定
    // if (file_exists($maintenance = __DIR__ . '/backend/storage/framework/maintenance.php')) { //本番設定
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php'; //ローカル設定
// require __DIR__ . '/backend/vendor/autoload.php'; //本番設定

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php'; //ローカル設定
// $app = require_once __DIR__ . '/backend/bootstrap/app.php'; //本番設定

$app->handleRequest(Request::capture());

<?php

use Spiral\RoadRunner\Worker;
use Spiral\Goridge\StreamRelay;
use Spiral\GRPC\Server;
use App\PingerService;
use App\GRPC\Pinger\PingerInterface;

// 1. Load Composer's autoloader
require __DIR__ . '/vendor/autoload.php';

// 2. Create a new GRPC server instance
$server = new Server();

// 3. Register the PingerService with the server
$server->registerService(PingerInterface::class, new PingerService());

// 4. Create a new Worker instance with a StreamRelay that uses STDIN and STDOUT
$helper = new Worker(new StreamRelay(STDIN, STDOUT));

// 5. Start serving requests using the GRPC server and the Worker instance
$server->serve($helper);
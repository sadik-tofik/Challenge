<?php

namespace App;

use App\GRPC\Pinger\PingerInterface;
use App\GRPC\Pinger\PingRequest;
use App\GRPC\Pinger\PingResponse;
use Spiral\GRPC\ContextInterface;

class PingerService implements PingerInterface
{
    public function Ping(ContextInterface $ctx, PingRequest $in): PingResponse
{
    $response = new PingResponse();
    $response->setMessage($in->getMessage());

    return $response;
}
}
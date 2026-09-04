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
        // 1. Read message from $in using getMessage()
        $Message = $in->getMessage();
    
        // 2. Create a new PingResponse object
        $response = new PingResponse();
        // 3. Set the message on the response object using setMessage()
        $response->setMessage($Message);
        // 4. Return the response object
        return $response;
    }
}
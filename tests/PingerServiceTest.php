<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use App\PingerService;
use App\GRPC\Pinger\PingRequest;
use App\GRPC\Pinger\PingResponse;
use Spiral\GRPC\ContextInterface;

class PingerServiceTest extends TestCase
{
    private $service;
    private $contextMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PingerService();
        $this->contextMock = $this->createMock(ContextInterface::class);
    }

    public function testPingReturnsEchoedMessage(): void
    {
        $testMessage = "Hello gRPC from PHPUnit!";

        $request = new PingRequest();
        $request->setMessage($testMessage);

        $response = $this->service->Ping($this->contextMock, $request);

        $this->assertInstanceOf(PingResponse::class, $response);
        $this->assertSame($testMessage, $response->getMessage());
    }

    public function testPingWithEmptyString(): void
    {
        $request = new PingRequest();
        $request->setMessage("");

        $response = $this->service->Ping($this->contextMock, $request);

        $this->assertInstanceOf(PingResponse::class, $response);
        $this->assertSame("", $response->getMessage());
    }
}

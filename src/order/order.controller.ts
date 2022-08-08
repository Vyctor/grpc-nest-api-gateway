import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateOrderResponse,
  OrderServiceClient,
  ORDER_SERVICE_NAME,
  CreateOrderRequest,
} from './order.pb';
import { Observable } from 'rxjs/internal/Observable';
import { Request } from 'express';

@Controller('order')
export class OrderController implements OnModuleInit {
  private orderServiceClient: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.orderServiceClient =
      this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createOrder(
    @Req() request: Request,
  ): Promise<Observable<CreateOrderResponse>> {
    const body: CreateOrderRequest = request.body;

    body.userId = <number>request['user'];

    return this.orderServiceClient.createOrder(body);
  }
}

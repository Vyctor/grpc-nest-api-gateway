import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME, ORDER_SERVICE_NAME } from './order.pb';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: ORDER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: ORDER_PACKAGE_NAME,
          protoPath: 'node_modules/grpc-nest-proto/proto/order.proto',
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [AuthGuard],
})
export class OrderModule {}

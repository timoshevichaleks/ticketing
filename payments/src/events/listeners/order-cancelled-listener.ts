import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@altick/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name';
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  public readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  public readonly queueGroupName: string = queueGroupName;

  public constructor(client: Stan) {
    super(client);
  }

  public async onMessage(data: OrderCancelledEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}

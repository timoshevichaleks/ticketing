import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@altick/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  public readonly subject: Subjects.PaymentsCreated = Subjects.PaymentsCreated;

  public readonly queueGroupName: string = queueGroupName;

  public constructor(client: Stan) {
    super(client);
  }

  public async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}

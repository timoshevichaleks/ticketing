import { Listener, OrderCreatedEvent, Subjects } from "@altick/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  public readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;

  public readonly queueGroupName: string = queueGroupName;

  public constructor(client: Stan) {
    super(client);
  }

  public async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}

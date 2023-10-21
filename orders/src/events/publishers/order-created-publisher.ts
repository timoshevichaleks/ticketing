import { OrderCreatedEvent, Publisher, Subjects } from "@altick/common";
import { Stan } from "node-nats-streaming";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  public readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;

  public constructor(client: Stan) {
    super(client);
  }
}

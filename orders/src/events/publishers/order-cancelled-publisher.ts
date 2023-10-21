import { OrderCancelledEvent, Publisher, Subjects } from "@altick/common";
import { Stan } from "node-nats-streaming";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  public readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  public constructor(client: Stan) {
    super(client);
  }
}
